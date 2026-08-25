import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { FOCUS_DNA_SLIDES, SlideData } from '../data/presentationSlides';
import { PdfExportModal } from './PdfExportModal';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  FileText,
  Printer,
  FileDown,
  Clock,
  Dna,
  Sun,
  Moon,
  Sparkles,
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  Layers,
  Zap,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Award,
  Calendar,
  Wind,
  Radio,
  BookOpen,
} from 'lucide-react';

type ProjectorTheme = 'light' | 'dark' | 'paper';

export const PresentationView: React.FC = () => {
  const { focusDna, setActiveView } = useApp();

  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [theme, setTheme] = useState<ProjectorTheme>('light'); // default to high-contrast neat light for projectors!
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState<boolean>(false);
  const [showSlideGrid, setShowSlideGrid] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  // Presenter Speaking Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const totalSlides = FOCUS_DNA_SLIDES.length;
  const currentSlide = FOCUS_DNA_SLIDES[currentSlideIndex];

  // Timer tick
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.min(totalSlides - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setCurrentSlideIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setCurrentSlideIndex(totalSlides - 1);
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setShowSpeakerNotes((prev) => !prev);
      } else if (e.key.toLowerCase() === 'g') {
        e.preventDefault();
        setShowSlideGrid((prev) => !prev);
      } else if (e.key.toLowerCase() === 'p' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsPdfModalOpen(true);
      }
    },
    [totalSlides]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Print presentation as clean PDF
  const handlePrint = () => {
    window.print();
  };

  // Theme-specific styling classes
  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          wrapper: 'bg-zinc-100 text-zinc-900',
          slideCanvas: 'bg-white text-zinc-900 border-zinc-300 shadow-xl',
          headerBadge: 'bg-zinc-100 text-zinc-800 border-zinc-300',
          heading: 'text-zinc-950',
          subheading: 'text-zinc-600',
          card: 'bg-zinc-50 border-zinc-200 text-zinc-900',
          cardSub: 'text-zinc-500',
          cardHighlight: 'border-zinc-400 bg-zinc-100',
          accentBadge: 'bg-zinc-200 text-zinc-900 font-semibold',
          metricBox: 'bg-zinc-50 border-zinc-200',
          divider: 'border-zinc-200',
          toolbar: 'bg-white/90 border-zinc-300 text-zinc-800 backdrop-blur-md',
          notesBox: 'bg-amber-50/80 border-amber-200 text-amber-950',
        };
      case 'paper':
        return {
          wrapper: 'bg-[#fafafa] text-[#111111]',
          slideCanvas: 'bg-white text-black border-[#e0e0e0] shadow-md',
          headerBadge: 'bg-transparent text-black border-black/40',
          heading: 'text-black',
          subheading: 'text-neutral-600',
          card: 'bg-white border-neutral-300 text-black',
          cardSub: 'text-neutral-600',
          cardHighlight: 'border-black bg-neutral-100',
          accentBadge: 'bg-neutral-200 text-black font-semibold',
          metricBox: 'bg-white border-neutral-300',
          divider: 'border-neutral-200',
          toolbar: 'bg-white border-neutral-300 text-black',
          notesBox: 'bg-neutral-100 border-neutral-300 text-neutral-900',
        };
      case 'dark':
      default:
        return {
          wrapper: 'bg-zinc-950 text-zinc-100',
          slideCanvas: 'bg-zinc-900 text-zinc-100 border-zinc-800 shadow-2xl',
          headerBadge: 'bg-zinc-800/80 text-zinc-300 border-zinc-700/60',
          heading: 'text-zinc-50',
          subheading: 'text-zinc-400',
          card: 'bg-zinc-950/70 border-zinc-800 text-zinc-200',
          cardSub: 'text-zinc-400',
          cardHighlight: 'border-indigo-500/50 bg-zinc-950',
          accentBadge: 'bg-zinc-800 text-zinc-200 font-semibold',
          metricBox: 'bg-zinc-950/80 border-zinc-800',
          divider: 'border-zinc-800',
          toolbar: 'bg-zinc-900/90 border-zinc-800 text-zinc-200 backdrop-blur-md',
          notesBox: 'bg-zinc-950 border-zinc-800 text-zinc-300',
        };
    }
  };

  const tc = getThemeClasses();

  return (
    <div
      ref={containerRef}
      className={`min-h-screen flex flex-col justify-between transition-colors duration-200 p-3 md:p-6 select-none ${tc.wrapper}`}
    >
      {/* Top Presentation Bar (Presenter Controls) */}
      <header className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-inherit no-print">
        {/* Brand & Mode */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-600/30 flex items-center justify-center">
              <Dna className="w-4 h-4 text-indigo-500" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight block">FocusDNA</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                Projector Presentation
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-zinc-300 dark:bg-zinc-800 hidden sm:block" />

          {/* Presenter Timer */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg border border-inherit text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>{formatTimer(timerSeconds)}</span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="text-[10px] hover:underline text-zinc-500"
            >
              {isTimerRunning ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={() => setTimerSeconds(0)}
              className="text-[10px] hover:underline text-zinc-500"
              title="Reset Timer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Selector (Light / Dark / Paper) */}
          <div className="flex items-center rounded-lg border border-inherit p-0.5 text-xs">
            <button
              onClick={() => setTheme('light')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
                theme === 'light' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
              }`}
              title="Clean Projector Light (Recommended for standard projectors)"
            >
              <Sun className="w-3 h-3" />
              <span>Projector Light</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
                theme === 'dark' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-100'
              }`}
              title="Deep Minimalist Dark"
            >
              <Moon className="w-3 h-3" />
              <span>Dark</span>
            </button>
            <button
              onClick={() => setTheme('paper')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center gap-1 ${
                theme === 'paper' ? 'bg-black text-white shadow-sm' : 'text-zinc-600 hover:text-black'
              }`}
              title="Monochrome Paper (Maximum contrast)"
            >
              <span>Mono</span>
            </button>
          </div>

          {/* Speaker Notes Toggle */}
          <button
            onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
            className={`px-3 py-1.5 rounded-lg border border-inherit text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              showSpeakerNotes ? 'bg-indigo-600 text-white border-transparent' : 'hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
            title="Toggle Speaker Talking Points (Shortcut: N)"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Notes</span>
          </button>

          {/* Slide Grid / Overview */}
          <button
            onClick={() => setShowSlideGrid(!showSlideGrid)}
            className={`px-3 py-1.5 rounded-lg border border-inherit text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              showSlideGrid ? 'bg-indigo-600 text-white border-transparent' : 'hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
            title="Toggle Slide Grid (Shortcut: G)"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Slides</span>
          </button>

          {/* Export to PDF Button */}
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            title="Export Presentation to PDF file (Shortcut: P)"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>

          {/* Print / Save */}
          <button
            onClick={handlePrint}
            className="p-1.5 rounded-lg border border-inherit hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            title="Print Slide via Browser Print Dialog"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg border border-inherit hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            title="Toggle Fullscreen (Shortcut: F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Slide Presentation Stage (16:9 Aspect Ratio Container) */}
      <main className="my-auto py-4 flex flex-col items-center justify-center w-full">
        {/* Slide Canvas Container */}
        <div
          className={`w-full max-w-5xl rounded-2xl border p-6 md:p-10 transition-all duration-150 relative min-h-[520px] md:min-h-[560px] flex flex-col justify-between ${tc.slideCanvas}`}
        >
          {/* Top Slide Meta Row */}
          <div className="flex items-center justify-between pb-4 border-b border-inherit">
            <div className="flex items-center gap-2.5">
              <span className={`text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${tc.headerBadge}`}>
                {currentSlide.category}
              </span>
              <span className="text-xs font-mono font-semibold opacity-60">
                FocusDNA Slide {currentSlide.slideNumber}
              </span>
            </div>

            <div className="text-xs font-mono font-bold tracking-tight opacity-70">
              {currentSlideIndex + 1} / {totalSlides}
            </div>
          </div>

          {/* Slide Main Content Area */}
          <div className="py-6 space-y-6 my-auto">
            {/* Title & Subtitle */}
            <div className="space-y-2">
              <h1 className={`text-2xl md:text-4xl font-extrabold tracking-tight leading-tight ${tc.heading}`}>
                {currentSlide.title}
              </h1>
              <p className={`text-sm md:text-base font-medium leading-relaxed max-w-3xl ${tc.subheading}`}>
                {currentSlide.subtitle}
              </p>
            </div>

            {/* Layout Variant: HERO (Slide 1) */}
            {currentSlide.layout === 'hero' && (
              <div className="space-y-6 pt-2">
                {/* 3 Core Metric Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentSlide.metrics?.map((m, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${tc.metricBox} space-y-1`}>
                      <span className="text-2xl md:text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                        {m.value}
                      </span>
                      <div className="text-xs font-bold uppercase tracking-wider">{m.label}</div>
                      <p className={`text-xs ${tc.cardSub}`}>{m.description}</p>
                    </div>
                  ))}
                </div>

                {/* 3 Executive Bullet Points */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  {currentSlide.bullets?.map((b, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${tc.card} space-y-1.5`}>
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                        {b.tag}
                      </span>
                      <h4 className="text-xs font-bold">{b.title}</h4>
                      <p className={`text-xs leading-relaxed ${tc.cardSub}`}>{b.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Layout Variant: COMPARISON (Slide 2) */}
            {currentSlide.layout === 'comparison' && currentSlide.comparison && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Left: Traditional Pomodoro */}
                <div className={`p-5 rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-3`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                      {currentSlide.comparison.leftTitle}
                    </h3>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-200 dark:bg-rose-900/80 text-rose-900 dark:text-rose-200">
                      {currentSlide.comparison.leftBadge}
                    </span>
                  </div>
                  <ul className="space-y-2 text-xs text-rose-950 dark:text-rose-300/90 leading-relaxed">
                    {currentSlide.comparison.leftPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-500 font-bold mt-0.5">✕</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right: FocusDNA */}
                <div className={`p-5 rounded-xl border border-emerald-300 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                      {currentSlide.comparison.rightTitle}
                    </h3>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200">
                      {currentSlide.comparison.rightBadge}
                    </span>
                  </div>
                  <ul className="space-y-2 text-xs text-emerald-950 dark:text-emerald-300/90 leading-relaxed">
                    {currentSlide.comparison.rightPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Layout Variant: THREE CARDS (Slide 3 & Slide 6) */}
            {(currentSlide.layout === 'three-card' || currentSlide.layout === 'circadian') && currentSlide.cards && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {currentSlide.cards.map((c, idx) => (
                  <div key={idx} className={`p-5 rounded-xl border ${tc.card} space-y-2`}>
                    {c.accent && (
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                        {c.accent}
                      </span>
                    )}
                    <h3 className="text-sm font-bold">{c.title}</h3>
                    <p className={`text-xs leading-relaxed ${tc.cardSub}`}>{c.desc}</p>
                    {c.subtext && (
                      <div className="pt-2 border-t border-inherit text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 font-mono">
                        {c.subtext}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Layout Variant: MATHEMATICAL FORMULA (Slide 4) */}
            {currentSlide.layout === 'formula' && currentSlide.formulaDetails && (
              <div className="space-y-4 pt-1">
                {/* Clean Math Expression Banner */}
                <div className="p-4 rounded-xl border border-indigo-400 dark:border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-800 dark:text-indigo-300">
                    FocusDNA Composite Formula
                  </span>
                  <div className="text-base md:text-lg font-mono font-bold text-indigo-950 dark:text-indigo-100">
                    {currentSlide.formulaDetails.formula}
                  </div>
                </div>

                {/* Variable Breakdown Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentSlide.formulaDetails.variables.map((v, idx) => (
                    <div key={idx} className={`p-3.5 rounded-xl border ${tc.card} space-y-1`}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800">
                          {v.symbol}
                        </span>
                        <span className="text-xs font-bold">{v.name}</span>
                      </div>
                      <p className={`text-xs ${tc.cardSub}`}>{v.impact}</p>
                    </div>
                  ))}
                </div>

                <div className={`p-3 rounded-xl border ${tc.card} text-xs font-medium text-center`}>
                  💡 <span className="font-bold">Live Calibration:</span> {currentSlide.formulaDetails.takeaway}
                </div>
              </div>
            )}

            {/* Layout Variant: TWO COLUMN / IN-SESSION (Slide 5 & Slide 7) */}
            {(currentSlide.layout === 'two-column' || currentSlide.layout === 'digest') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {currentSlide.bullets && (
                  <div className="space-y-3">
                    {currentSlide.bullets.map((b, idx) => (
                      <div key={idx} className={`p-3.5 rounded-xl border ${tc.card} space-y-1`}>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                          <h4 className="text-xs font-bold">{b.title}</h4>
                        </div>
                        <p className={`text-xs ${tc.cardSub} pl-3.5`}>{b.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {currentSlide.cards && (
                  <div className="space-y-3">
                    {currentSlide.cards.map((c, idx) => (
                      <div key={idx} className={`p-3.5 rounded-xl border ${tc.cardHighlight} space-y-1.5`}>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                          {c.accent}
                        </span>
                        <h4 className="text-xs font-bold">{c.title}</h4>
                        <p className={`text-xs ${tc.cardSub}`}>{c.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Layout Variant: METRICS GRID (Slide 8) */}
            {currentSlide.layout === 'metrics-grid' && (
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {currentSlide.metrics?.map((m, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${tc.metricBox} text-center space-y-1`}>
                      <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                        {m.value}
                      </div>
                      <div className="text-xs font-bold uppercase tracking-wider">{m.label}</div>
                      <p className={`text-[11px] ${tc.cardSub}`}>{m.description}</p>
                    </div>
                  ))}
                </div>

                {currentSlide.summary && (
                  <div className={`p-4 rounded-xl border ${tc.card} text-xs leading-relaxed text-center font-medium`}>
                    "{currentSlide.summary}"
                  </div>
                )}
              </div>
            )}

            {/* Layout Variant: ARCHITECTURE (Slide 9) */}
            {currentSlide.layout === 'architecture' && (
              <div className="space-y-3 pt-1">
                {currentSlide.architectureLayers?.map((layer, idx) => (
                  <div key={idx} className={`p-3.5 rounded-xl border ${tc.card} flex flex-col md:flex-row md:items-center justify-between gap-2`}>
                    <div className="space-y-0.5 md:w-1/3">
                      <span className="text-xs font-bold block">{layer.layer}</span>
                      <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 block">
                        {layer.components}
                      </span>
                    </div>
                    <p className={`text-xs ${tc.cardSub} md:w-2/3`}>{layer.purpose}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Layout Variant: CONCLUSION (Slide 10) */}
            {currentSlide.layout === 'conclusion' && (
              <div className="space-y-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {currentSlide.bullets?.map((b, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${tc.card} space-y-2 text-center`}>
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        {b.highlight}
                      </span>
                      <h4 className="text-xs font-bold">{b.title}</h4>
                      <p className={`text-xs ${tc.cardSub}`}>{b.description}</p>
                    </div>
                  ))}
                </div>

                {/* Live Demo Trigger Banner & Export PDF */}
                <div className="p-5 rounded-2xl border border-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                  <div>
                    <h3 className="text-base font-bold text-indigo-950 dark:text-indigo-100">
                      Ready for Live FocusDNA Interactive Demonstration
                    </h3>
                    <p className="text-xs text-indigo-800 dark:text-indigo-300">
                      Switch to the live dashboard to trigger the Circadian Day Optimizer, AI Coach, and 2-Min Reset.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setIsPdfModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl border border-indigo-300 dark:border-indigo-700 hover:bg-white dark:hover:bg-zinc-900 text-indigo-900 dark:text-indigo-200 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>Download Deck PDF</span>
                    </button>
                    <button
                      onClick={() => setActiveView('dashboard')}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Launch Live App</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Slide Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-inherit text-xs opacity-60">
            <span className="font-semibold">FocusDNA · Attention Architecture</span>
            <span className="font-mono">Slide {currentSlideIndex + 1} of {totalSlides}</span>
          </div>
        </div>

        {/* Speaker Notes Drawer (if enabled) */}
        {showSpeakerNotes && (
          <div className={`w-full max-w-5xl mt-4 p-4 rounded-xl border ${tc.notesBox} space-y-2 no-print animate-in fade-in duration-150`}>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Presenter Talking Points · Slide {currentSlide.slideNumber}</span>
              </span>
              <button
                onClick={() => setShowSpeakerNotes(false)}
                className="text-xs font-semibold hover:underline"
              >
                Hide
              </button>
            </div>
            <ul className="space-y-1 text-xs leading-relaxed">
              {currentSlide.speakerNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      {/* Slide Thumbnails Grid Modal (if opened) */}
      {showSlideGrid && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 no-print">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 max-w-4xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl text-zinc-100">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold">Slide Navigator ({totalSlides} Slides)</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowSlideGrid(false);
                    setIsPdfModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Download PDF Deck</span>
                </button>
                <button
                  onClick={() => setShowSlideGrid(false)}
                  className="text-zinc-400 hover:text-zinc-100 text-sm font-bold ml-2"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {FOCUS_DNA_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => {
                    setCurrentSlideIndex(idx);
                    setShowSlideGrid(false);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all space-y-1.5 ${
                    currentSlideIndex === idx
                      ? 'bg-indigo-950 border-indigo-500 shadow-md'
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                    <span>#{slide.slideNumber}</span>
                    <span className="truncate max-w-[80px]">{slide.category}</span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-200 line-clamp-2">{slide.title}</h4>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Presenter Navigation Bar */}
      <footer className="w-full max-w-5xl mx-auto flex items-center justify-between pt-3 border-t border-inherit no-print">
        {/* Left: Quick Jump Menu & PDF Quick Action */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentSlideIndex(0)}
            disabled={currentSlideIndex === 0}
            className="px-2.5 py-1 rounded-lg border border-inherit text-xs font-medium disabled:opacity-40 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            First
          </button>
          <button
            onClick={() => setCurrentSlideIndex(totalSlides - 1)}
            disabled={currentSlideIndex === totalSlides - 1}
            className="px-2.5 py-1 rounded-lg border border-inherit text-xs font-medium disabled:opacity-40 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            Last
          </button>
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg border border-inherit text-xs font-medium hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-indigo-600 dark:text-indigo-400 font-semibold"
            title="Download PDF File"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
        </div>

        {/* Center: Slide Step Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentSlideIndex === 0}
            className="p-2 rounded-xl border border-inherit disabled:opacity-30 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Previous Slide (ArrowLeft)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Slide Progress Dots */}
          <div className="flex items-center gap-1 px-2">
            {FOCUS_DNA_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlideIndex === idx
                    ? 'w-6 bg-indigo-600'
                    : 'w-2 bg-zinc-400 dark:bg-zinc-700 hover:bg-zinc-500'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.min(totalSlides - 1, prev + 1))}
            disabled={currentSlideIndex === totalSlides - 1}
            className="p-2 rounded-xl border border-inherit disabled:opacity-30 bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-1 text-xs font-semibold shadow-sm"
            title="Next Slide (ArrowRight or Space)"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Return to App button */}
        <div>
          <button
            onClick={() => setActiveView('dashboard')}
            className="px-3 py-1.5 rounded-lg border border-inherit text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            Exit to App →
          </button>
        </div>
      </footer>

      {/* PDF Export Modal */}
      <PdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        currentSlideIndex={currentSlideIndex}
      />
    </div>
  );
};
