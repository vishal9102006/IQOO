import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Play,
  Flame,
  CheckCircle2,
  Clock,
  Dna,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Plus,
  ArrowRight,
  Zap,
  Target,
} from 'lucide-react';
import { Task } from '../types';

export const DashboardView: React.FC = () => {
  const {
    tasks,
    sessions,
    focusDna,
    setActiveView,
    startFocusSession,
    updateTask,
    createTask,
    generateTaskPlan,
    isGeneratingPlanForTaskId,
    isDemoMode,
    loadDemoData,
  } = useApp();

  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickMinutes, setQuickMinutes] = useState(focusDna.bestFocusDuration || 23);

  // Dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Today's stats calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter((s) => s.startedAt && s.startedAt.startsWith(todayStr));
  const todayFocusMinutes = todaySessions.reduce((sum, s) => sum + (s.actualMinutes || 0), 0);
  const completedTasksCount = tasks.filter((t) => t.status === 'completed').length;

  const handleStartTaskFocus = (task: Task) => {
    startFocusSession({
      taskId: task.id,
      taskTitle: task.title,
      plannedMinutes: focusDna.bestFocusDuration || 23,
      goal: task.description || `Sprint on ${task.title}`,
    });
  };

  const handleQuickCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    createTask({
      title: quickTitle.trim(),
      estimatedMinutes: quickMinutes,
      priority: 'high',
      difficulty: 'medium',
    });
    setQuickTitle('');
    setIsQuickCreateOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* Top Greeting & Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">
              {getGreeting()} 👋
            </h1>
            {isDemoMode && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wide">
                Demo Mode
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-400">
            FocusDNA has analyzed your work rhythms. Here is your productivity forecast.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('tasks')}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-200 transition-colors flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5 text-zinc-400" />
            <span>New Task</span>
          </button>

          <button
            onClick={() =>
              startFocusSession({
                taskTitle: 'Adaptive Deep Focus Sprint',
                plannedMinutes: focusDna.bestFocusDuration || 23,
                goal: `High performance sprint (${focusDna.bestFocusDuration || 23}m)`,
              })
            }
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-400 hover:opacity-95 text-zinc-950 font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-zinc-950" />
            <span>Start Focus ({focusDna.bestFocusDuration}m)</span>
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 1. Focus Score */}
        <div
          onClick={() => setActiveView('focus-dna')}
          className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl shadow-lg hover:border-indigo-500/40 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Focus Score
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <Dna className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-zinc-100 tracking-tight">
              {focusDna.hasSufficientData ? `${focusDna.focusScore}%` : 'Learning'}
            </span>
            {focusDna.weeklyTrend !== 0 && (
              <span className="text-xs font-bold text-emerald-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                +{focusDna.weeklyTrend}%
              </span>
            )}
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full bg-zinc-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-1.5 rounded-full transition-all duration-1000"
              style={{ width: `${focusDna.focusScore || 50}%` }}
            />
          </div>

          <p className="text-[11px] text-zinc-400 mt-2 font-medium">
            {focusDna.hasSufficientData
              ? 'Based on 4 behavioral pillars'
              : 'Complete 3 sessions to unlock score'}
          </p>
        </div>

        {/* 2. Today's Focus Time */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Today's Focus
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-zinc-100 tracking-tight">
              {todayFocusMinutes}
            </span>
            <span className="text-sm font-medium text-zinc-400">min</span>
          </div>

          <p className="text-[11px] text-zinc-400 mt-3 font-medium">
            {todaySessions.length} session{todaySessions.length === 1 ? '' : 's'} recorded today
          </p>
        </div>

        {/* 3. Streak & Rhythm */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Current Streak
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Flame className="w-4 h-4 fill-amber-400" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-zinc-100 tracking-tight">
              {focusDna.streakDays}
            </span>
            <span className="text-sm font-medium text-zinc-400">days streak</span>
          </div>

          <p className="text-[11px] text-zinc-400 mt-3 font-medium">
            Peak Window: {focusDna.bestProductivityPeriod.split(' ')[0]}
          </p>
        </div>

        {/* 4. Best Focus Duration (DNA Core) */}
        <div
          onClick={() => setActiveView('focus-dna')}
          className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-zinc-900/80 to-zinc-900/40 border border-indigo-500/30 backdrop-blur-xl shadow-lg cursor-pointer hover:border-indigo-400/60 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Sweet-Spot Duration
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-indigo-100 tracking-tight">
              {focusDna.bestFocusDuration}
            </span>
            <span className="text-sm font-medium text-indigo-300">min sprint</span>
          </div>

          <p className="text-[11px] text-indigo-300/80 mt-3 font-medium flex items-center gap-1">
            <span>Drop-off detected past 30m</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>
      </div>

      {/* AI Adaptive Intelligence Callout Banner */}
      <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-zinc-900/90 to-purple-950/50 border border-indigo-500/30 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                FocusDNA Adaptive Intelligence
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                Active Rule
              </span>
            </div>
            <p className="text-sm font-medium text-zinc-200 leading-relaxed">
              {focusDna.hasSufficientData
                ? `You perform 27% better during ${focusDna.bestProductivityPeriod}. Difficult tasks scheduled now will default to ${focusDna.bestFocusDuration}m high-focus intervals.`
                : 'FocusDNA is actively monitoring your session drop-off curves. Complete 3 sessions to enable custom sprint adaptations.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveView('coach')}
          className="shrink-0 px-4 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-xs font-semibold text-zinc-100 border border-zinc-700 transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <span>Ask AI Coach</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Two Column Layout: Today's Tasks + Recent Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Tasks & Sprints */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" />
              <h2 className="text-base font-bold text-zinc-100">Today's Focus Tasks</h2>
              <span className="text-xs text-zinc-400">
                ({completedTasksCount} / {tasks.length} done)
              </span>
            </div>

            <button
              onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)}
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Quick Task</span>
            </button>
          </div>

          {/* Quick Create Task Form */}
          {isQuickCreateOpen && (
            <form
              onSubmit={handleQuickCreate}
              className="p-4 rounded-xl bg-zinc-900 border border-zinc-700/80 space-y-3 animate-in fade-in duration-150"
            >
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  placeholder="Task title (e.g. Study DBMS Normalization)..."
                  className="flex-1 px-3.5 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
                <select
                  value={quickMinutes}
                  onChange={(e) => setQuickMinutes(Number(e.target.value))}
                  className="px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-zinc-300"
                >
                  <option value={15}>15 min</option>
                  <option value={20}>20 min</option>
                  <option value={focusDna.bestFocusDuration || 23}>
                    {focusDna.bestFocusDuration} min (DNA Sweet-spot)
                  </option>
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>60 min</option>
                  <option value={120}>120 min</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg shadow-sm"
                >
                  Save Task
                </button>
              </div>
            </form>
          )}

          {/* Tasks List */}
          <div className="space-y-2.5">
            {tasks.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800/60 space-y-3">
                <p className="text-sm text-zinc-400">No tasks in your queue right now.</p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setActiveView('tasks')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
                  >
                    Create a Task
                  </button>
                  <button
                    onClick={loadDemoData}
                    className="px-4 py-2 bg-zinc-800 text-zinc-200 rounded-xl text-xs font-semibold"
                  >
                    Load Demo Data
                  </button>
                </div>
              </div>
            ) : (
              tasks.slice(0, 5).map((task) => {
                const isCompleted = task.status === 'completed';
                const isGeneratingPlan = isGeneratingPlanForTaskId === task.id;

                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      isCompleted
                        ? 'bg-zinc-950/40 border-zinc-800/40 opacity-60'
                        : 'bg-zinc-900/70 hover:bg-zinc-900 border-zinc-800/80 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <button
                        onClick={() =>
                          updateTask(task.id, {
                            status: isCompleted ? 'pending' : 'completed',
                          })
                        }
                        className="mt-0.5 text-zinc-500 hover:text-emerald-400 transition-colors shrink-0"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-950" />
                        ) : (
                          <div className="w-4 h-4 rounded border border-zinc-600 hover:border-zinc-400" />
                        )}
                      </button>

                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3
                            className={`text-sm font-semibold text-zinc-200 truncate ${
                              isCompleted ? 'line-through text-zinc-500' : ''
                            }`}
                          >
                            {task.title}
                          </h3>
                          <span
                            className={`text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded border ${
                              task.difficulty === 'hard'
                                ? 'bg-rose-950/60 text-rose-300 border-rose-500/30'
                                : task.difficulty === 'medium'
                                ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                                : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                            }`}
                          >
                            {task.difficulty}
                          </span>
                          <span className="text-[11px] text-zinc-400">
                            {task.estimatedMinutes}m
                          </span>
                        </div>

                        {task.focusPlan && (
                          <p className="text-[11px] text-indigo-400 font-medium">
                            ⚡ AI Focus Plan:{' '}
                            {task.focusPlan.sessions.filter((s) => s.type === 'focus').length} sprints
                            ({focusDna.bestFocusDuration}m intervals)
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                      {!task.focusPlan && (
                        <button
                          onClick={() => generateTaskPlan(task.id)}
                          disabled={isGeneratingPlan}
                          className="px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-300 text-xs font-medium transition-all flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{isGeneratingPlan ? 'Planning...' : 'AI Plan'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleStartTaskFocus(task)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-zinc-950" />
                        <span>Focus</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 1 Col: Recent Focus Sessions Timeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-zinc-100">Recent Sessions</h2>
            </div>
            <button
              onClick={() => setActiveView('focus-dna')}
              className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              View Analytics →
            </button>
          </div>

          <div className="space-y-2.5">
            {sessions.slice(0, 4).map((s) => (
              <div
                key={s.id}
                className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/70 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-200 truncate max-w-[170px]">
                    {s.taskTitle}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      s.completed
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {s.completed ? 'Completed' : 'Abandoned'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>{s.actualMinutes} min focus</span>
                  {s.distractionCount > 0 ? (
                    <span className="text-amber-400 flex items-center gap-1 font-medium">
                      <AlertTriangle className="w-3 h-3" />
                      {s.distractionCount} distraction(s)
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-medium">0 distractions ✨</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
