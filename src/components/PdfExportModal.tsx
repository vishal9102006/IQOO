import React, { useState } from 'react';
import { FOCUS_DNA_SLIDES } from '../data/presentationSlides';
import { exportPresentationToPdf, PdfExportOptions } from '../utils/pdfExport';
import {
  FileDown,
  CheckCircle2,
  Settings2,
  Sparkles,
  Layers,
  BookOpen,
  Loader2,
  X,
  Presentation,
  Check,
} from 'lucide-react';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlideIndex: number;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  currentSlideIndex,
}) => {
  const [includeSpeakerNotes, setIncludeSpeakerNotes] = useState<boolean>(true);
  const [format, setFormat] = useState<'landscape-16-9' | 'a4-handout'>('landscape-16-9');
  const [scope, setScope] = useState<'all' | 'current'>('all');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [progressPct, setProgressPct] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    setIsDone(false);
    setProgressPct(0);
    setProgressMsg('Initializing PDF compiler...');

    try {
      const slideIndices =
        scope === 'all'
          ? FOCUS_DNA_SLIDES.map((_, idx) => idx)
          : [currentSlideIndex];

      const options: PdfExportOptions = {
        includeSpeakerNotes,
        format,
        theme: 'clean-light',
        slides: slideIndices,
        onProgress: (current, total, message) => {
          const pct = Math.round((current / total) * 100);
          setProgressPct(pct);
          setProgressMsg(message);
        },
      };

      await exportPresentationToPdf(options);
      setIsDone(true);
      setProgressMsg('PDF downloaded successfully!');
      setTimeout(() => {
        setIsExporting(false);
      }, 1200);
    } catch (err) {
      console.error('Failed to export PDF:', err);
      setProgressMsg('Export error occurred. Please try again.');
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-700/80 text-zinc-100 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
              <FileDown className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Export Presentation to PDF</h2>
              <p className="text-xs text-zinc-400">
                Generate high-resolution vector PDF for projectors and offline sharing
              </p>
            </div>
          </div>
          {!isExporting && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Configuration Options */}
        <div className="space-y-4">
          {/* Scope selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Slide Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isExporting}
                onClick={() => setScope('all')}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  scope === 'all'
                    ? 'bg-indigo-950/60 border-indigo-500 text-white'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">All 10 Slides</div>
                  <div className="text-[11px] text-zinc-400">Complete deck</div>
                </div>
                {scope === 'all' && <Check className="w-4 h-4 text-indigo-400" />}
              </button>

              <button
                type="button"
                disabled={isExporting}
                onClick={() => setScope('current')}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  scope === 'current'
                    ? 'bg-indigo-950/60 border-indigo-500 text-white'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">Current Slide Only</div>
                  <div className="text-[11px] text-zinc-400">Slide #{currentSlideIndex + 1}</div>
                </div>
                {scope === 'current' && <Check className="w-4 h-4 text-indigo-400" />}
              </button>
            </div>
          </div>

          {/* Aspect Ratio / Format */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Slide Dimensions
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isExporting}
                onClick={() => setFormat('landscape-16-9')}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  format === 'landscape-16-9'
                    ? 'bg-indigo-950/60 border-indigo-500 text-white'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">16:9 Widescreen</div>
                  <div className="text-[11px] text-zinc-400">Standard Projectors & Displays</div>
                </div>
                {format === 'landscape-16-9' && <Check className="w-4 h-4 text-indigo-400" />}
              </button>

              <button
                type="button"
                disabled={isExporting}
                onClick={() => setFormat('a4-handout')}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  format === 'a4-handout'
                    ? 'bg-indigo-950/60 border-indigo-500 text-white'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">A4 Landscape</div>
                  <div className="text-[11px] text-zinc-400">Print Handouts & Document</div>
                </div>
                {format === 'a4-handout' && <Check className="w-4 h-4 text-indigo-400" />}
              </button>
            </div>
          </div>

          {/* Speaker Notes Toggle */}
          <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <div>
                <div className="text-xs font-bold">Include Speaker Talking Points</div>
                <div className="text-[11px] text-zinc-400">
                  Adds presenter talking cues at the bottom of each slide
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              id="speaker-notes-checkbox"
              disabled={isExporting}
              checked={includeSpeakerNotes}
              onChange={(e) => setIncludeSpeakerNotes(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 bg-zinc-800 border-zinc-700 cursor-pointer accent-indigo-600"
            />
          </div>
        </div>

        {/* Progress Bar (during compile) */}
        {isExporting && (
          <div className="space-y-2 p-3.5 rounded-xl bg-zinc-950 border border-indigo-500/40">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-indigo-300">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{progressMsg}</span>
              </span>
              <span className="font-mono font-bold text-indigo-400">{progressPct}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-150 rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Done Notification */}
        {isDone && !isExporting && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Presentation PDF compiled and downloaded to your device!</span>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-zinc-800 text-zinc-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
