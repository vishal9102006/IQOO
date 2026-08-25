import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Wind, X, Play, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../utils/audio';

type BreathPhase = 'Inhale' | 'Hold (Full)' | 'Exhale' | 'Hold (Empty)';

export const RespirationModal: React.FC = () => {
  const { isRespirationModalOpen, setIsRespirationModalOpen, addToast } = useApp();
  const [isActive, setIsActive] = useState<boolean>(true);
  const [cycleSeconds, setCycleSeconds] = useState<number>(0);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [technique, setTechnique] = useState<'box' | 'calm'>('box'); // box: 4-4-4-4, calm: 4-7-8

  const phaseDuration = technique === 'box' ? 4 : 4;

  useEffect(() => {
    if (!isRespirationModalOpen || !isActive) return;

    const interval = setInterval(() => {
      setCycleSeconds((prev) => {
        const totalDuration = technique === 'box' ? 16 : 19; // 4-4-4-4 vs 4-7-8
        const next = prev + 1;
        if (next >= totalDuration) {
          setCompletedCycles((c) => c + 1);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRespirationModalOpen, isActive, technique]);

  // Determine current phase and progress
  let currentPhase: BreathPhase = 'Inhale';
  let phaseProgress = 0;
  let phaseSecondsLeft = 0;

  if (technique === 'box') {
    if (cycleSeconds < 4) {
      currentPhase = 'Inhale';
      phaseProgress = (cycleSeconds / 4) * 100;
      phaseSecondsLeft = 4 - cycleSeconds;
    } else if (cycleSeconds < 8) {
      currentPhase = 'Hold (Full)';
      phaseProgress = 100;
      phaseSecondsLeft = 8 - cycleSeconds;
    } else if (cycleSeconds < 12) {
      currentPhase = 'Exhale';
      phaseProgress = 100 - ((cycleSeconds - 8) / 4) * 100;
      phaseSecondsLeft = 12 - cycleSeconds;
    } else {
      currentPhase = 'Hold (Empty)';
      phaseProgress = 0;
      phaseSecondsLeft = 16 - cycleSeconds;
    }
  } else {
    // 4-7-8 Calm rhythm
    if (cycleSeconds < 4) {
      currentPhase = 'Inhale';
      phaseProgress = (cycleSeconds / 4) * 100;
      phaseSecondsLeft = 4 - cycleSeconds;
    } else if (cycleSeconds < 11) {
      currentPhase = 'Hold (Full)';
      phaseProgress = 100;
      phaseSecondsLeft = 11 - cycleSeconds;
    } else {
      currentPhase = 'Exhale';
      phaseProgress = 100 - ((cycleSeconds - 11) / 8) * 100;
      phaseSecondsLeft = 19 - cycleSeconds;
    }
  }

  // Audio cues on phase start
  useEffect(() => {
    if (!isActive || !isRespirationModalOpen) return;
    if (currentPhase === 'Inhale' && phaseSecondsLeft === 4) {
      soundEngine.playBreathInhaleCue();
    } else if (currentPhase === 'Exhale' && (technique === 'box' ? phaseSecondsLeft === 4 : phaseSecondsLeft === 8)) {
      soundEngine.playBreathExhaleCue();
    }
  }, [currentPhase, phaseSecondsLeft, isActive, isRespirationModalOpen, technique]);

  if (!isRespirationModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200 text-center relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setIsRespirationModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Wind className="w-3.5 h-3.5" />
            <span>Cognitive Reset · 2-Min Respiration</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">
            Dopamine & Cortisol Reset
          </h2>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            Regulate autonomic arousal to eliminate distraction impulses and return to deep focus.
          </p>
        </div>

        {/* Breathing Rhythm Selector */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => {
              setTechnique('box');
              setCycleSeconds(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              technique === 'box'
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-sm'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            Box Breathing (4-4-4-4)
          </button>
          <button
            onClick={() => {
              setTechnique('calm');
              setCycleSeconds(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              technique === 'calm'
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-sm'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            4-7-8 Vagal Stimulator
          </button>
        </div>

        {/* Dynamic Breathing Sphere */}
        <div className="py-6 flex flex-col items-center justify-center relative">
          {/* Animated Expanding/Contracting Circles */}
          <div
            className="w-48 h-48 rounded-full border-2 border-indigo-500/40 bg-gradient-to-br from-indigo-500/20 via-emerald-500/10 to-indigo-600/20 flex flex-col items-center justify-center transition-all duration-1000 shadow-2xl relative"
            style={{
              transform: `scale(${0.75 + (phaseProgress / 100) * 0.45})`,
              boxShadow: `0 0 ${20 + phaseProgress * 0.3}px rgba(99, 102, 241, 0.4)`,
            }}
          >
            <div className="text-center space-y-1 z-10">
              <span className="text-xs uppercase tracking-widest text-indigo-300 font-bold">
                {currentPhase}
              </span>
              <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
                {phaseSecondsLeft}s
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-around px-4 py-2.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 text-xs">
          <div className="space-y-0.5 text-left">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold">Cycles Completed</span>
            <div className="font-bold text-zinc-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{completedCycles} / 4 cycles</span>
            </div>
          </div>
          <div className="h-6 w-px bg-zinc-800" />
          <div className="space-y-0.5 text-left">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold">Neural State</span>
            <div className="font-bold text-emerald-400">
              {completedCycles >= 2 ? 'Alpha Stabilized' : 'Calibrating'}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setIsActive(!isActive)}
            className="w-1/3 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            {isActive ? 'Pause' : <><Play className="w-3.5 h-3.5" /> Resume</>}
          </button>

          <button
            onClick={() => {
              setIsRespirationModalOpen(false);
              addToast('Reset Complete', 'Mind recalibrated. Ready for high-density focus.', 'success');
            }}
            className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-400 hover:opacity-95 text-zinc-950 font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Return to Sprint</span>
          </button>
        </div>
      </div>
    </div>
  );
};
