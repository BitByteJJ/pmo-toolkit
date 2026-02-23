// OnboardingTour — First-time visitor navigation map
// Shows a visual map of the app's key areas with an optional guided walkthrough.
// Triggered on first visit (localStorage flag). User can "Take the Tour" or "Skip".

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, Sparkles, FileText, BookMarked, BookOpen,
  Map, Route, Compass, Search, X, ArrowRight, ArrowLeft,
  ChevronRight, Zap,
} from 'lucide-react';

const STORAGE_KEY = 'stratalign_onboarding_done';

// ── Tour steps ────────────────────────────────────────────────────────────────
const TOUR_STEPS = [
  {
    id: 'welcome',
    icon: Layers,
    color: '#38bdf8',
    bg: 'rgba(56,189,248,0.12)',
    title: 'Welcome to StratAlign',
    subtitle: '198 PM tools across 8 decks',
    body: 'StratAlign is your pocket PM toolkit. Browse 198 project management cards organised into 8 decks — from Project Phases to Advanced Techniques.',
    action: null,
    actionPath: null,
  },
  {
    id: 'decks',
    icon: Layers,
    color: '#38bdf8',
    bg: 'rgba(56,189,248,0.12)',
    title: 'Browse the 8 Decks',
    subtitle: 'Tap Decks ↑ in the bottom nav',
    body: 'Each deck covers a PM domain. Tap the Decks button in the centre of the bottom navigation bar to jump to any deck instantly.',
    action: 'Show me the decks',
    actionPath: '/deck/phases',
  },
  {
    id: 'ai',
    icon: Sparkles,
    color: '#818cf8',
    bg: 'rgba(129,140,248,0.12)',
    title: 'AI Tool Finder',
    subtitle: 'Describe your challenge, get recommendations',
    body: 'Not sure which tool to use? Tap the AI tab and describe your project challenge in plain English. The AI will recommend the most relevant cards.',
    action: 'Try AI Tool Finder',
    actionPath: '/ai-suggest',
  },
  {
    id: 'templates',
    icon: FileText,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.12)',
    title: 'Template Library',
    subtitle: '198 fillable templates — PDF & Word',
    body: 'Every card has a matching fillable template. Fill it in, then download as a branded PDF or Word document — ready to use in your next project.',
    action: 'Browse templates',
    actionPath: '/templates',
  },
  {
    id: 'journey',
    icon: Map,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    title: 'Learning Journey',
    subtitle: '35-day structured PM game',
    body: 'Learn PM concepts through a daily game — answer questions, earn XP, keep your streak alive. 35 days of structured lessons across all 8 decks.',
    action: 'Start my journey',
    actionPath: '/journey',
  },
  {
    id: 'decision',
    icon: Compass,
    color: '#0ea5e9',
    bg: 'rgba(14,165,233,0.12)',
    title: 'Decision Helper',
    subtitle: 'Answer 3 questions, get the right tool',
    body: 'Facing a project challenge but not sure where to start? Answer 3 quick questions and the Decision Helper will point you to the most relevant cards.',
    action: 'Get a recommendation',
    actionPath: '/decision',
  },
  {
    id: 'search',
    icon: Search,
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.12)',
    title: 'Search Everything',
    subtitle: 'Find any card, term, or technique',
    body: 'Use the Search tab to find any card by name, keyword, or tag. You can also filter by deck, difficulty level, or category.',
    action: 'Search now',
    actionPath: '/search',
  },
  {
    id: 'done',
    icon: Zap,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    title: "You're all set!",
    subtitle: 'Start exploring',
    body: 'That\'s the full tour. You can always access any feature from the bottom navigation bar or the Mini-Apps menu in the top right. Happy PM-ing!',
    action: 'Start exploring',
    actionPath: '/',
  },
];

// ── Navigation map items (shown on the map screen) ────────────────────────────
const MAP_ITEMS = [
  { icon: Layers,   color: '#38bdf8', bg: 'rgba(56,189,248,0.12)',  label: 'Decks',           sub: '8 decks · 198 cards',           path: '/deck/phases'   },
  { icon: Sparkles, color: '#818cf8', bg: 'rgba(129,140,248,0.12)',  label: 'AI Tool Finder',  sub: 'Describe your challenge',        path: '/ai-suggest'    },
  { icon: FileText, color: '#10b981', bg: 'rgba(16,185,129,0.12)',  label: 'Templates',       sub: '198 fillable templates',         path: '/templates'     },
  { icon: Map,      color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  label: 'Learning Journey',sub: '35-day PM game',                 path: '/journey'       },
  { icon: Compass,  color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)',  label: 'Decision Helper', sub: 'Find the right tool fast',       path: '/decision'      },
  { icon: Route,    color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)',  label: 'Roadmap',         sub: 'Beginner → Advanced paths',      path: '/roadmap'       },
  { icon: BookMarked, color: '#ec4899', bg: 'rgba(236,72,153,0.12)', label: 'Glossary',       sub: '120+ PM terms defined',          path: '/glossary'      },
  { icon: BookOpen, color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  label: 'Case Studies',    sub: 'Real-world PM stories',          path: '/case-studies'  },
  { icon: Search,   color: '#64748b', bg: 'rgba(100,116,139,0.12)',  label: 'Search',          sub: 'Find any card or term',          path: '/search'        },
];

interface OnboardingTourProps {
  onDismiss?: () => void;
}

export default function OnboardingTour({ onDismiss }: OnboardingTourProps) {
  const [, navigate] = useLocation();
  const [phase, setPhase] = useState<'map' | 'tour'>('map');
  const [stepIndex, setStepIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
    onDismiss?.();
  };

  const startTour = () => {
    setPhase('tour');
    setStepIndex(0);
  };

  const nextStep = () => {
    const step = TOUR_STEPS[stepIndex];
    if (step.actionPath && step.id !== 'done') {
      // Navigate to the relevant page and advance the step
      navigate(step.actionPath);
    }
    if (stepIndex < TOUR_STEPS.length - 1) {
      setStepIndex(i => i + 1);
    } else {
      dismiss();
    }
  };

  const prevStep = () => {
    if (stepIndex > 0) setStepIndex(i => i - 1);
  };

  const handleMapItemClick = (path: string) => {
    dismiss();
    navigate(path);
  };

  const currentStep = TOUR_STEPS[stepIndex];
  const isLastStep = stepIndex === TOUR_STEPS.length - 1;

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end justify-center"
        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          className="w-full rounded-t-3xl overflow-hidden"
          style={{
            maxWidth: '480px',
            maxHeight: '90vh',
            background: '#0f1c30',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.07)',
          }}
        >
          {/* ── MAP PHASE ─────────────────────────────────────────────────── */}
          {phase === 'map' && (
            <div className="flex flex-col" style={{ maxHeight: '90vh' }}>
              {/* Header */}
              <div className="flex items-start justify-between px-5 pt-5 pb-3 shrink-0">
                <div>
                  <h2 className="text-[18px] font-black text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                    Welcome to StratAlign
                  </h2>
                  <p className="text-[12px] text-slate-400 mt-0.5">
                    198 PM tools · 8 decks · Tap any area to explore
                  </p>
                </div>
                <button
                  onClick={dismiss}
                  className="w-7 h-7 rounded-full flex items-center justify-center bg-white/10 text-slate-400 hover:bg-white/15 transition-colors shrink-0 mt-0.5"
                  aria-label="Skip tour"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              </div>

              {/* Navigation map grid */}
              <div className="overflow-y-auto px-4 pb-2 flex-1">
                <div className="grid grid-cols-3 gap-2.5">
                  {MAP_ITEMS.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleMapItemClick(item.path)}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-2xl text-center transition-all hover:scale-[1.03] active:scale-[0.97]"
                      style={{ backgroundColor: item.bg }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: item.color + '20' }}
                      >
                        <item.icon size={18} strokeWidth={1.8} style={{ color: item.color }} />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-200 leading-tight">{item.label}</div>
                        <div className="text-[9px] text-slate-400 mt-0.5 leading-tight">{item.sub}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA buttons */}
              <div className="px-4 pt-3 pb-5 shrink-0 border-t border-white/8 flex flex-col gap-2.5">
                <button
                  onClick={startTour}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-[14px] text-white transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #0ea5e9)' }}
                >
                  <Zap size={16} strokeWidth={2.5} />
                  Take the guided tour
                  <ArrowRight size={16} strokeWidth={2.5} />
                </button>
                <button
                  onClick={dismiss}
                  className="w-full py-2.5 rounded-2xl text-[13px] font-semibold text-slate-400 hover:text-slate-300 hover:bg-white/5 transition-colors"
                >
                  Skip — I'll explore on my own
                </button>
              </div>
            </div>
          )}

          {/* ── TOUR PHASE ────────────────────────────────────────────────── */}
          {phase === 'tour' && (
            <div className="flex flex-col">
              {/* Progress bar */}
              <div className="h-1 bg-white/10 shrink-0">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #6366f1, #0ea5e9)' }}
                  animate={{ width: `${((stepIndex + 1) / TOUR_STEPS.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Step content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={stepIndex}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.22 }}
                  className="px-5 pt-5 pb-2"
                >
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: currentStep.bg }}
                  >
                    <currentStep.icon size={26} strokeWidth={1.8} style={{ color: currentStep.color }} />
                  </div>

                  {/* Step counter */}
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Step {stepIndex + 1} of {TOUR_STEPS.length}
                  </div>

                  {/* Title */}
                  <h3
                    className="text-[20px] font-black text-slate-100 leading-tight mb-1"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    {currentStep.title}
                  </h3>
                  <p className="text-[12px] font-semibold mb-3" style={{ color: currentStep.color }}>
                    {currentStep.subtitle}
                  </p>
                  <p className="text-[13.5px] text-slate-400 leading-relaxed">
                    {currentStep.body}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Navigation buttons */}
              <div className="px-5 pt-3 pb-6 flex items-center gap-3">
                {stepIndex > 0 && (
                  <button
                    onClick={prevStep}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 text-slate-400 hover:bg-white/15 transition-colors shrink-0"
                    aria-label="Previous step"
                  >
                    <ArrowLeft size={18} strokeWidth={2.5} />
                  </button>
                )}

                <button
                  onClick={nextStep}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-[14px] text-white transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ background: `linear-gradient(135deg, ${currentStep.color}, ${currentStep.color}cc)` }}
                >
                  {isLastStep ? 'Start exploring' : currentStep.action || 'Next'}
                  {isLastStep ? <Zap size={16} strokeWidth={2.5} /> : <ChevronRight size={16} strokeWidth={2.5} />}
                </button>

                {!isLastStep && (
                  <button
                    onClick={dismiss}
                    className="text-[11px] font-semibold text-slate-400 hover:text-slate-400 transition-colors whitespace-nowrap shrink-0"
                  >
                    Skip tour
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Hook to control tour visibility ──────────────────────────────────────────
export function useOnboardingTour() {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      // Small delay so the page renders first
      const t = setTimeout(() => setShowTour(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const dismissTour = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setShowTour(false);
  };

  const resetTour = () => {
    localStorage.removeItem(STORAGE_KEY);
    setShowTour(true);
  };

  return { showTour, dismissTour, resetTour };
}
