// StratAlign — Project Health Check Page
// 5-dimension diagnostic: Scope, Schedule, Budget, Team, Stakeholders
// Each dimension scored 1–5, then recommends cards for weak areas

import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Activity, CheckCircle2,
  AlertTriangle, XCircle, RefreshCw, ExternalLink,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { CARDS, DECKS, getDeckById } from '@/lib/pmoData';

// ── Dimensions ──────────────────────────────────────────────────────────────
interface Dimension {
  id: string;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  question: string;
  options: { score: number; label: string; description: string }[];
  cardIds: string[]; // cards to recommend when score ≤ 2
}

const DIMENSIONS: Dimension[] = [
  {
    id: 'scope',
    label: 'Scope',
    icon: '🗺️',
    color: '#0284C7',
    bgColor: '#EFF6FF',
    question: 'How well-defined is what your project needs to deliver?',
    options: [
      { score: 1, label: 'No idea', description: "Nobody agrees on what the project is supposed to produce" },
      { score: 2, label: 'Fuzzy', description: "There's a rough idea but it keeps changing" },
      { score: 3, label: 'Mostly clear', description: "We know the main deliverables but details are still being worked out" },
      { score: 4, label: 'Well defined', description: "Scope is documented and agreed by stakeholders" },
      { score: 5, label: 'Crystal clear', description: "Scope is locked, change-controlled, and everyone is aligned" },
    ],
    cardIds: ['process-8', 'T9', 'process-3', 'A33'],
  },
  {
    id: 'schedule',
    label: 'Schedule',
    icon: '📅',
    color: '#059669',
    bgColor: '#ECFDF5',
    question: 'How confident are you in your project timeline?',
    options: [
      { score: 1, label: 'No timeline', description: "There's no plan — we're just figuring it out as we go" },
      { score: 2, label: 'Slipping badly', description: "We're significantly behind and I'm not sure how to recover" },
      { score: 3, label: 'Some delays', description: "We're behind on a few things but it's manageable" },
      { score: 4, label: 'Mostly on track', description: "Minor delays but the overall timeline is intact" },
      { score: 5, label: 'On schedule', description: "We're hitting our milestones and the plan is realistic" },
    ],
    cardIds: ['T1', 'T2', 'T4', 'process-9'],
  },
  {
    id: 'budget',
    label: 'Budget',
    icon: '💰',
    color: '#D97706',
    bgColor: '#FEF3C7',
    question: 'How well is your project tracking against its budget?',
    options: [
      { score: 1, label: 'No budget', description: "We don't have a budget or any financial visibility" },
      { score: 2, label: 'Over budget', description: "We're spending more than planned and it's a concern" },
      { score: 3, label: 'Watching it', description: "Budget is a bit tight but we're keeping an eye on it" },
      { score: 4, label: 'Under control', description: "Spending is close to plan with minor variances" },
      { score: 5, label: 'On budget', description: "Financial tracking is solid and we're within tolerance" },
    ],
    cardIds: ['T4', 'process-5', 'T1', 'B3'],
  },
  {
    id: 'team',
    label: 'Team',
    icon: '👥',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    question: 'How well is your team working together?',
    options: [
      { score: 1, label: 'Falling apart', description: "There's serious conflict or people aren't engaged" },
      { score: 2, label: 'Struggling', description: "There are tensions and communication is difficult" },
      { score: 3, label: 'Getting there', description: "The team is functional but not yet high-performing" },
      { score: 4, label: 'Working well', description: "Good collaboration with occasional friction" },
      { score: 5, label: 'High performing', description: "The team is aligned, motivated, and delivering together" },
    ],
    cardIds: ['people-1', 'people-3', 'people-7', 'A15'],
  },
  {
    id: 'stakeholders',
    label: 'Stakeholders',
    icon: '🤝',
    color: '#E11D48',
    bgColor: '#FFF1F2',
    question: 'How engaged and supportive are your key stakeholders?',
    options: [
      { score: 1, label: 'Disengaged', description: "Key people aren't involved or don't care about the project" },
      { score: 2, label: 'Resistant', description: "Some stakeholders are blocking progress or pushing back" },
      { score: 3, label: 'Neutral', description: "Stakeholders are aware but not actively supporting" },
      { score: 4, label: 'Supportive', description: "Most stakeholders are engaged and backing the project" },
      { score: 5, label: 'Champions', description: "Stakeholders are actively advocating for the project" },
    ],
    cardIds: ['people-9', 'people-10', 'T11', 'process-11'],
  },
];

// ── Score helpers ────────────────────────────────────────────────────────────
function getHealthLabel(avg: number): { label: string; color: string; icon: React.ReactNode } {
  if (avg >= 4.5) return { label: 'Excellent', color: '#059669', icon: <CheckCircle2 size={18} /> };
  if (avg >= 3.5) return { label: 'Good', color: '#0284C7', icon: <CheckCircle2 size={18} /> };
  if (avg >= 2.5) return { label: 'Needs attention', color: '#D97706', icon: <AlertTriangle size={18} /> };
  return { label: 'At risk', color: '#E11D48', icon: <XCircle size={18} /> };
}

function CardChip({ cardId }: { cardId: string }) {
  const [, navigate] = useLocation();
  const card = CARDS.find(c => c.id === cardId || c.code === cardId);
  const deck = card ? getDeckById(card.deckId) : null;
  if (!card || !deck) return null;
  return (
    <button
      onClick={() => navigate(`/card/${card.id}`)}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all hover:opacity-80 active:scale-95"
      style={{ backgroundColor: deck.bgColor, color: deck.color, border: `1px solid ${deck.color}25` }}
    >
      <span className="font-mono">{card.code}</span>
      <span className="max-w-[110px] truncate">{card.title}</span>
      <ExternalLink size={9} />
    </button>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function HealthCheckPage() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0); // 0 = intro, 1-5 = questions, 6 = results
  const [scores, setScores] = useState<Record<string, number>>({});

  const totalSteps = DIMENSIONS.length;
  const isIntro = step === 0;
  const isResults = step === totalSteps + 1;
  const currentDim = DIMENSIONS[step - 1];

  function selectScore(dimId: string, score: number) {
    setScores(prev => ({ ...prev, [dimId]: score }));
    setTimeout(() => setStep(prev => prev + 1), 350);
  }

  function reset() {
    setScores({});
    setStep(0);
  }

  const avgScore = Object.values(scores).length > 0
    ? Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length
    : 0;

  const health = getHealthLabel(avgScore);

  // Dimensions scoring ≤ 2 get card recommendations
  const weakDimensions = DIMENSIONS.filter(d => (scores[d.id] ?? 5) <= 2);
  const attentionDimensions = DIMENSIONS.filter(d => {
    const s = scores[d.id] ?? 5;
    return s === 3;
  });

  return (
    <div className="min-h-screen flex flex-col pb-24" style={{ backgroundColor: '#F7F5F0' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between"
        style={{
          background: 'rgba(247,245,240,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <button
          onClick={() => step > 0 ? setStep(s => s - 1) : navigate('/')}
          className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 transition-colors"
        >
          <ChevronLeft size={16} />
          <span className="text-sm font-semibold">{step > 0 ? 'Back' : 'Home'}</span>
        </button>
        <div className="flex items-center gap-2">
          <Activity size={15} className="text-red-500" />
          <span className="text-sm font-bold text-stone-800">Health Check</span>
        </div>
        {isResults ? (
          <button onClick={reset} className="flex items-center gap-1 text-stone-400 hover:text-stone-700 transition-colors">
            <RefreshCw size={13} />
            <span className="text-xs font-semibold">Retake</span>
          </button>
        ) : (
          <div className="w-16" />
        )}
      </div>

      <div className="flex-1 px-4 py-4 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* ── Intro ── */}
          {isIntro && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="pt-4"
            >
              <div
                className="rounded-2xl p-6 mb-6 text-center"
                style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #E11D48 100%)' }}
              >
                <div className="text-4xl mb-3">🏥</div>
                <h2 className="text-xl font-black text-white mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Project Health Check
                </h2>
                <p className="text-sm text-white/80 leading-relaxed">
                  Answer 5 quick questions about your project. We'll score each area and recommend the right tools to fix any weak spots.
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {DIMENSIONS.map((d, i) => (
                  <div
                    key={d.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white"
                    style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                  >
                    <span className="text-xl">{d.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-stone-800">{d.label}</p>
                      <p className="text-[11px] text-stone-400">{d.question}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(1)}
                className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.99]"
                style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #E11D48 100%)' }}
              >
                Start Health Check
                <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {/* ── Question ── */}
          {!isIntro && !isResults && currentDim && (
            <motion.div
              key={`q-${step}`}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.28 }}
            >
              {/* Progress dots */}
              <div className="flex items-center gap-1.5 justify-center mb-6 mt-2">
                {DIMENSIONS.map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all"
                    style={{
                      width: i + 1 === step ? '20px' : '6px',
                      height: '6px',
                      backgroundColor: i + 1 < step ? currentDim.color : i + 1 === step ? currentDim.color : '#e7e5e4',
                    }}
                  />
                ))}
              </div>

              <div className="text-center mb-6">
                <span className="text-4xl">{currentDim.icon}</span>
                <p className="text-[11px] font-black text-stone-400 uppercase tracking-wider mt-2 mb-1">
                  {step} of {totalSteps} · {currentDim.label}
                </p>
                <h2
                  className="text-lg font-black text-stone-900 leading-snug"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  {currentDim.question}
                </h2>
              </div>

              <div className="space-y-2.5">
                {currentDim.options.map(opt => (
                  <motion.button
                    key={opt.score}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectScore(currentDim.id, opt.score)}
                    className="w-full text-left px-4 py-3.5 rounded-2xl bg-white transition-all"
                    style={{
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                      border: scores[currentDim.id] === opt.score ? `2px solid ${currentDim.color}` : '2px solid transparent',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-black"
                        style={{ backgroundColor: currentDim.bgColor, color: currentDim.color }}
                      >
                        {opt.score}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-800">{opt.label}</p>
                        <p className="text-[11px] text-stone-400 leading-relaxed">{opt.description}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Results ── */}
          {isResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              {/* Overall score */}
              <div
                className="rounded-2xl p-5 mb-5 text-center"
                style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)' }}
              >
                <p className="text-[11px] font-black text-stone-400 uppercase tracking-wider mb-2">Overall Health</p>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span style={{ color: health.color }}>{health.icon}</span>
                  <span className="text-2xl font-black text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                    {health.label}
                  </span>
                </div>
                <p className="text-sm text-stone-400">{avgScore.toFixed(1)} / 5.0 average score</p>
              </div>

              {/* Dimension scores */}
              <div className="space-y-2.5 mb-5">
                {DIMENSIONS.map(d => {
                  const score = scores[d.id] ?? 0;
                  const pct = (score / 5) * 100;
                  const opt = d.options.find(o => o.score === score);
                  return (
                    <div
                      key={d.id}
                      className="px-4 py-3 rounded-2xl bg-white"
                      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span>{d.icon}</span>
                          <span className="text-sm font-bold text-stone-800">{d.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold" style={{ color: d.color }}>{opt?.label}</span>
                          <span
                            className="text-xs font-black px-1.5 py-0.5 rounded-lg"
                            style={{ backgroundColor: d.bgColor, color: d.color }}
                          >
                            {score}/5
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: d.color + '20' }}>
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                          style={{ backgroundColor: d.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recommendations for weak areas */}
              {weakDimensions.length > 0 && (
                <div className="mb-5">
                  <h3
                    className="text-[11px] font-black text-stone-400 uppercase tracking-wider mb-3"
                  >
                    🚨 Priority areas — recommended tools
                  </h3>
                  <div className="space-y-3">
                    {weakDimensions.map(d => (
                      <div
                        key={d.id}
                        className="rounded-2xl p-4 bg-white"
                        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderLeft: `3px solid ${d.color}` }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span>{d.icon}</span>
                          <span className="text-sm font-bold text-stone-800">{d.label}</span>
                          <span
                            className="text-[9px] font-black px-1.5 py-0.5 rounded-lg"
                            style={{ backgroundColor: '#FFF1F2', color: '#E11D48' }}
                          >
                            Needs work
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {d.cardIds.map(id => <CardChip key={id} cardId={id} />)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attention areas */}
              {attentionDimensions.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-[11px] font-black text-stone-400 uppercase tracking-wider mb-3">
                    ⚠️ Worth monitoring
                  </h3>
                  <div className="space-y-3">
                    {attentionDimensions.map(d => (
                      <div
                        key={d.id}
                        className="rounded-2xl p-4 bg-white"
                        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderLeft: `3px solid ${d.color}` }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span>{d.icon}</span>
                          <span className="text-sm font-bold text-stone-800">{d.label}</span>
                          <span
                            className="text-[9px] font-black px-1.5 py-0.5 rounded-lg"
                            style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}
                          >
                            Watch this
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {d.cardIds.slice(0, 2).map(id => <CardChip key={id} cardId={id} />)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {weakDimensions.length === 0 && attentionDimensions.length === 0 && (
                <div
                  className="rounded-2xl p-5 text-center mb-5"
                  style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0' }}
                >
                  <p className="text-2xl mb-2">🎉</p>
                  <p className="text-sm font-bold text-green-800">Your project is in great shape!</p>
                  <p className="text-xs text-green-600 mt-1">Keep doing what you're doing and run this check again in a few weeks.</p>
                </div>
              )}

              <button
                onClick={reset}
                className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.99] bg-stone-900 text-white"
              >
                <RefreshCw size={14} />
                Run check again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
