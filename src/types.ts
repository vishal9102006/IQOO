export type Priority = 'low' | 'medium' | 'high';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type DistractionCategory =
  | 'Phone'
  | 'Messaging'
  | 'Browsing'
  | 'Tired'
  | 'Break / Snack'
  | 'Noise'
  | 'Lost Focus'
  | 'Other';

export interface DistractionRecord {
  id: string;
  sessionId: string;
  reason: DistractionCategory;
  note?: string;
  timestamp: string; // ISO string
  minuteIntoSession: number;
}

export interface PlannedSession {
  id: string;
  duration: number; // in minutes
  type: 'focus' | 'break';
  goal: string;
  completed?: boolean;
}

export interface FocusPlan {
  taskTitle: string;
  totalMinutes: number;
  sessions: PlannedSession[];
  generatedAt: string;
  adaptedFromDNA: boolean;
  aiRationale?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  priority: Priority;
  estimatedMinutes: number;
  difficulty: Difficulty;
  status: TaskStatus;
  createdAt: string;
  focusPlan?: FocusPlan;
}

export interface FocusSessionRecord {
  id: string;
  taskId?: string;
  taskTitle: string;
  plannedMinutes: number;
  actualMinutes: number;
  completed: boolean;
  abandoned: boolean;
  focusRating?: number; // 1 to 5
  difficulty?: Difficulty;
  goalCompletion?: 'yes' | 'partially' | 'no';
  distractionCount: number;
  distractions: DistractionRecord[];
  startedAt: string;
  endedAt: string;
  sessionType: 'focus' | 'break';
  goal?: string;
}

export interface DurationBucket {
  range: string;
  min: number;
  max: number;
  count: number;
  completedCount: number;
  successRate: number; // 0 to 100
  avgDistractions: number;
}

export interface DistractionStat {
  reason: DistractionCategory;
  count: number;
  percentage: number;
}

export interface TimeOfDayStat {
  period: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  label: string;
  hours: string;
  score: number;
  sessionCount: number;
  completionRate: number;
}

export interface DailyFocusStat {
  day: string;
  date: string;
  minutes: number;
  sessionCount: number;
  score: number;
}

export interface AdaptiveRule {
  id: string;
  title: string;
  observation: string;
  recommendation: string;
  appliedParameter: string;
  confidence: 'high' | 'medium' | 'emerging';
  category: 'duration' | 'timing' | 'distraction' | 'pacing';
}

export interface FocusDNAProfile {
  hasSufficientData: boolean;
  totalSessions: number;
  totalFocusMinutes: number;
  bestFocusDuration: number; // in minutes
  bestProductivityPeriod: string; // e.g. "7 PM – 9 PM"
  avgDistractionsPerSession: number;
  mostCommonDistraction: DistractionCategory | 'None';
  bestBreakDuration: number; // in minutes
  focusScore: number; // 0 - 100
  weeklyTrend: number; // e.g. +18 (%)
  completionRate: number; // 0 - 100
  streakDays: number;
  durationBuckets: DurationBucket[];
  distractionBreakdown: DistractionStat[];
  timeOfDayBreakdown: TimeOfDayStat[];
  dailyFocusHistory: DailyFocusStat[];
  adaptiveRules: AdaptiveRule[];
}

export interface CoachMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  referencedData?: {
    focusScore?: number;
    bestDuration?: number;
    commonDistraction?: string;
    peakTime?: string;
  };
}
