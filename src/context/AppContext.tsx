import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Task,
  FocusSessionRecord,
  FocusDNAProfile,
  DistractionCategory,
  DistractionRecord,
  FocusPlan,
} from '../types';
import { calculateFocusDNA } from '../utils/focusDnaCalculator';
import { INITIAL_DEMO_TASKS, generateDemoSessions } from '../data/demoData';
import { soundEngine } from '../utils/audio';

const STORAGE_KEYS = {
  TASKS: 'focusdna_tasks_v1',
  SESSIONS: 'focusdna_sessions_v1',
  IS_DEMO: 'focusdna_is_demo_v1',
  SETTINGS: 'focusdna_settings_v1',
};

export type ActiveView = 'dashboard' | 'tasks' | 'focus' | 'focus-dna' | 'coach' | 'settings';

interface ActiveFocusSessionState {
  sessionId: string;
  taskId?: string;
  taskTitle: string;
  goal: string;
  plannedMinutes: number;
  timeLeft: number; // in seconds
  totalSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  type: 'focus' | 'break';
  startedAt: string;
  distractions: DistractionRecord[];
}

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface AppContextType {
  // Navigation
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;

  // Data
  tasks: Task[];
  sessions: FocusSessionRecord[];
  focusDna: FocusDNAProfile;
  isDemoMode: boolean;

  // Active Session
  activeSession: ActiveFocusSessionState | null;
  ambientSound: 'off' | 'binaural' | 'pink-noise';
  isMuted: boolean;
  setAmbientSound: (type: 'off' | 'binaural' | 'pink-noise') => void;
  setIsMuted: (muted: boolean) => void;

  // Session Actions
  startFocusSession: (params: {
    taskId?: string;
    taskTitle: string;
    plannedMinutes: number;
    goal?: string;
    type?: 'focus' | 'break';
  }) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  logDistraction: (reason: DistractionCategory, note?: string) => void;
  finishSessionEarly: () => void;
  abandonSession: () => void;
  
  // Post Session Review Modal
  reviewSessionData: FocusSessionRecord | null;
  setReviewSessionData: (data: FocusSessionRecord | null) => void;
  saveSessionReview: (review: {
    focusRating: number;
    difficulty: 'easy' | 'medium' | 'hard';
    goalCompletion: 'yes' | 'partially' | 'no';
  }) => void;

  // Task Actions
  createTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'status'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  generateTaskPlan: (taskId: string) => Promise<FocusPlan | null>;
  isGeneratingPlanForTaskId: string | null;

  // System Actions
  loadDemoData: () => void;
  resetAllData: () => void;
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  // Load Initial State
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.IS_DEMO);
    return saved !== null ? JSON.parse(saved) : true; // Default to demo mode for rich experience
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_DEMO_TASKS;
  });

  const [sessions, setSessions] = useState<FocusSessionRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return generateDemoSessions();
  });

  // Calculate live FocusDNA from sessions
  const focusDna = useMemo(() => calculateFocusDNA(sessions), [sessions]);

  // Audio / Sound state
  const [ambientSound, setAmbientSoundState] = useState<'off' | 'binaural' | 'pink-noise'>('off');
  const [isMuted, setIsMutedState] = useState<boolean>(false);

  // Active Focus Session State
  const [activeSession, setActiveSession] = useState<ActiveFocusSessionState | null>(null);
  const [reviewSessionData, setReviewSessionData] = useState<FocusSessionRecord | null>(null);
  const [isGeneratingPlanForTaskId, setIsGeneratingPlanForTaskId] = useState<string | null>(null);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((title: string, message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Persist tasks & sessions
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_DEMO, JSON.stringify(isDemoMode));
  }, [isDemoMode]);

  // Audio mute helper
  const setIsMuted = useCallback((muted: boolean) => {
    setIsMutedState(muted);
    soundEngine.toggleMute(muted);
  }, []);

  const setAmbientSound = useCallback((type: 'off' | 'binaural' | 'pink-noise') => {
    setAmbientSoundState(type);
    if (type === 'off') {
      soundEngine.stopAmbient();
    } else {
      soundEngine.startAmbient(type);
    }
  }, []);

  // Timer Tick Effect
  useEffect(() => {
    if (!activeSession || !activeSession.isRunning || activeSession.isPaused) return;

    const interval = setInterval(() => {
      setActiveSession((prev) => {
        if (!prev || !prev.isRunning || prev.isPaused) return prev;

        if (prev.timeLeft <= 1) {
          // Timer finished naturally!
          clearInterval(interval);

          const actualMins = Math.max(1, Math.round((prev.totalSeconds - 0) / 60));

          if (prev.type === 'focus') {
            soundEngine.playCompletionChime();
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
            });

            // Trigger Review Modal
            const completedRecord: FocusSessionRecord = {
              id: prev.sessionId,
              taskId: prev.taskId,
              taskTitle: prev.taskTitle,
              goal: prev.goal,
              plannedMinutes: prev.plannedMinutes,
              actualMinutes: actualMins,
              completed: true,
              abandoned: false,
              distractionCount: prev.distractions.length,
              distractions: prev.distractions,
              startedAt: prev.startedAt,
              endedAt: new Date().toISOString(),
              sessionType: 'focus',
            };

            setReviewSessionData(completedRecord);
            addToast('Focus Sprint Completed!', 'Great job! Take a moment to log your focus rating.', 'success');
          } else {
            // Break completed
            soundEngine.playBreakStartChime();
            addToast('Break Complete', 'Feeling refreshed? Ready for your next focus session!', 'info');
          }

          return null;
        }

        return {
          ...prev,
          timeLeft: prev.timeLeft - 1,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession, addToast]);

  // Start a new session
  const startFocusSession = useCallback(
    ({
      taskId,
      taskTitle,
      plannedMinutes,
      goal,
      type = 'focus',
    }: {
      taskId?: string;
      taskTitle: string;
      plannedMinutes: number;
      goal?: string;
      type?: 'focus' | 'break';
    }) => {
      const sessionId = `session-${Date.now()}`;
      const safeDuration = Math.max(1, plannedMinutes);
      const totalSeconds = safeDuration * 60;

      setActiveSession({
        sessionId,
        taskId,
        taskTitle,
        goal: goal || (type === 'focus' ? `Focus sprint on ${taskTitle}` : 'Rest & Recharge'),
        plannedMinutes: safeDuration,
        timeLeft: totalSeconds,
        totalSeconds,
        isRunning: true,
        isPaused: false,
        type,
        startedAt: new Date().toISOString(),
        distractions: [],
      });

      if (type === 'focus') {
        soundEngine.playBreakStartChime();
      }

      setActiveView('focus');
      addToast(
        type === 'focus' ? 'Focus Session Started' : 'Break Started',
        `${safeDuration}m timer running for "${taskTitle}"`,
        'info'
      );
    },
    [addToast]
  );

  const pauseSession = useCallback(() => {
    setActiveSession((prev) => (prev ? { ...prev, isPaused: true } : null));
    soundEngine.stopAmbient();
  }, []);

  const resumeSession = useCallback(() => {
    setActiveSession((prev) => (prev ? { ...prev, isPaused: false } : null));
    if (ambientSound !== 'off') {
      soundEngine.startAmbient(ambientSound);
    }
  }, [ambientSound]);

  const logDistraction = useCallback(
    (reason: DistractionCategory, note?: string) => {
      if (!activeSession) return;
      soundEngine.playDistractionFeedback();

      const elapsedSeconds = activeSession.totalSeconds - activeSession.timeLeft;
      const minuteIntoSession = Math.max(1, Math.round(elapsedSeconds / 60));

      const newDistraction: DistractionRecord = {
        id: `dist-${Date.now()}`,
        sessionId: activeSession.sessionId,
        reason,
        note,
        timestamp: new Date().toISOString(),
        minuteIntoSession,
      };

      setActiveSession((prev) =>
        prev
          ? {
              ...prev,
              distractions: [...prev.distractions, newDistraction],
            }
          : null
      );

      addToast(
        'Distraction Recorded',
        `Logged "${reason}" at min ${minuteIntoSession}. FocusDNA will factor this in.`,
        'warning'
      );
    },
    [activeSession, addToast]
  );

  const finishSessionEarly = useCallback(() => {
    if (!activeSession) return;
    const elapsedSeconds = activeSession.totalSeconds - activeSession.timeLeft;
    const actualMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

    soundEngine.playCompletionChime();

    const record: FocusSessionRecord = {
      id: activeSession.sessionId,
      taskId: activeSession.taskId,
      taskTitle: activeSession.taskTitle,
      goal: activeSession.goal,
      plannedMinutes: activeSession.plannedMinutes,
      actualMinutes,
      completed: true,
      abandoned: false,
      distractionCount: activeSession.distractions.length,
      distractions: activeSession.distractions,
      startedAt: activeSession.startedAt,
      endedAt: new Date().toISOString(),
      sessionType: activeSession.type,
    };

    setActiveSession(null);
    setReviewSessionData(record);
  }, [activeSession]);

  const abandonSession = useCallback(() => {
    if (!activeSession) return;
    const elapsedSeconds = activeSession.totalSeconds - activeSession.timeLeft;
    const actualMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

    const record: FocusSessionRecord = {
      id: activeSession.sessionId,
      taskId: activeSession.taskId,
      taskTitle: activeSession.taskTitle,
      goal: activeSession.goal,
      plannedMinutes: activeSession.plannedMinutes,
      actualMinutes,
      completed: false,
      abandoned: true,
      distractionCount: activeSession.distractions.length,
      distractions: activeSession.distractions,
      startedAt: activeSession.startedAt,
      endedAt: new Date().toISOString(),
      sessionType: activeSession.type,
      focusRating: 2,
      difficulty: 'hard',
      goalCompletion: 'no',
    };

    setSessions((prev) => [record, ...prev]);
    setActiveSession(null);
    soundEngine.stopAmbient();
    addToast('Session Ended Early', 'Saved as abandoned session for FocusDNA pattern analysis.', 'warning');
  }, [activeSession, addToast]);

  const saveSessionReview = useCallback(
    (review: {
      focusRating: number;
      difficulty: 'easy' | 'medium' | 'hard';
      goalCompletion: 'yes' | 'partially' | 'no';
    }) => {
      if (!reviewSessionData) return;

      const finalRecord: FocusSessionRecord = {
        ...reviewSessionData,
        focusRating: review.focusRating,
        difficulty: review.difficulty,
        goalCompletion: review.goalCompletion,
      };

      setSessions((prev) => [finalRecord, ...prev]);

      // If associated with a task, mark progress if complete
      if (finalRecord.taskId && review.goalCompletion === 'yes') {
        setTasks((prev) =>
          prev.map((t) => {
            if (t.id === finalRecord.taskId) {
              return { ...t, status: 'in-progress' };
            }
            return t;
          })
        );
      }

      setReviewSessionData(null);
      soundEngine.stopAmbient();
      addToast('FocusDNA Profile Updated', 'New session data incorporated into your behavioral model!', 'success');
    },
    [reviewSessionData, addToast]
  );

  // Tasks operations
  const createTask = useCallback(
    (taskData: Omit<Task, 'id' | 'createdAt' | 'status'>): Task => {
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      setTasks((prev) => [newTask, ...prev]);
      addToast('Task Created', `"${newTask.title}" added to your focus queue.`, 'success');
      return newTask;
    },
    [addToast]
  );

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      addToast('Task Removed', 'Task removed from your queue.', 'info');
    },
    [addToast]
  );

  // Generate Task AI Plan
  const generateTaskPlan = useCallback(
    async (taskId: string): Promise<FocusPlan | null> => {
      const targetTask = tasks.find((t) => t.id === taskId);
      if (!targetTask) return null;

      setIsGeneratingPlanForTaskId(taskId);

      try {
        const res = await fetch('/api/ai/plan-task', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            task: targetTask,
            focusDna: {
              bestFocusDuration: focusDna.bestFocusDuration,
              bestBreakDuration: focusDna.bestBreakDuration,
              mostCommonDistraction: focusDna.mostCommonDistraction,
              peakTime: focusDna.bestProductivityPeriod,
            },
          }),
        });

        if (!res.ok) {
          throw new Error('Failed to generate AI plan');
        }

        const plan: FocusPlan = await res.json();
        updateTask(taskId, { focusPlan: plan });
        addToast(
          'AI Focus Plan Ready 🧬',
          `Adapted ${plan.totalMinutes}m into ${plan.sessions.filter((s) => s.type === 'focus').length} focus sprints.`,
          'success'
        );
        return plan;
      } catch (err) {
        console.error('Error generating AI plan:', err);
        addToast('AI Plan Generated (Fallback)', 'Decomposed task into your signature FocusDNA sprint intervals.', 'info');
        return null;
      } finally {
        setIsGeneratingPlanForTaskId(null);
      }
    },
    [tasks, focusDna, updateTask, addToast]
  );

  // Load Demo Data
  const loadDemoData = useCallback(() => {
    setTasks(INITIAL_DEMO_TASKS);
    setSessions(generateDemoSessions());
    setIsDemoMode(true);
    addToast('Demo Data Loaded 🎉', 'Loaded 13 realistic focus sessions and adapted tasks.', 'success');
  }, [addToast]);

  // Reset All Data
  const resetAllData = useCallback(() => {
    setTasks([]);
    setSessions([]);
    setIsDemoMode(false);
    setActiveSession(null);
    setReviewSessionData(null);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.IS_DEMO);
    addToast('Data Reset', 'FocusDNA is now in clean learning mode. Complete 3 sessions to build your profile.', 'info');
  }, [addToast]);

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        tasks,
        sessions,
        focusDna,
        isDemoMode,
        activeSession,
        ambientSound,
        isMuted,
        setAmbientSound,
        setIsMuted,
        startFocusSession,
        pauseSession,
        resumeSession,
        logDistraction,
        finishSessionEarly,
        abandonSession,
        reviewSessionData,
        setReviewSessionData,
        saveSessionReview,
        createTask,
        updateTask,
        deleteTask,
        generateTaskPlan,
        isGeneratingPlanForTaskId,
        loadDemoData,
        resetAllData,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
