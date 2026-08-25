import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Plus,
  Sparkles,
  Play,
  CheckCircle2,
  Trash2,
  Calendar,
  Clock,
  Dna,
  Zap,
  ArrowRight,
  Edit2,
  Check,
} from 'lucide-react';
import { Task, Priority, Difficulty, FocusPlan } from '../types';

export const TasksView: React.FC = () => {
  const {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    generateTaskPlan,
    isGeneratingPlanForTaskId,
    startFocusSession,
    focusDna,
  } = useApp();

  // Create Task Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('Tomorrow');
  const [priority, setPriority] = useState<Priority>('high');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(120);
  const [difficulty, setDifficulty] = useState<Difficulty>('hard');
  const [selectedPlanTask, setSelectedPlanTask] = useState<Task | null>(null);

  const handleCreateAndPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = createTask({
      title: title.trim(),
      description: description.trim() || undefined,
      deadline: deadline.trim() || undefined,
      priority,
      estimatedMinutes,
      difficulty,
    });

    // Reset inputs
    setTitle('');
    setDescription('');

    // Immediately trigger AI Focus Plan generation
    const plan = await generateTaskPlan(newTask.id);
    if (plan) {
      setSelectedPlanTask({ ...newTask, focusPlan: plan });
    }
  };

  const handleStartPlanSession = (task: Task, sessionIndex: number) => {
    if (!task.focusPlan) return;
    const session = task.focusPlan.sessions[sessionIndex];
    if (!session) return;

    startFocusSession({
      taskId: task.id,
      taskTitle: task.title,
      plannedMinutes: session.duration,
      goal: session.goal,
      type: session.type,
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">
            Task Creation & AI Focus Planner
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            FocusDNA deconstructs complex goals into adaptive sprints tuned to your focus endurance.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Dna className="w-4 h-4 text-indigo-400" />
          <span>Profile Sprint Baseline: {focusDna.bestFocusDuration}m</span>
        </div>
      </div>

      {/* Main Grid: Left is Creation Form, Right is Task List & AI Plan Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 5 Cols: Create Task Form */}
        <div className="lg:col-span-5">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-5 sticky top-6">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
              <Plus className="w-4 h-4 text-indigo-400" />
              <h2 className="text-base font-bold text-zinc-100">Create Task</h2>
            </div>

            <form onSubmit={handleCreateAndPlan} className="space-y-4">
              {/* Task Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  Task Name <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Study DBMS Normalization"
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700/80 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Description / Key Objectives</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Master functional dependencies and solve practice decomposition questions."
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-700/80 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>

              {/* Deadline & Estimated Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Deadline</label>
                  <input
                    type="text"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder="e.g. Tomorrow / Friday"
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-700/80 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Estimated Total Time</label>
                  <select
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700/80 rounded-xl text-xs text-zinc-200"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes (1 hr)</option>
                    <option value={90}>90 minutes (1.5 hrs)</option>
                    <option value={120}>120 minutes (2 hrs)</option>
                    <option value={180}>180 minutes (3 hrs)</option>
                  </select>
                </div>
              </div>

              {/* Priority & Difficulty */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Priority</label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`py-1.5 text-[11px] font-semibold capitalize rounded-lg border transition-all ${
                          priority === p
                            ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Difficulty</label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDifficulty(d)}
                        className={`py-1.5 text-[11px] font-semibold capitalize rounded-lg border transition-all ${
                          difficulty === d
                            ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 hover:opacity-95 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-zinc-950" />
                <span>Generate Focus Plan with Gemini</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right 7 Cols: Active Tasks & Selected Focus Plan */}
        <div className="lg:col-span-7 space-y-6">
          {/* Selected Task AI Focus Plan Preview */}
          {selectedPlanTask && selectedPlanTask.focusPlan && (
            <div className="bg-gradient-to-br from-indigo-950/40 via-zinc-900/90 to-zinc-900 border border-indigo-500/40 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3 h-3" />
                    <span>YOUR AI FOCUS PLAN</span>
                  </div>
                  <h2 className="text-lg font-bold text-zinc-100">{selectedPlanTask.title}</h2>
                  <p className="text-xs text-zinc-400">
                    Total duration: {selectedPlanTask.focusPlan.totalMinutes} minutes ·{' '}
                    {selectedPlanTask.focusPlan.sessions.filter((s) => s.type === 'focus').length} focus sprints
                  </p>
                </div>

                <button
                  onClick={() => setSelectedPlanTask(null)}
                  className="text-zinc-500 hover:text-zinc-300 text-xs"
                >
                  Close Plan
                </button>
              </div>

              {selectedPlanTask.focusPlan.aiRationale && (
                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 flex items-start gap-2">
                  <Dna className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{selectedPlanTask.focusPlan.aiRationale}</span>
                </div>
              )}

              {/* Timeline Sequence of Sprints and Breaks */}
              <div className="space-y-2.5">
                {selectedPlanTask.focusPlan.sessions.map((sess, idx) => {
                  const isFocus = sess.type === 'focus';
                  return (
                    <div
                      key={sess.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                        isFocus
                          ? 'bg-zinc-950/80 border-indigo-500/30 hover:border-indigo-500/60'
                          : 'bg-zinc-950/30 border-zinc-800/60 opacity-80'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                            isFocus
                              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                              : 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {sess.duration}m
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
                            {isFocus ? `Sprint ${Math.floor(idx / 2) + 1}` : 'Recovery Break'}
                          </span>
                          <p className="text-xs font-medium text-zinc-200 truncate">{sess.goal}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleStartPlanSession(selectedPlanTask, idx)}
                        className="shrink-0 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold flex items-center gap-1 shadow-sm transition-all"
                      >
                        <Play className="w-3 h-3 fill-zinc-950" />
                        <span>Start</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Tasks Queue */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-zinc-100">All Tasks ({tasks.length})</h2>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => {
                const isCompleted = task.status === 'completed';
                const isGenerating = isGeneratingPlanForTaskId === task.id;

                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCompleted
                        ? 'bg-zinc-950/40 border-zinc-800/40 opacity-60'
                        : 'bg-zinc-900/70 border-zinc-800/80 shadow-md hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <button
                          onClick={() =>
                            updateTask(task.id, {
                              status: isCompleted ? 'pending' : 'completed',
                            })
                          }
                          className="mt-1 text-zinc-500 hover:text-emerald-400 transition-colors shrink-0"
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                          ) : (
                            <div className="w-5 h-5 rounded-md border border-zinc-600 hover:border-zinc-400" />
                          )}
                        </button>

                        <div className="space-y-1 min-w-0">
                          <h3
                            className={`text-sm font-bold text-zinc-100 ${
                              isCompleted ? 'line-through text-zinc-500' : ''
                            }`}
                          >
                            {task.title}
                          </h3>

                          {task.description && (
                            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px] text-zinc-400">
                            <span
                              className={`font-semibold uppercase px-1.5 py-0.2 rounded border ${
                                task.priority === 'high'
                                  ? 'bg-rose-950/60 text-rose-300 border-rose-500/30'
                                  : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                              }`}
                            >
                              {task.priority} Priority
                            </span>
                            <span
                              className={`font-semibold uppercase px-1.5 py-0.2 rounded border ${
                                task.difficulty === 'hard'
                                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                              }`}
                            >
                              {task.difficulty}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {task.estimatedMinutes}m total
                            </span>
                            {task.deadline && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {task.deadline}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-zinc-600 hover:text-rose-400 p-1 transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-center justify-between gap-2">
                      {task.focusPlan ? (
                        <button
                          onClick={() => setSelectedPlanTask(task)}
                          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>
                            View AI Plan (
                            {task.focusPlan.sessions.filter((s) => s.type === 'focus').length} sprints)
                          </span>
                        </button>
                      ) : (
                        <button
                          onClick={async () => {
                            const plan = await generateTaskPlan(task.id);
                            if (plan) setSelectedPlanTask({ ...task, focusPlan: plan });
                          }}
                          disabled={isGenerating}
                          className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{isGenerating ? 'Generating Plan...' : 'Generate AI Focus Plan'}</span>
                        </button>
                      )}

                      <button
                        onClick={() =>
                          startFocusSession({
                            taskId: task.id,
                            taskTitle: task.title,
                            plannedMinutes: focusDna.bestFocusDuration || 23,
                            goal: task.description || `Sprint on ${task.title}`,
                          })
                        }
                        className="px-3.5 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <Play className="w-3 h-3 fill-zinc-950" />
                        <span>Start Sprint ({focusDna.bestFocusDuration}m)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
