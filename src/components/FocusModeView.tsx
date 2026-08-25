import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Play,
  Pause,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Radio,
  Volume2,
  VolumeX,
  Plus,
  Maximize2,
  Minimize2,
  Sparkles,
  Smartphone,
  MessageSquare,
  Globe,
  Coffee,
  HelpCircle,
  Moon,
  Clock,
} from 'lucide-react';
import { DistractionCategory } from '../types';

export const FocusModeView: React.FC = () => {
  const {
    activeSession,
    startFocusSession,
    pauseSession,
    resumeSession,
    logDistraction,
    finishSessionEarly,
    abandonSession,
    ambientSound,
    setAmbientSound,
    isMuted,
    setIsMuted,
    focusDna,
  } = useApp();

  const [isDistractionModalOpen, setIsDistractionModalOpen] = useState(false);
  const [customNote, setCustomNote] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // If no session is active, show quick launcher with FocusDNA recommendation
  const [customMinutes, setCustomMinutes] = useState(focusDna.bestFocusDuration || 23);
  const [customTaskTitle, setCustomTaskTitle] = useState('Study DBMS Normalization');
  const [customGoal, setCustomGoal] = useState('1NF, 2NF, 3NF & BCNF Decomposition proofs');

  useEffect(() => {
    setCustomMinutes(focusDna.bestFocusDuration || 23);
  }, [focusDna.bestFocusDuration]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const handleLogDistractionCategory = (cat: DistractionCategory) => {
    logDistraction(cat, customNote.trim() || undefined);
    setCustomNote('');
    setIsDistractionModalOpen(false);
  };

  // If no session is active
  if (!activeSession) {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
        <div className="text-center space-y-2 pt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Focus Mode Ready</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">
            Start an Adaptive Focus Sprint
          </h1>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto">
            FocusDNA automatically tunes your timer length based on your behavioral drop-off threshold.
          </p>
        </div>

        {/* Quick Launch Card */}
        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Task or Subject</label>
              <input
                type="text"
                value={customTaskTitle}
                onChange={(e) => setCustomTaskTitle(e.target.value)}
                placeholder="e.g. Study DBMS Normalization"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700/60 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Sprint Goal / Deliverable</label>
              <input
                type="text"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                placeholder="e.g. Solve 3 BCNF proofs"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700/60 rounded-xl text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Duration Selector with FocusDNA Recommendation badge */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-zinc-300 flex items-center gap-2">
                <span>Sprint Duration</span>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  DNA Sweet-spot: {focusDna.bestFocusDuration}m
                </span>
              </label>
              <span className="text-sm font-bold text-zinc-100">{customMinutes} minutes</span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[15, 20, focusDna.bestFocusDuration || 23, 30, 45].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setCustomMinutes(mins)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    customMinutes === mins
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  {mins} min
                  {mins === (focusDna.bestFocusDuration || 23) && (
                    <span className="block text-[9px] text-indigo-200">★ Optimal</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() =>
                startFocusSession({
                  taskTitle: customTaskTitle.trim() || 'Deep Focus Sprint',
                  plannedMinutes: customMinutes,
                  goal: customGoal.trim() || `Focus sprint (${customMinutes}m)`,
                })
              }
              className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-emerald-400 text-zinc-950 font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-zinc-950" />
              <span>Initiate {customMinutes}m Adaptive Session</span>
            </button>
          </div>
        </div>

        {/* Why FocusDNA duration matters card */}
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs space-y-1">
            <h4 className="font-semibold text-zinc-200">The FocusDNA Advantage</h4>
            <p className="text-zinc-400 leading-relaxed">
              Most timers force arbitrary 25-minute Pomodoros. FocusDNA analyzes your actual focus telemetry. If your attention breaks at minute 22, it adapts future sprints to prevent cognitive burnout and build momentum.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Active Session View
  const isFocus = activeSession.type === 'focus';
  const minutes = Math.floor(activeSession.timeLeft / 60);
  const seconds = activeSession.timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercent = activeSession.totalSeconds > 0
    ? Math.max(0, Math.min(100, ((activeSession.totalSeconds - activeSession.timeLeft) / activeSession.totalSeconds) * 100))
    : 0;

  // SVG circular radius math
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 md:p-8 max-w-4xl mx-auto">
      {/* Top Session Bar */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border flex items-center gap-1.5 ${
              isFocus
                ? 'bg-indigo-950/80 border-indigo-500/40 text-indigo-300'
                : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isFocus ? 'bg-indigo-400' : 'bg-emerald-400'} animate-pulse`} />
            <span>{isFocus ? 'Focus Mode' : 'Rest Break'}</span>
          </span>

          <span className="text-xs text-zinc-400">
            {activeSession.plannedMinutes} min planned
          </span>
        </div>

        {/* Top Sound & Fullscreen controls */}
        <div className="flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 rounded-xl p-1">
          <button
            onClick={() => setAmbientSound(ambientSound === 'off' ? 'binaural' : ambientSound === 'binaural' ? 'pink-noise' : 'off')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              ambientSound !== 'off'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Toggle Ambient Audio (Binaural / Pink noise / Off)"
          >
            <Radio className="w-3.5 h-3.5" />
            <span className="capitalize">{ambientSound === 'off' ? 'Sound: Off' : ambientSound}</span>
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
            title={isMuted ? 'Unmute alerts' : 'Mute alerts'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Focus Centerpiece */}
      <div className="flex flex-col items-center justify-center my-auto py-6 space-y-6">
        {/* Task Title & Goal */}
        <div className="text-center space-y-1.5 max-w-md px-4">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-100">
            {activeSession.taskTitle}
          </h2>
          <p className="text-sm text-zinc-400 font-medium line-clamp-2">
            {activeSession.goal}
          </p>
        </div>

        {/* Circular Countdown Gauge */}
        <div className="relative flex items-center justify-center">
          <svg className="w-72 h-72 md:w-80 md:h-80 transform -rotate-90">
            {/* Background track */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              className="stroke-zinc-800/80"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Animated progress ring */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              className={`transition-all duration-1000 ease-linear ${
                isFocus
                  ? 'stroke-indigo-500 drop-shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                  : 'stroke-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.4)]'
              }`}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Center Digital Display */}
          <div className="absolute flex flex-col items-center justify-center text-center select-none">
            <span className="font-mono text-5xl md:text-6xl font-bold tracking-tighter text-zinc-100">
              {timeFormatted}
            </span>
            <span className="text-xs font-semibold text-zinc-400 tracking-wider uppercase mt-1">
              {activeSession.isPaused ? '⏸ PAUSED' : isFocus ? '⚡ DEEP FOCUS' : '☕ REST CYCLE'}
            </span>
            <span className="text-[11px] text-zinc-400 mt-1">
              {Math.round(progressPercent)}% elapsed
            </span>
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center gap-3">
          {activeSession.isPaused ? (
            <button
              onClick={resumeSession}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Resume</span>
            </button>
          ) : (
            <button
              onClick={pauseSession}
              className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-sm rounded-xl border border-zinc-700 transition-all flex items-center gap-2"
            >
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={finishSessionEarly}
            className="px-5 py-3 bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Complete Session</span>
          </button>

          <button
            onClick={abandonSession}
            className="px-4 py-3 bg-zinc-900 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-300 font-medium text-xs rounded-xl border border-zinc-800 hover:border-rose-900/50 transition-all flex items-center gap-1.5"
            title="End session early (will be logged as abandoned for FocusDNA analysis)"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Abandon</span>
          </button>
        </div>
      </div>

      {/* Distraction Logger Bar (Flagship Feature) */}
      <div className="w-full bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 backdrop-blur-xl shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-zinc-200">Distraction Telemetry</span>
            <span className="text-[11px] text-zinc-400">
              ({activeSession.distractions.length} recorded this session)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLogDistractionCategory('Lost Focus')}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-all flex items-center gap-1.5"
            >
              <Moon className="w-3.5 h-3.5 text-amber-400" />
              <span>[ I lost focus ]</span>
            </button>

            <button
              onClick={() => setIsDistractionModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/40 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Distraction Reason</span>
            </button>
          </div>
        </div>

        {/* Live Distractions List for this session */}
        {activeSession.distractions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1 border-t border-zinc-800/60">
            {activeSession.distractions.map((d) => (
              <span
                key={d.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="font-semibold text-amber-300">{d.reason}</span>
                <span className="text-zinc-400">at min {d.minuteIntoSession}</span>
                {d.note && <span className="text-zinc-400 italic">({d.note})</span>}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Log Distraction Modal */}
      {isDistractionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-100">What distracted you?</h3>
                  <p className="text-xs text-zinc-400">FocusDNA learns your specific trigger patterns.</p>
                </div>
              </div>
              <button
                onClick={() => setIsDistractionModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            {/* Categorized Options Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {[
                { label: 'Phone', icon: Smartphone, cat: 'Phone' as DistractionCategory },
                { label: 'Messaging', icon: MessageSquare, cat: 'Messaging' as DistractionCategory },
                { label: 'Browsing / Web', icon: Globe, cat: 'Browsing' as DistractionCategory },
                { label: 'Tired / Fatigue', icon: Moon, cat: 'Tired' as DistractionCategory },
                { label: 'Break / Snack', icon: Coffee, cat: 'Break / Snack' as DistractionCategory },
                { label: 'Other Interruption', icon: HelpCircle, cat: 'Other' as DistractionCategory },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.cat}
                    onClick={() => handleLogDistractionCategory(item.cat)}
                    className="p-3 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 rounded-xl text-left transition-all flex items-center gap-2.5 group"
                  >
                    <Icon className="w-4 h-4 text-zinc-400 group-hover:text-amber-400 transition-colors" />
                    <span className="text-xs font-semibold text-zinc-200">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Optional note input */}
            <div className="space-y-1 pt-1">
              <label className="text-[11px] font-medium text-zinc-400">Optional Context / Note</label>
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. Group chat notification, checked WhatsApp"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsDistractionModalOpen(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
