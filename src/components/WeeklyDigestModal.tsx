import React from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Sparkles,
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  X,
  Download,
  Share2,
  RefreshCw,
  Zap,
} from 'lucide-react';

export const WeeklyDigestModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const {
    weeklyDigest,
    isGeneratingWeeklyDigest,
    generateWeeklyDigest,
    focusDna,
    addToast,
  } = useApp();

  if (!isOpen) return null;

  const handleExportReport = () => {
    if (!weeklyDigest) return;
    const textContent = `FOCUSDNA BEHAVIORAL COGNITIVE REPORT
Generated: ${new Date(weeklyDigest.generatedAt).toLocaleDateString()}
Cognitive Tier: ${weeklyDigest.cognitiveTier}
Focus Score: ${weeklyDigest.focusScore}%
Total Deep Focus: ${weeklyDigest.totalMinutes} minutes
Peak Performance Day: ${weeklyDigest.bestDay}

FATIGUE INSIGHT:
${weeklyDigest.fatigueInsight}

DISTRACTION DIAGNOSIS:
${weeklyDigest.distractionDiagnosis}

ACTIONABLE PRESCRIPTIONS:
${weeklyDigest.prescriptions.map((p, idx) => `${idx + 1}. ${p}`).join('\n')}
`;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focusdna-executive-digest-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Report Exported', 'Saved executive report to text file.', 'success');
  };

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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Behavioral Health & Performance · Executive Digest</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <span>Cognitive Performance Audit</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </h2>
          <p className="text-xs text-zinc-400">
            A comprehensive neural review of your focus capacity, fatigue onset patterns, and targeted behavioral prescriptions.
          </p>
        </div>

        {!weeklyDigest ? (
          <div className="p-8 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-center space-y-4">
            <FileText className="w-10 h-10 text-emerald-400 mx-auto animate-pulse" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-zinc-200">No Weekly Report Compiled Yet</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Synthesize session telemetry across your entire focus history to discover hidden fatigue curves.
              </p>
            </div>
            <button
              onClick={() => generateWeeklyDigest()}
              disabled={isGeneratingWeeklyDigest}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-500 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all flex items-center gap-2 mx-auto"
            >
              {isGeneratingWeeklyDigest ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Behavioral Telemetry...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Executive Digest</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Tier & Score Header Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-950 to-indigo-950/50 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
                  Cognitive Classification
                </span>
                <div className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>{weeklyDigest.cognitiveTier}</span>
                </div>
                <p className="text-xs text-zinc-400">Best Window: {weeklyDigest.bestDay}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center px-4 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">Focus Score</span>
                  <div className="text-xl font-black text-emerald-400">{weeklyDigest.focusScore}%</div>
                </div>
                <div className="text-center px-4 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">Focus Time</span>
                  <div className="text-xl font-black text-indigo-300">{weeklyDigest.totalMinutes}m</div>
                </div>
              </div>
            </div>

            {/* Fatigue Insight & Distraction Diagnosis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  <span>Fatigue Onset Curve</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {weeklyDigest.fatigueInsight}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Distraction Diagnosis</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {weeklyDigest.distractionDiagnosis}
                </p>
              </div>
            </div>

            {/* Actionable Behavioral Prescriptions */}
            <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-200 uppercase tracking-wider">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Targeted Action Protocols</span>
              </div>
              <div className="space-y-2">
                {weeklyDigest.prescriptions.map((prescription, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800/80 flex items-start gap-3 text-xs text-zinc-200"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="leading-relaxed">{prescription}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => generateWeeklyDigest()}
                disabled={isGeneratingWeeklyDigest}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingWeeklyDigest ? 'animate-spin' : ''}`} />
                <span>Re-analyze</span>
              </button>

              <button
                onClick={handleExportReport}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Report Card</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
