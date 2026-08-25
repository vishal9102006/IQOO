import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Sparkles,
  Clock,
  Play,
  CheckCircle,
  AlertCircle,
  X,
  Zap,
  Coffee,
  Brain,
  RefreshCw,
} from 'lucide-react';
import { ScheduledTimeSlot } from '../types';

export const CircadianScheduleModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const {
    optimizedDayPlan,
    isOptimizingDay,
    optimizeDaySchedule,
    focusDna,
    startFocusSession,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'Morning' | 'Afternoon' | 'Evening'>('all');

  if (!isOpen) return null;

  const handleLaunchSlot = (slot: ScheduledTimeSlot) => {
    if (slot.type === 'focus') {
      startFocusSession({
        taskId: slot.taskId,
        taskTitle: slot.taskTitle,
        plannedMinutes: slot.durationMinutes,
        goal: slot.cognitiveNote,
        type: 'focus',
      });
    } else {
      startFocusSession({
        taskTitle: slot.taskTitle,
        plannedMinutes: slot.durationMinutes,
        goal: slot.cognitiveNote,
        type: 'break',
      });
    }
    onClose();
  };

  const filteredSlots = optimizedDayPlan?.schedule.filter((slot) => {
    if (activeTab === 'all') return true;
    return slot.period === activeTab;
  }) || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-750 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            <span>Circadian Day Optimizer · FocusDNA</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <span>Synchronized Daily Schedule</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </h2>
          <p className="text-xs text-zinc-400">
            Intelligently pairs hard analytical tasks with your peak window ({focusDna.bestProductivityPeriod}) and caps sprints at your sweet-spot ({focusDna.bestFocusDuration}m).
          </p>
        </div>

        {/* Action button if not yet generated */}
        {!optimizedDayPlan ? (
          <div className="p-8 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-center space-y-4">
            <Brain className="w-10 h-10 text-indigo-400 mx-auto animate-pulse" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-zinc-200">No Optimized Schedule Yet</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Let FocusDNA compute an optimal chronobiology timeline allocating tasks around your cognitive peaks.
              </p>
            </div>
            <button
              onClick={() => optimizeDaySchedule()}
              disabled={isOptimizingDay}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-400 text-zinc-950 font-bold text-xs shadow-lg shadow-indigo-500/20 hover:opacity-90 transition-all flex items-center gap-2 mx-auto"
            >
              {isOptimizingDay ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing Circadian Slots...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Circadian Day Schedule</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Top Summary Banner */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="font-semibold text-indigo-200 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>{optimizedDayPlan.circadianSummary}</span>
                </div>
                <p className="text-zinc-400 text-[11px]">{optimizedDayPlan.aiAdvice}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
                  ⚡ {optimizedDayPlan.totalFocusMinutes}m Focus
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
                  ☕ {optimizedDayPlan.totalBreakMinutes}m Breaks
                </div>
                <button
                  onClick={() => optimizeDaySchedule()}
                  disabled={isOptimizingDay}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                  title="Re-optimize"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isOptimizingDay ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
              {(['all', 'Morning', 'Afternoon', 'Evening'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                  }`}
                >
                  {tab === 'all' ? 'Full Day' : tab}
                </button>
              ))}
            </div>

            {/* Timeline Slots */}
            <div className="space-y-3">
              {filteredSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    slot.isPeakWindow
                      ? 'bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border-indigo-500/50 shadow-md'
                      : slot.type === 'break'
                      ? 'bg-zinc-950/40 border-zinc-800/60'
                      : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2.5 rounded-xl mt-0.5 shrink-0 ${
                        slot.isPeakWindow
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : slot.type === 'break'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-indigo-500/10 text-indigo-400'
                      }`}
                    >
                      {slot.isPeakWindow ? (
                        <Sparkles className="w-4 h-4" />
                      ) : slot.type === 'break' ? (
                        <Coffee className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-zinc-100">{slot.taskTitle}</span>
                        {slot.isPeakWindow && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                            Circadian Peak
                          </span>
                        )}
                        {slot.difficulty && (
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              slot.difficulty === 'hard'
                                ? 'bg-rose-500/20 text-rose-300'
                                : slot.difficulty === 'medium'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-emerald-500/20 text-emerald-300'
                            }`}
                          >
                            {slot.difficulty}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        {slot.cognitiveNote}
                      </p>

                      <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-3">
                        <span>🕒 {slot.timeLabel}</span>
                        <span>⏱️ {slot.durationMinutes} minutes</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLaunchSlot(slot)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-indigo-600 hover:text-white text-zinc-200 text-xs font-semibold border border-zinc-700 transition-all flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
