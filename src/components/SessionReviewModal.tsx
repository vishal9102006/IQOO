import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import { Difficulty } from '../types';

export const SessionReviewModal: React.FC = () => {
  const { reviewSessionData, setReviewSessionData, saveSessionReview } = useApp();

  const [focusRating, setFocusRating] = useState<number>(4);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [goalCompletion, setGoalCompletion] = useState<'yes' | 'partially' | 'no'>('yes');

  if (!reviewSessionData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSessionReview({
      focusRating,
      difficulty,
      goalCompletion,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Session Complete 🎉</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-100">
            {reviewSessionData.taskTitle}
          </h2>
          <p className="text-xs text-zinc-400">
            {reviewSessionData.actualMinutes} min completed · Help FocusDNA learn how you performed.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Focus Rating (1 to 5) */}
          <div className="space-y-2 text-center">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              How focused were you?
            </label>
            <div className="flex items-center justify-center gap-2 pt-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setFocusRating(num)}
                  className={`w-11 h-11 rounded-xl text-sm font-bold border transition-all flex flex-col items-center justify-center ${
                    focusRating === num
                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30 scale-105'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 mb-0.5 ${focusRating >= num ? 'fill-current' : ''}`} />
                  <span>{num}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-between px-6 text-[10px] text-zinc-400">
              <span>Distracted</span>
              <span>Deep Flow</span>
            </div>
          </div>

          {/* 2. Difficulty (Easy, Medium, Hard) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block text-center">
              How difficult was this session?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold capitalize border transition-all ${
                    difficulty === level
                      ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200 shadow-sm'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Goal Completion (Yes, Partially, No) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block text-center">
              Did you complete your goal?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'yes', label: 'Yes' },
                { id: 'partially', label: 'Partially' },
                { id: 'no', label: 'No' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setGoalCompletion(opt.id as 'yes' | 'partially' | 'no')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    goalCompletion === opt.id
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-sm'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Distractions summary badge */}
          {reviewSessionData.distractions && reviewSessionData.distractions.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{reviewSessionData.distractions.length} distraction(s) logged</span>
              </div>
              <span className="text-[11px] text-amber-400 font-medium">
                {reviewSessionData.distractions.map((d) => d.reason).join(', ')}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setReviewSessionData(null)}
              className="w-1/3 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition-colors"
            >
              Discard
            </button>

            <button
              type="submit"
              className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-emerald-400 hover:opacity-95 text-zinc-950 font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Save & Update FocusDNA</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
