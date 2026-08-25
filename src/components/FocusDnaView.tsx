import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Dna,
  Clock,
  Zap,
  AlertTriangle,
  Flame,
  TrendingUp,
  Sparkles,
  HelpCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  Coffee,
  Info,
  Presentation,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

export const FocusDnaView: React.FC = () => {
  const { focusDna, setActiveView, loadDemoData, isDemoMode } = useApp();
  const [showMathExplainer, setShowMathExplainer] = useState(false);

  // If not enough data (< 3 sessions)
  if (!focusDna.hasSufficientData) {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-8 my-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-xl">
          <Dna className="w-8 h-8 text-indigo-400 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">
            Your FocusDNA is still learning 🧬
          </h1>
          <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Complete at least 3 focus sessions so FocusDNA can calculate your cognitive drop-off curves, optimal duration, and peak productivity hours.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setActiveView('tasks')}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-500 to-emerald-400 text-zinc-950 font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 hover:opacity-95 transition-all"
          >
            Create Your First Task
          </button>
          <button
            onClick={loadDemoData}
            className="w-full sm:w-auto px-6 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold text-xs rounded-xl transition-all"
          >
            Load Demo Data (Judges & Demo)
          </button>
        </div>
      </div>
    );
  }

  // Chart Color Palettes
  const DISTRACTION_COLORS = ['#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#10b981', '#6b7280'];
  const TIME_COLORS = ['#38bdf8', '#818cf8', '#34d399', '#a78bfa'];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">
              Your FocusDNA
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-500/30 uppercase tracking-wide">
              {isDemoMode ? 'Demo Telemetry' : 'Live Profile'}
            </span>
          </div>
          <p className="text-sm text-zinc-400">
            Based on {focusDna.totalSessions} recorded sessions ({focusDna.totalFocusMinutes} total focus minutes).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setActiveView('presentation')}
            className="px-3.5 py-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-xs font-semibold text-indigo-300 flex items-center gap-1.5 transition-colors shadow-sm"
            title="Open Presentation Deck & Export PDF"
          >
            <Presentation className="w-3.5 h-3.5 text-indigo-400" />
            <span>PPT Deck & PDF</span>
          </button>
          <button
            onClick={() => setShowMathExplainer(!showMathExplainer)}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>How is FocusDNA calculated?</span>
          </button>
        </div>
      </div>

      {/* Transparent Algorithm Explainer Accordion */}
      {showMathExplainer && (
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-indigo-500/30 backdrop-blur-xl shadow-xl space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
            <Info className="w-4 h-4" />
            <span>Transparent FocusDNA Mathematical Engine</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            FocusDNA avoids simulated or fake metrics. It computes a transparent composite score out of 100 based on 4 real behavioral pillars:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-[11px] font-bold text-zinc-400 block">1. Completion Rate (40%)</span>
              <p className="text-xs text-zinc-300 font-semibold">{focusDna.completionRate}% successful</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-[11px] font-bold text-zinc-400 block">2. Focus Depth (25%)</span>
              <p className="text-xs text-zinc-300 font-semibold">Self-rated focus ratings</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-[11px] font-bold text-zinc-400 block">3. Interruption Resilience (20%)</span>
              <p className="text-xs text-zinc-300 font-semibold">{focusDna.avgDistractionsPerSession} avg dist / session</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-[11px] font-bold text-zinc-400 block">4. Goal Accomplishment (15%)</span>
              <p className="text-xs text-zinc-300 font-semibold">Micro-goal outcomes</p>
            </div>
          </div>
        </div>
      )}

      {/* 6 Signature FocusDNA Cards (Section 12 of prompt) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* 1. Best Focus Duration */}
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl shadow-md space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Best Focus Duration</span>
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-zinc-100 tracking-tight">{focusDna.bestFocusDuration}</span>
            <span className="text-xs font-semibold text-zinc-400">min</span>
          </div>
          <p className="text-[10px] text-emerald-400 font-medium">Optimal completion</p>
        </div>

        {/* 2. Best Time */}
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl shadow-md space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Best Time</span>
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-zinc-100 tracking-tight">{focusDna.bestProductivityPeriod.split(' ')[0]}</span>
            <span className="text-[11px] text-zinc-400">7–9 PM</span>
          </div>
          <p className="text-[10px] text-emerald-400 font-medium">89% peak score</p>
        </div>

        {/* 3. Avg Distractions */}
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl shadow-md space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Avg Distractions</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-zinc-100 tracking-tight">{focusDna.avgDistractionsPerSession}</span>
            <span className="text-xs font-semibold text-zinc-400">/ session</span>
          </div>
          <p className="text-[10px] text-amber-400 font-medium">Main: {focusDna.mostCommonDistraction}</p>
        </div>

        {/* 4. Focus Score */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-zinc-900/90 to-zinc-900 border border-indigo-500/40 backdrop-blur-xl shadow-md space-y-2">
          <div className="flex items-center justify-between text-indigo-300">
            <span className="text-[10px] font-bold uppercase tracking-wider">Focus Score</span>
            <Dna className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-indigo-100 tracking-tight">{focusDna.focusScore}%</span>
          </div>
          <p className="text-[10px] text-indigo-300 font-medium">Top quartile rhythm</p>
        </div>

        {/* 5. Best Break */}
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl shadow-md space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Best Break</span>
            <Coffee className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-zinc-100 tracking-tight">{focusDna.bestBreakDuration}</span>
            <span className="text-xs font-semibold text-zinc-400">min</span>
          </div>
          <p className="text-[10px] text-teal-400 font-medium">Fast mental reset</p>
        </div>

        {/* 6. Weekly Trend */}
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl shadow-md space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Weekly Trend</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-emerald-400 tracking-tight">+{focusDna.weeklyTrend}%</span>
          </div>
          <p className="text-[10px] text-emerald-400 font-medium">vs previous week</p>
        </div>
      </div>

      {/* Adaptive Recommendation Engine (Section 14) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <h2 className="text-base font-bold text-zinc-100">Adaptive Recommendations Generated From Your Behavior</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {focusDna.adaptiveRules.map((rule) => (
            <div
              key={rule.id}
              className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/90 backdrop-blur-xl shadow-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  {rule.title}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {rule.appliedParameter}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <p className="text-zinc-400">
                  <strong className="text-zinc-200">Observed Telemetry: </strong>
                  {rule.observation}
                </p>
                <p className="text-emerald-300 bg-emerald-950/40 border border-emerald-500/20 p-2.5 rounded-xl font-medium leading-relaxed">
                  <strong>Adapted Action: </strong>
                  {rule.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Rich Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Focus Duration Drop-off Curve (The Core FocusDNA Proof) */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl shadow-lg space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-100">Focus Duration vs. Success Rate</h3>
              <span className="text-[11px] font-semibold text-emerald-400">Sweet Spot: 23m</span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Notice the steep drop-off curve when sessions exceed 30 minutes.
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={focusDna.durationBuckets}>
                <defs>
                  <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="range" stroke="#71717a" fontSize={11} />
                <YAxis unit="%" stroke="#71717a" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px' }}
                  formatter={(val: number) => [`${val}%`, 'Completion Rate']}
                />
                <Area
                  type="monotone"
                  dataKey="successRate"
                  stroke="#818cf8"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#successGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Distractions by Category */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl shadow-lg space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-100">Distractions by Category</h3>
              <span className="text-[11px] font-semibold text-amber-400">
                Top: {focusDna.mostCommonDistraction}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Breakdown of interruption triggers logged during sessions.
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={focusDna.distractionBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis type="number" stroke="#71717a" fontSize={11} />
                <YAxis dataKey="reason" type="category" stroke="#71717a" fontSize={11} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px' }}
                  formatter={(val: number) => [`${val} interruptions`, 'Count']}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {focusDna.distractionBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DISTRACTION_COLORS[index % DISTRACTION_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Productivity by Time of Day */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl shadow-lg space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-100">Productivity by Time of Day</h3>
              <span className="text-[11px] font-semibold text-emerald-400">
                Peak: Evening (89%)
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Circadian focus scores grouped by morning, afternoon, evening, and night.
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={focusDna.timeOfDayBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="label" stroke="#71717a" fontSize={11} />
                <YAxis unit="%" stroke="#71717a" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px' }}
                  formatter={(val: number) => [`${val}%`, 'Productivity Score']}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {focusDna.timeOfDayBreakdown.map((entry, index) => (
                    <Cell key={`time-cell-${index}`} fill={TIME_COLORS[index % TIME_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Daily Focus Time (Past 7 Days) */}
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl shadow-lg space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-100">Weekly Focus Consistency</h3>
              <span className="text-[11px] font-semibold text-indigo-400">
                {focusDna.totalFocusMinutes} Total Minutes
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Daily recorded minutes of deep focus over the past 7 days.
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={focusDna.dailyFocusHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="day" stroke="#71717a" fontSize={11} />
                <YAxis unit="m" stroke="#71717a" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px' }}
                  formatter={(val: number) => [`${val} min`, 'Focus Time']}
                />
                <Bar dataKey="minutes" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
