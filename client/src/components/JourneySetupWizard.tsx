/**
 * JourneySetupWizard — shown once on first visit to /journey.
 *
 * Asks 3 plain-language questions:
 *   1. What's your role?
 *   2. How familiar are you with project management?
 *   3. What's your main goal?
 *
 * Stores the result in localStorage under 'pmo-journey-profile'.
 * The JourneyPage reads this to show a personalised welcome tip.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft, Sparkles } from 'lucide-react';

export const JOURNEY_PROFILE_KEY = 'pmo-journey-profile';

export interface JourneyProfile {
  role: string;
  experience: string;
  goal: string;
}

// ─── Question definitions ─────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: 'role',
    question: 'What best describes you right now?',
    subtitle: 'No right or wrong answer — just helps us tailor your path.',
    options: [
      { value: 'new-to-pm', label: "I'm completely new to project management", emoji: '🌱' },
      { value: 'team-member', label: "I work on projects but don't lead them", emoji: '🤝' },
      { value: 'new-pm', label: "I've just been given my first project to run", emoji: '🚀' },
      { value: 'experienced-pm', label: "I've managed projects before and want to sharpen my skills", emoji: '🎯' },
    ],
  },
  {
    id: 'experience',
    question: 'How comfortable are you with PM tools and frameworks?',
    subtitle: 'Think about things like Gantt charts, risk registers, or Agile.',
    options: [
      { value: 'none', label: "I've never used any — starting from zero", emoji: '🔰' },
      { value: 'heard-of', label: "I've heard of some but never really used them", emoji: '👀' },
      { value: 'some', label: "I've used a few and want to learn more", emoji: '📚' },
      { value: 'confident', label: "I'm fairly confident — looking for advanced techniques", emoji: '⚡' },
    ],
  },
  {
    id: 'goal',
    question: 'What do you most want to get out of this journey?',
    subtitle: 'This helps us highlight the most useful lessons for you.',
    options: [
      { value: 'understand-basics', label: 'Understand the basics so I can feel confident', emoji: '💡' },
      { value: 'handle-challenge', label: "Handle a specific challenge I'm facing right now", emoji: '🔧' },
      { value: 'pass-exam', label: 'Prepare for a PM qualification or exam', emoji: '🏆' },
      { value: 'grow-career', label: 'Grow my career and take on bigger projects', emoji: '📈' },
    ],
  },
];

// ─── Personalised tip based on answers ───────────────────────────────────────

export function getPersonalisedTip(profile: JourneyProfile): string {
  const { experience, goal } = profile;

  if (experience === 'none' || experience === 'heard-of') {
    if (goal === 'handle-challenge') {
      return "We've highlighted the most practical tools first — start with the Foundations unit to build confidence, then use the Decision Helper to find tools for your specific challenge.";
    }
    return "We've set you up with a beginner-friendly path. The Foundations unit covers everything you need to feel confident. Take it one day at a time — 10 minutes a day is all it takes.";
  }

  if (experience === 'some') {
    if (goal === 'pass-exam') {
      return "Great — you already have a head start. Focus on the Process and Techniques units to fill any gaps, and use the Search page to quickly look up specific frameworks.";
    }
    return "You're in a great position to build on what you know. We've unlocked a slightly faster path — feel free to skim lessons on topics you already know well.";
  }

  if (experience === 'confident') {
    return "Welcome back, experienced PM! The Mastery unit and advanced technique cards are where you'll find the most value. Use the Beginner/Intermediate/Advanced filters in each deck to go straight to the challenging content.";
  }

  return "Your personalised journey is ready. Start with Day 1 whenever you're ready — you can always come back and pick up where you left off.";
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  onComplete: (profile: JourneyProfile) => void;
}

export default function JourneySetupWizard({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<JourneyProfile>>({});

  const q = QUESTIONS[step];
  const totalSteps = QUESTIONS.length;
  const isLast = step === totalSteps - 1;

  function selectOption(value: string) {
    const key = q.id as keyof JourneyProfile;
    const updated = { ...answers, [key]: value };
    setAnswers(updated);

    if (isLast) {
      const profile = updated as JourneyProfile;
      localStorage.setItem(JOURNEY_PROFILE_KEY, JSON.stringify(profile));
      onComplete(profile);
    } else {
      setTimeout(() => setStep(s => s + 1), 180);
    }
  }

  function goBack() {
    if (step > 0) setStep(s => s - 1);
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}
    >
      <motion.div
        initial={{ y: 80, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="w-full max-w-sm rounded-3xl overflow-hidden"
        style={{
          background: '#0f1c30',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)',
        }}
      >
        {/* Top gradient accent bar */}
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(to right, #7c3aed, #2563eb, #0ea5e9)' }} />

        <div className="px-6 pt-5 pb-6">
          {/* Header row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              {step > 0 && (
                <button
                  onClick={goBack}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Back"
                >
                  <ArrowLeft size={14} className="text-slate-400" />
                </button>
              )}
              <div className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-violet-400" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Personalise your journey
                </span>
              </div>
            </div>
            {/* Step dots */}
            <div className="flex gap-1.5">
              {QUESTIONS.map((_, i) => (
                <motion.div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  animate={{
                    width: i === step ? 16 : 6,
                    backgroundColor: i <= step ? '#7c3aed' : 'rgba(255,255,255,0.15)',
                  }}
                  style={{ height: 6 }}
                />
              ))}
            </div>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h2
                className="text-lg font-black text-white leading-tight mb-1.5"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                {q.question}
              </h2>
              <p className="text-[12px] text-slate-400 mb-4 leading-relaxed">{q.subtitle}</p>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map(opt => {
                  const isSelected = answers[q.id as keyof JourneyProfile] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => selectOption(opt.value)}
                      className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all hover:scale-[1.01] active:scale-[0.98]"
                      style={{
                        background: isSelected
                          ? 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(37,99,235,0.15))'
                          : 'rgba(255,255,255,0.04)',
                        border: isSelected
                          ? '1.5px solid rgba(124,58,237,0.5)'
                          : '1.5px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <span className="text-xl shrink-0">{opt.emoji}</span>
                      <span className="text-sm font-semibold text-slate-200 leading-tight flex-1">
                        {opt.label}
                      </span>
                      <ChevronRight
                        size={14}
                        className="shrink-0"
                        style={{ color: isSelected ? '#a78bfa' : '#475569' }}
                      />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Step counter */}
          <p className="text-[10px] text-slate-500 text-center mt-4">
            Question {step + 1} of {totalSteps}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
