import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Database,
  Volume2,
  VolumeX,
  Trash2,
  RefreshCw,
  Download,
  Upload,
  CheckCircle,
  Sparkles,
  Dna,
  Shield,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

export const SettingsView: React.FC = () => {
  const {
    isDemoMode,
    loadDemoData,
    resetAllData,
    isMuted,
    setIsMuted,
    tasks,
    sessions,
    focusDna,
    addToast,
  } = useApp();

  const [confirmReset, setConfirmReset] = useState(false);

  const handleExportJson = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      focusDna,
      tasks,
      sessions,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focusdna-telemetry-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Telemetry Exported', 'Downloaded complete FocusDNA JSON dataset.', 'success');
  };

  const handleTestSound = () => {
    soundEngine.playCompletionChime();
    addToast('Sound Test', 'Played completion chime.', 'info');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">
          Application Settings & Data Control
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Manage your telemetry, sound feedback, demo dataset, and export preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. Demo Mode & Telemetry Reset */}
        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
            <Database className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
              Demo Data & Telemetry Mode
            </h2>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            FocusDNA provides a rich pre-loaded dataset containing 13 realistic focus sessions with varied distraction patterns, circadian drop-offs, and an 84% score. You can reload this demo anytime or wipe it to start clean.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={loadDemoData}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Demo Dataset (Hackathon Demo)</span>
            </button>

            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-rose-950/60 border border-zinc-700 hover:border-rose-800 text-zinc-300 hover:text-rose-300 text-xs font-semibold transition-all flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset All Data to Empty</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    resetAllData();
                    setConfirmReset(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all"
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-2 rounded-xl bg-zinc-800 text-zinc-400 text-xs"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 2. Audio & Notifications */}
        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
              Audio & Ambient Tone Controls
            </h2>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-zinc-200">Timer Sound Effects</span>
              <p className="text-[11px] text-zinc-400">
                Plays soothing major-7th harmonic bell chimes upon session completion.
              </p>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                isMuted
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-400'
                  : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isMuted ? 'Muted' : 'Sound Enabled'}</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={handleTestSound}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700"
            >
              🔊 Test Completion Chime
            </button>
          </div>
        </div>

        {/* 3. Export Data */}
        <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
            <Download className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
              Data Portability
            </h2>
          </div>

          <p className="text-xs text-zinc-400">
            Export all session timestamps, distraction tags, ratings, and FocusDNA mathematical profiles into a portable JSON document.
          </p>

          <button
            onClick={handleExportJson}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export FocusDNA JSON</span>
          </button>
        </div>

        {/* 4. Architecture Specs */}
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 space-y-3">
          <div className="flex items-center gap-2 text-zinc-300 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>Architecture & Privacy</span>
          </div>
          <div className="text-xs text-zinc-400 space-y-2 leading-relaxed">
            <p>
              • <strong>Backend:</strong> Express full-stack layer with server-side Gemini 3.7 Flash API integration (`@google/genai`).
            </p>
            <p>
              • <strong>Persistence:</strong> Local storage database layer with full offline fallback and optional Firestore cloud database compatibility.
            </p>
            <p>
              • <strong>Synthesizer:</strong> Pure browser-native Web Audio API (no heavy external audio assets).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
