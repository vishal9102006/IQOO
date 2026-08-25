import React from 'react';
import { useApp, ActiveView } from '../context/AppContext';
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  Dna,
  Bot,
  Settings,
  Play,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  Presentation,
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const {
    activeView,
    setActiveView,
    activeSession,
    startFocusSession,
    focusDna,
    isDemoMode,
    isMuted,
    setIsMuted,
  } = useApp();

  const navItems: { id: ActiveView; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks & AI Plan', icon: CheckSquare },
    {
      id: 'focus',
      label: 'Focus Mode',
      icon: Timer,
      badge: activeSession ? (activeSession.isPaused ? 'Paused' : 'Active') : undefined,
    },
    { id: 'focus-dna', label: 'FocusDNA', icon: Dna, badge: focusDna.hasSufficientData ? `${focusDna.focusScore}%` : undefined },
    { id: 'coach', label: 'Ask AI Coach', icon: Bot },
    { id: 'presentation', label: 'PPT / Projector', icon: Presentation, badge: '10 Slides' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleQuickStart = () => {
    if (activeSession) {
      setActiveView('focus');
    } else {
      startFocusSession({
        taskTitle: 'Adaptive Deep Focus Sprint',
        plannedMinutes: focusDna.bestFocusDuration || 23,
        goal: `Execute high priority sprint (${focusDna.bestFocusDuration || 23}m)`,
      });
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl h-screen sticky top-0 shrink-0 p-4 justify-between z-30 select-none">
        <div className="space-y-6">
          {/* Logo & Brand Header */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div
              onClick={() => setActiveView('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-400 p-[1px] flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
                  <Dna className="w-5 h-5 text-indigo-400 group-hover:text-emerald-300 transition-colors animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                    FocusDNA
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-indigo-950/80 text-indigo-400 border border-indigo-500/30">
                    MVP
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-medium">Adaptive Productivity</p>
              </div>
            </div>
          </div>

          {/* Quick Start Focus Button */}
          <div className="px-1">
            <button
              onClick={handleQuickStart}
              className={`w-full py-2.5 px-3.5 rounded-xl font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition-all shadow-md ${
                activeSession
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20 animate-pulse'
                  : 'bg-zinc-100 hover:bg-white text-zinc-950 shadow-zinc-100/10 hover:shadow-zinc-100/20'
              }`}
            >
              {activeSession ? (
                <>
                  <Zap className="w-4 h-4 text-zinc-950 fill-zinc-950" />
                  <span>Resume Session ({Math.ceil(activeSession.timeLeft / 60)}m)</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-zinc-950" />
                  <span>Start Focus ({focusDna.bestFocusDuration}m)</span>
                </>
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 px-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-800/80 text-zinc-100 font-semibold border border-zinc-700/60 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-indigo-400' : 'text-zinc-400 group-hover:text-zinc-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        item.id === 'focus' && activeSession
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile / Telemetry status */}
        <div className="pt-4 border-t border-zinc-900/90 space-y-3 px-1">
          {/* Data Mode Badge */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/50 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isDemoMode ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'
                }`}
              />
              <span className="text-zinc-300 font-medium">
                {isDemoMode ? 'Demo Data' : `Live Data (${focusDna.totalSessions} sessions)`}
              </span>
            </div>
            <button
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? 'Unmute audio alerts' : 'Mute audio alerts'}
              className="p-1 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* DNA Sweet-spot hint */}
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-950/40 via-zinc-900/60 to-zinc-900/40 border border-indigo-500/20">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-300 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Adapted For You</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-tight">
              {focusDna.hasSufficientData
                ? `Optimal sprint: ${focusDna.bestFocusDuration}m · Peak: ${focusDna.bestProductivityPeriod.split(' ')[0]}`
                : 'Complete 3 sessions to unlock your signature FocusDNA.'}
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-30">
        <div
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
            <Dna className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="font-bold text-sm tracking-tight text-zinc-100">FocusDNA</span>
          <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-400 border border-indigo-500/30">
            MVP
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleQuickStart}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
              activeSession
                ? 'bg-emerald-500 text-zinc-950'
                : 'bg-zinc-100 text-zinc-950'
            }`}
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{activeSession ? 'Resume' : 'Focus'}</span>
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800/90 bg-zinc-950/95 backdrop-blur-lg flex items-center justify-around py-2 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors relative ${
                isActive ? 'text-indigo-400 font-medium' : 'text-zinc-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] tracking-tight">{item.label.split(' ')[0]}</span>
              {item.badge && item.id === 'focus' && activeSession && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
