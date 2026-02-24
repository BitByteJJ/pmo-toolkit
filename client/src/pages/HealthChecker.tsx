// HealthChecker — Project Health Diagnostic
// 8 dimensions × 4-point Likert scale → radar chart + card recommendations
// Pure SVG radar chart (no external chart library)

import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Activity,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { getCardById, getDeckById } from '@/lib/pmoData';
import { useTheme } from '@/contexts/ThemeContext';
import PageFooter from '@/components/PageFooter';

// ─── DIMENSIONS & QUESTIONS ───────────────────────────────────────────────────
interface Dimension {
  id: string;
  label: string;
  shortLabel: string;
  color: string;
  questions: { text: string }[];
  lowCards: string[];   // card IDs to recommend when score is low
  highCards: string[];  // card IDs to recommend when score is high
}

const DIMENSIONS: Dimension[] = [
  {
    id: 'scope',
    label: 'Scope Clarity',
    shortLabel: 'Scope',
    color: '#3b82f6',
    questions: [
      { text: 'The project scope is clearly defined and agreed by all stakeholders.' },
      { text: 'Scope changes are managed through a formal change control process.' },
    ],
    lowCards: ['T14', 'T7', 'phase-setup'],
    highCards: ['A20', 'A33'],
  },
  {
    id: 'risk',
    label: 'Risk Management',
    shortLabel: 'Risk',
    color: '#ef4444',
    questions: [
      { text: 'Risks are actively identified, assessed, and tracked.' },
      { text: 'Mitigation plans exist for the top risks.' },
    ],
    lowCards: ['T6', 'A14', 'phase-setup'],
    highCards: ['A47', 'A23'],
  },
  {
    id: 'stakeholder',
    label: 'Stakeholder Engagement',
    shortLabel: 'Stakeholders',
    color: '#8b5cf6',
    questions: [
      { text: 'Key stakeholders are identified and their needs are understood.' },
      { text: 'Stakeholders receive regular, relevant updates.' },
    ],
    lowCards: ['T16', 'A15', 'A61'],
    highCards: ['A15', 'A61'],
  },
  {
    id: 'schedule',
    label: 'Schedule Control',
    shortLabel: 'Schedule',
    color: '#f59e0b',
    questions: [
      { text: 'The project has a realistic, baselined schedule.' },
      { text: 'Progress is tracked and deviations are addressed promptly.' },
    ],
    lowCards: ['T1', 'T3', 'A35'],
    highCards: ['A23', 'A61'],
  },
  {
    id: 'team',
    label: 'Team Performance',
    shortLabel: 'Team',
    color: '#10b981',
    questions: [
      { text: 'Team roles and responsibilities are clearly defined.' },
      { text: 'The team collaborates effectively and resolves conflicts quickly.' },
    ],
    lowCards: ['arch-sponsor', 'arch-pm', 'arch-team'],
    highCards: ['A15', 'A23'],
  },
  {
    id: 'quality',
    label: 'Quality Assurance',
    shortLabel: 'Quality',
    color: '#06b6d4',
    questions: [
      { text: 'Quality criteria are defined and agreed with stakeholders.' },
      { text: 'Testing and review processes are in place and followed.' },
    ],
    lowCards: ['meth-agile', 'T6', 'A14'],
    highCards: ['meth-agile', 'A47'],
  },
  {
    id: 'budget',
    label: 'Budget Control',
    shortLabel: 'Budget',
    color: '#f97316',
    questions: [
      { text: 'The project budget is baselined and tracked regularly.' },
      { text: 'Cost variances are identified and acted upon quickly.' },
    ],
    lowCards: ['T3', 'A23', 'phase-execution'],
    highCards: ['A61', 'A23'],
  },
  {
    id: 'delivery',
    label: 'Delivery Confidence',
    shortLabel: 'Delivery',
    color: '#ec4899',
    questions: [
      { text: 'The team is confident the project will deliver on time and to scope.' },
      { text: 'Dependencies and blockers are managed proactively.' },
    ],
    lowCards: ['meth-agile', 'A47', 'T2'],
    highCards: ['phase-closure', 'A61'],
  },
];

// ─── RADAR CHART ─────────────────────────────────────────────────────────────
function RadarChart({ scores }: { scores: Record<string, number> }) {
  const { isDark } = useTheme();
  const N = DIMENSIONS.length;
  const SIZE = 240;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = 90;
  const LEVELS = 4;

  // Angle for each dimension (start from top, go clockwise)
  const angle = (i: number) => (Math.PI * 2 * i) / N - Math.PI / 2;

  // Point on polygon
  const pt = (i: number, r: number) => ({
    x: CX + r * Math.cos(angle(i)),
    y: CY + r * Math.sin(angle(i)),
  });

  // Build polygon path from scores
  const dataPoints = DIMENSIONS.map((d, i) => {
    const score = scores[d.id] ?? 0;
    const r = (score / 4) * R;
    return pt(i, r);
  });

  const dataPath =
    dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z';

  // Grid polygons
  const gridPolygons = Array.from({ length: LEVELS }, (_, lvl) => {
    const r = ((lvl + 1) / LEVELS) * R;
    return DIMENSIONS.map((_, i) => {
      const p = pt(i, r);
      return `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }).join(' ') + ' Z';
  });

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto">
      {/* Grid */}
      {gridPolygons.map((path, i) => (
        <path
          key={i}
          d={path}
          fill="none"
          stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {DIMENSIONS.map((_, i) => {
        const outer = pt(i, R);
        return (
          <line
            key={i}
            x1={CX}
            y1={CY}
            x2={outer.x}
            y2={outer.y}
            stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
            strokeWidth="1"
          />
        );
      })}

      {/* Data polygon */}
      <path
        d={dataPath}
        fill="rgba(99,102,241,0.2)"
        stroke="#6366f1"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          fill={DIMENSIONS[i].color}
          stroke={isDark ? '#0a1628' : '#f1f5f9'}
          strokeWidth="1.5"
        />
      ))}

      {/* Labels */}
      {DIMENSIONS.map((d, i) => {
        const labelR = R + 18;
        const p = pt(i, labelR);
        const textAnchor =
          Math.abs(p.x - CX) < 5 ? 'middle' : p.x < CX ? 'end' : 'start';
        return (
          <text
            key={i}
            x={p.x}
            y={p.y + 4}
            textAnchor={textAnchor}
            fontSize="9"
            fontWeight="700"
            fill={isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'}
          >
            {d.shortLabel}
          </text>
        );
      })}
    </svg>
  );
}

// ─── QUESTION STEP ────────────────────────────────────────────────────────────
const LIKERT = [
  { value: 1, label: 'Strongly Disagree', short: 'No' },
  { value: 2, label: 'Disagree', short: 'Mostly No' },
  { value: 3, label: 'Agree', short: 'Mostly Yes' },
  { value: 4, label: 'Strongly Agree', short: 'Yes' },
];

interface Answer {
  dimId: string;
  qIndex: number;
  value: number;
}

// Build flat question list
const ALL_QUESTIONS = DIMENSIONS.flatMap(d =>
  d.questions.map((q, qi) => ({ dimId: d.id, qIndex: qi, text: q.text }))
);

// ─── RECOMMENDATIONS ─────────────────────────────────────────────────────────
function Recommendations({ scores }: { scores: Record<string, number> }) {
  const [, navigate] = useLocation();
  const { isDark } = useTheme();

  // Find weak dimensions (score < 2.5) and strong (score >= 3.5)
  const weak = DIMENSIONS.filter(d => (scores[d.id] ?? 0) < 2.5);
  const strong = DIMENSIONS.filter(d => (scores[d.id] ?? 0) >= 3.5);

  // Collect recommended card IDs (deduplicated)
  const recommendedIds = Array.from(
    new Set([
      ...weak.flatMap(d => d.lowCards),
      ...strong.flatMap(d => d.highCards),
    ])
  ).slice(0, 8);

  const avgScore = Object.values(scores).reduce((a, b) => a + b, 0) / DIMENSIONS.length;

  const healthLabel =
    avgScore >= 3.5 ? 'Excellent' :
    avgScore >= 2.5 ? 'Good' :
    avgScore >= 1.5 ? 'Needs Attention' :
    'Critical';

  const healthColor =
    avgScore >= 3.5 ? '#10b981' :
    avgScore >= 2.5 ? '#3b82f6' :
    avgScore >= 1.5 ? '#f59e0b' :
    '#ef4444';

  return (
    <div className="space-y-4">
      {/* Overall score */}
      <div
        className="rounded-2xl p-4 text-center"
        style={{
          background: healthColor + '12',
          border: `1.5px solid ${healthColor}30`,
        }}
      >
        <div
          className="text-3xl font-black mb-1"
          style={{ color: healthColor, fontFamily: 'Sora, sans-serif' }}
        >
          {avgScore.toFixed(1)} / 4.0
        </div>
        <div className="text-sm font-bold" style={{ color: healthColor }}>{healthLabel}</div>
        <div className="text-xs text-muted-foreground mt-1">Overall Project Health Score</div>
      </div>

      {/* Radar chart */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <RadarChart scores={scores} />
      </div>

      {/* Dimension scores */}
      <div className="space-y-2">
        {DIMENSIONS.map(d => {
          const score = scores[d.id] ?? 0;
          const pct = (score / 4) * 100;
          const isWeak = score < 2.5;
          return (
            <div
              key={d.id}
              className="rounded-xl p-3 flex items-center gap-3"
              style={{
                background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                border: isWeak
                  ? `1px solid ${d.color}30`
                  : (isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(0,0,0,0.04)'),
              }}
            >
              {isWeak ? (
                <AlertTriangle size={14} style={{ color: d.color, flexShrink: 0 }} />
              ) : (
                <CheckCircle2 size={14} style={{ color: d.color, flexShrink: 0 }} />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-foreground">{d.label}</span>
                  <span className="text-xs font-black" style={{ color: d.color }}>{score.toFixed(1)}</span>
                </div>
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: d.color }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommended cards */}
      {recommendedIds.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-indigo-400" />
            <h3 className="text-sm font-black text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
              Recommended Cards
            </h3>
          </div>
          <div className="space-y-2">
            {recommendedIds.map(cardId => {
              const card = getCardById(cardId);
              if (!card) return null;
              const deck = getDeckById(card.deckId);
              if (!deck) return null;
              return (
                <button
                  key={cardId}
                  onClick={() => navigate(`/card/${cardId}`)}
                  className="w-full text-left rounded-xl p-3 flex items-center gap-3 transition-all active:scale-[0.98]"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                    style={{ background: deck.color + '20' }}
                  >
                    {deck.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                        style={{ background: deck.color + '18', color: deck.color }}
                      >
                        {card.code}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-foreground truncate">{card.title}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{card.tagline}</div>
                  </div>
                  <ArrowRight size={14} className="text-muted-foreground shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function HealthChecker() {
  const [, navigate] = useLocation();
  const { isDark } = useTheme();
  const [step, setStep] = useState(0); // 0 = intro, 1..N = questions, N+1 = results
  const [answers, setAnswers] = useState<Answer[]>([]);

  const totalQuestions = ALL_QUESTIONS.length;
  const isIntro = step === 0;
  const isResults = step > totalQuestions;
  const currentQ = isIntro || isResults ? null : ALL_QUESTIONS[step - 1];
  const currentDim = currentQ ? DIMENSIONS.find(d => d.id === currentQ.dimId) : null;

  // Compute scores from answers
  const scores = useMemo<Record<string, number>>(() => {
    const map: Record<string, number[]> = {};
    for (const a of answers) {
      if (!map[a.dimId]) map[a.dimId] = [];
      map[a.dimId].push(a.value);
    }
    const result: Record<string, number> = {};
    for (const d of DIMENSIONS) {
      const vals = map[d.id] ?? [];
      result[d.id] = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    }
    return result;
  }, [answers]);

  function handleAnswer(value: number) {
    if (!currentQ) return;
    setAnswers(prev => {
      const filtered = prev.filter(a => !(a.dimId === currentQ.dimId && a.qIndex === currentQ.qIndex));
      return [...filtered, { dimId: currentQ.dimId, qIndex: currentQ.qIndex, value }];
    });
    setStep(s => s + 1);
  }

  function handleBack() {
    if (step > 0) setStep(s => s - 1);
  }

  function handleReset() {
    setAnswers([]);
    setStep(0);
  }

  const bg = isDark
    ? 'radial-gradient(ellipse at top, rgba(16,185,129,0.06) 0%, #0a1628 60%)'
    : 'radial-gradient(ellipse at top, rgba(16,185,129,0.04) 0%, #f1f5f9 60%)';

  const progress = isIntro ? 0 : isResults ? 100 : Math.round(((step - 1) / totalQuestions) * 100);

  return (
    <div className="min-h-screen pb-32" style={{ background: bg }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3"
        style={{
          background: isDark ? 'rgba(10,22,40,0.92)' : 'rgba(241,245,249,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <button
          onClick={() => step > 0 ? handleBack() : navigate('/')}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
        >
          <ArrowLeft size={16} className="text-foreground" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <Activity size={16} className="text-emerald-400" />
          <h1 className="text-base font-black text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
            Health Checker
          </h1>
        </div>
        {!isIntro && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{
              background: 'rgba(16,185,129,0.12)',
              border: '1px solid rgba(16,185,129,0.25)',
              color: '#34d399',
            }}
          >
            <RotateCcw size={11} />
            Reset
          </button>
        )}
      </div>

      {/* Progress bar */}
      {!isIntro && (
        <div
          className="h-1 w-full"
          style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
        >
          <motion.div
            className="h-full"
            style={{ background: 'linear-gradient(90deg, #10b981, #3b82f6)' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      )}

      <div className="px-4 pt-6 max-w-sm mx-auto">
        <AnimatePresence mode="wait">
          {/* ── INTRO ── */}
          {isIntro && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="text-center"
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(59,130,246,0.15))',
                  border: '1.5px solid rgba(16,185,129,0.3)',
                  boxShadow: '0 8px 32px rgba(16,185,129,0.15)',
                }}
              >
                <Activity size={36} className="text-emerald-400" />
              </div>
              <h2
                className="text-2xl font-black text-foreground mb-3"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Project Health Check
              </h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Answer {totalQuestions} quick questions across {DIMENSIONS.length} dimensions to get a radar chart of your project health and personalised tool recommendations.
              </p>

              {/* Dimension preview */}
              <div className="grid grid-cols-4 gap-2 mb-8">
                {DIMENSIONS.map(d => (
                  <div
                    key={d.id}
                    className="rounded-xl p-2 text-center"
                    style={{ background: d.color + '12', border: `1px solid ${d.color}25` }}
                  >
                    <div className="text-[9px] font-bold" style={{ color: d.color }}>{d.shortLabel}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setStep(1)}
                className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                style={{
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  boxShadow: '0 4px 20px rgba(16,185,129,0.3)',
                }}
              >
                Start Health Check
                <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {/* ── QUESTION ── */}
          {!isIntro && !isResults && currentQ && currentDim && (
            <motion.div
              key={`q-${step}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Dimension badge */}
              <div className="flex items-center justify-between mb-4">
                <div
                  className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: currentDim.color + '18', color: currentDim.color }}
                >
                  {currentDim.label}
                </div>
                <span className="text-xs text-muted-foreground font-semibold">
                  {step} / {totalQuestions}
                </span>
              </div>

              {/* Question card */}
              <div
                className="rounded-2xl p-6 mb-6"
                style={{
                  background: isDark ? 'rgba(15,28,48,0.95)' : 'rgba(255,255,255,0.98)',
                  border: `1.5px solid ${currentDim.color}30`,
                  boxShadow: `0 4px 20px ${currentDim.color}15`,
                }}
              >
                <p
                  className="text-base font-bold text-foreground leading-relaxed text-center"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  "{currentQ.text}"
                </p>
              </div>

              {/* Likert scale */}
              <div className="grid grid-cols-2 gap-3">
                {LIKERT.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    className="py-4 rounded-2xl font-bold text-sm flex flex-col items-center gap-1 transition-all active:scale-95"
                    style={{
                      background:
                        opt.value <= 2
                          ? 'rgba(239,68,68,0.1)'
                          : 'rgba(16,185,129,0.1)',
                      border:
                        opt.value <= 2
                          ? '1.5px solid rgba(239,68,68,0.25)'
                          : '1.5px solid rgba(16,185,129,0.25)',
                      color: opt.value <= 2 ? '#f87171' : '#34d399',
                    }}
                  >
                    <span className="text-base font-black">{opt.short}</span>
                    <span className="text-[9px] opacity-70">{opt.label}</span>
                  </button>
                ))}
              </div>

              {/* Back button */}
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 text-muted-foreground transition-colors"
                  style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}
                >
                  <ChevronLeft size={12} />
                  Back
                </button>
              )}
            </motion.div>
          )}

          {/* ── RESULTS ── */}
          {isResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Recommendations scores={scores} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <PageFooter />
    </div>
  );
}
