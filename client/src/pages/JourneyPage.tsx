// JourneyPage — Duolingo-inspired path map, dark-mode first
// Design: deep dark background, card-contained path, elevated unit banners

import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Flame,
  Star,
  Lock,
  CheckCircle2,
  PlayCircle,
  Trophy,
  Zap,
  BookOpen,
  ArrowLeft,
  X,
  Sparkles,
} from 'lucide-react';
import { useJourney, MAX_HEARTS, TOPICS_TO_EARN_HEART } from '@/contexts/JourneyContext';
import { JOURNEY_LESSONS, JOURNEY_UNITS, getLevelForXP, getNextLevel } from '@/lib/journeyData';
import { useState, useEffect } from 'react';
import JourneySetupWizard, { JOURNEY_PROFILE_KEY, getPersonalisedTip, type JourneyProfile } from '@/components/JourneySetupWizard';

// ─── HEARTS DISPLAY ───────────────────────────────────────────────────────────
function HeartsBar() {
  const { state, heartsRefillCountdown } = useJourney();
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: MAX_HEARTS }).map((_, i) => (
        <motion.div
          key={i}
          animate={i === state.hearts - 1 ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.4 }}
        >
          <Heart
            size={17}
            className={i < state.hearts ? 'text-rose-400 fill-rose-400' : 'text-slate-600 fill-slate-700'}
          />
        </motion.div>
      ))}
      {state.hearts === 0 && heartsRefillCountdown && (
        <span className="text-[10px] font-bold text-rose-300 ml-1 bg-rose-500/15 px-1.5 py-0.5 rounded-full">{heartsRefillCountdown}</span>
      )}
    </div>
  );
}

// ─── XP / LEVEL BAR ──────────────────────────────────────────────────────────
function XPBar() {
  const { state, level, nextLevel, xpProgressPercent } = useJourney();
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div
        className="flex items-center gap-1.5 px-2 py-0.5 rounded-full"
        style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.2)' }}
      >
        <Star size={11} className="text-amber-400 fill-amber-400 shrink-0" />
        <span className="text-[10px] font-bold text-amber-300">{level.title}</span>
      </div>
      {nextLevel && (
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }}
              initial={{ width: 0 }}
              animate={{ width: `${xpProgressPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <span className="text-[10px] text-slate-300 shrink-0 font-semibold">{state.totalXP} XP</span>
        </div>
      )}
      {!nextLevel && (
        <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">MAX LEVEL</span>
      )}
    </div>
  );
}

// ─── UNIT BANNER ─────────────────────────────────────────────────────────────
const UNIT_COLORS: Record<string, { bg: string; accent: string; glow: string; illustration?: string }> = {
  foundations:  { bg: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)', accent: '#60a5fa', glow: '#3b82f640', illustration: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/rOjEbQiDtukRSnet.png' },
  planning:     { bg: 'linear-gradient(135deg, #14532d 0%, #15803d 100%)', accent: '#4ade80', glow: '#22c55e40', illustration: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/fEZPPadAzXObENLK.png' },
  people:       { bg: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 100%)', accent: '#fb923c', glow: '#f9731640', illustration: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/zcdgtcTFqFCMoYIx.png' },
  process:      { bg: 'linear-gradient(135deg, #14532d 0%, #15803d 100%)', accent: '#4ade80', glow: '#22c55e40', illustration: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/fEZPPadAzXObENLK.png' },
  tools:        { bg: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%)', accent: '#38bdf8', glow: '#38bdf840', illustration: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/bPrcpHnbGHoOuJTN.png' },
  execution:    { bg: 'linear-gradient(135deg, #4c1d95 0%, #7e22ce 100%)', accent: '#c084fc', glow: '#a855f740', illustration: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/sDrgfSuxIpnenvQq.png' },
  techniques:   { bg: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)', accent: '#94a3b8', glow: '#64748b40', illustration: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/sDrgfSuxIpnenvQq.png' },
  mastery:      { bg: 'linear-gradient(135deg, #3b0764 0%, #7c3aed 100%)', accent: '#a78bfa', glow: '#8b5cf640', illustration: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/eZTKJXYdmRUtjOiv.png' },
  pmbok8:       { bg: 'linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 100%)', accent: '#7dd3fc', glow: '#38bdf840', illustration: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/NOWpfCiNuAJFXvlX.png' },
};

function UnitBanner({ unitId, title, description, icon, unitNumber, lessonCount, completedCount }: {
  unitId: string;
  title: string;
  description: string;
  icon: string;
  unitNumber: number;
  lessonCount: number;
  completedCount: number;
}) {
  const colors = UNIT_COLORS[unitId] ?? UNIT_COLORS.foundations;
  const pct = lessonCount > 0 ? Math.round((completedCount / lessonCount) * 100) : 0;
  const isComplete = completedCount === lessonCount;

  return (
    <div
      className="rounded-2xl mx-4 my-3 relative overflow-hidden"
      style={{
        background: colors.bg,
        boxShadow: `0 8px 32px ${colors.glow}, 0 2px 8px rgba(0,0,0,0.4)`,
        minHeight: '110px',
      }}
    >
      {/* Illustration background */}
      {colors.illustration && (
        <>
          <img
            src={colors.illustration}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: 'center right', opacity: 0.18 }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.25) 60%, transparent 100%)' }}
          />
        </>
      )}

      {/* Completion badge */}
      {isComplete && (
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold text-white"
          style={{ background: 'rgba(16,185,129,0.85)', backdropFilter: 'blur(4px)' }}
        >
          <CheckCircle2 size={9} />
          Complete
        </div>
      )}

      {/* Content */}
      <div className="relative flex items-center gap-4 px-5 py-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[9px] font-black uppercase tracking-widest text-white/60 mb-0.5">
            Unit {unitNumber}
          </div>
          <div className="text-[16px] font-black leading-tight text-white mb-0.5" style={{ fontFamily: 'Sora, sans-serif' }}>
            {title}
          </div>
          <div className="text-[11px] text-white/75 mb-2">{description}</div>
          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: colors.accent }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            </div>
            <span className="text-[9px] font-bold text-white/70 shrink-0">{completedCount}/{lessonCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DAY NODE ─────────────────────────────────────────────────────────────────
function DayNode({
  lesson,
  position,
  unitAccent,
}: {
  lesson: typeof JOURNEY_LESSONS[0];
  position: 'left' | 'center' | 'right';
  unitAccent: string;
}) {
  const [, navigate] = useLocation();
  const { isDayCompleted, isDayLocked, state } = useJourney();
  const completed = isDayCompleted(lesson.day);
  const locked = isDayLocked(lesson.day);
  const active = lesson.day === state.highestDayUnlocked && !completed;

  const positionClass =
    position === 'left' ? 'ml-8' : position === 'right' ? 'mr-8 ml-auto' : 'mx-auto';

  const handleTap = () => {
    if (locked) return;
    navigate(`/journey/lesson/${lesson.day}`);
  };

  return (
    <motion.div
      className={`relative ${positionClass} w-fit`}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, type: 'spring', stiffness: 280, damping: 22 }}
    >
      {/* Active pulse ring */}
      {active && (
        <motion.div
          className="absolute -inset-2 rounded-full"
          animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.15, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ backgroundColor: unitAccent }}
        />
      )}

      <button
        onClick={handleTap}
        disabled={locked}
        className={`relative w-[72px] h-[72px] rounded-full flex flex-col items-center justify-center transition-all duration-200 ${
          locked ? 'cursor-not-allowed' : 'active:scale-90 hover:scale-105'
        }`}
        style={{
          background: locked
            ? 'rgba(30,40,60,0.8)'
            : completed
            ? `linear-gradient(135deg, #059669, #10b981)`
            : active
            ? `linear-gradient(135deg, ${unitAccent}cc, ${unitAccent})`
            : 'rgba(30,45,70,0.9)',
          border: locked
            ? '2px solid rgba(255,255,255,0.06)'
            : completed
            ? '2px solid rgba(16,185,129,0.5)'
            : active
            ? `2px solid ${unitAccent}`
            : '2px solid rgba(255,255,255,0.12)',
          boxShadow: locked
            ? 'none'
            : completed
            ? '0 4px 20px rgba(16,185,129,0.4), 0 2px 6px rgba(0,0,0,0.4)'
            : active
            ? `0 4px 24px ${unitAccent}60, 0 2px 8px rgba(0,0,0,0.4), 0 0 0 4px ${unitAccent}20`
            : '0 2px 10px rgba(0,0,0,0.35)',
        }}
      >
        {locked ? (
          <Lock size={18} className="text-slate-500" />
        ) : completed ? (
          <CheckCircle2 size={26} className="text-white" strokeWidth={2.5} />
        ) : active ? (
          <PlayCircle size={26} className="text-white" strokeWidth={2} />
        ) : (
          <span className="text-[22px] leading-none">{lesson.icon}</span>
        )}
        <span
          className="text-[8px] font-bold mt-0.5"
          style={{ color: locked ? '#475569' : 'rgba(255,255,255,0.85)' }}
        >
          Day {lesson.day}
        </span>
      </button>

      {/* Label below node */}
      {!locked && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span
            className="text-[8px] font-semibold text-center block max-w-[84px] truncate"
            style={{ color: completed ? '#34d399' : active ? unitAccent : '#94a3b8' }}
          >
            {lesson.title}
          </span>
        </div>
      )}
    </motion.div>
  );
}

// ─── NO HEARTS BANNER ────────────────────────────────────────────────────────
function NoHeartsBanner() {
  const [, navigate] = useLocation();
  const { state, heartsRefillCountdown, topicsStudiedForHeart } = useJourney();
  if (state.hearts > 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 mb-3 rounded-2xl p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(220,38,38,0.12), rgba(190,18,60,0.08))',
        border: '1.5px solid rgba(220,38,38,0.3)',
        boxShadow: '0 4px 20px rgba(220,38,38,0.1)',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(220,38,38,0.2)', border: '1px solid rgba(220,38,38,0.3)' }}
        >
          <Heart size={18} className="text-rose-400 fill-rose-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold text-rose-300 mb-0.5">Out of hearts</p>
          <p className="text-[11px] text-rose-300/80">
            Refills in <strong className="text-rose-200">{heartsRefillCountdown}</strong>, or study topics to earn one back.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(220,38,38,0.2)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #f43f5e, #fb7185)' }}
                animate={{ width: `${(topicsStudiedForHeart / TOPICS_TO_EARN_HEART) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-[10px] font-bold text-rose-400 shrink-0">
              {topicsStudiedForHeart}/{TOPICS_TO_EARN_HEART}
            </span>
          </div>
          <button
            onClick={() => navigate('/journey/earn-heart')}
            className="mt-2 text-[11px] font-bold text-rose-300 underline underline-offset-2 hover:text-rose-200 transition-colors"
          >
            Study topics to earn a heart →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── STATS STRIP ─────────────────────────────────────────────────────────────
function StatsStrip() {
  const { state } = useJourney();
  const completedCount = Object.values(state.completedSessions).filter(s => s.completed).length;
  const totalDays = JOURNEY_LESSONS.length;

  const stats = [
    { icon: Flame, value: state.currentStreak, label: 'Day streak', color: '#f97316', glow: 'rgba(249,115,22,0.25)', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.2)' },
    { icon: Zap, value: state.totalXP, label: 'Total XP', color: '#eab308', glow: 'rgba(234,179,8,0.25)', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.2)' },
    { icon: BookOpen, value: `${completedCount}/${totalDays}`, label: 'Days done', color: '#60a5fa', glow: 'rgba(96,165,250,0.2)', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.18)' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5 mx-4 mb-4">
      {stats.map(({ icon: Icon, value, label, color, glow, bg, border }) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl p-3 text-center relative overflow-hidden"
          style={{
            background: bg,
            border: `1px solid ${border}`,
            boxShadow: `0 4px 16px ${glow}`,
          }}
        >
          <Icon size={18} className="mx-auto mb-1" style={{ color }} />
          <div
            className="text-lg font-black"
            style={{ color, fontFamily: 'Sora, sans-serif', textShadow: `0 0 12px ${color}60` }}
          >
            {value}
          </div>
          <div className="text-[9px] font-semibold text-slate-300">{label}</div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── WINDING ROAD SVG ────────────────────────────────────────────────────────
/**
 * Renders a winding SVG road connecting day nodes.
 * positions: array of 'left' | 'center' | 'right' for each node.
 * nodeCount: how many nodes.
 * accent: unit accent colour.
 */
function WindingRoad({
  positions,
  nodeCount,
  accent,
  completedCount,
}: {
  positions: Array<'left' | 'center' | 'right'>;
  nodeCount: number;
  accent: string;
  completedCount: number;
}) {
  // Layout constants (must match DayNode layout)
  const CARD_WIDTH = 320;   // approximate card inner width in px
  const NODE_SIZE = 72;     // node diameter
  const ROW_HEIGHT = 96;    // space-y-10 = 40px + node 72px ≈ 96px effective row height
  const PAD_TOP = 24;       // py-6 top padding
  const LEFT_X = 52;        // ml-8 = 32px + half node
  const CENTER_X = CARD_WIDTH / 2;
  const RIGHT_X = CARD_WIDTH - 52;

  const xForPos = (pos: 'left' | 'center' | 'right') =>
    pos === 'left' ? LEFT_X : pos === 'right' ? RIGHT_X : CENTER_X;

  // Build waypoints — centre of each node
  const points: { x: number; y: number }[] = positions.slice(0, nodeCount).map((pos, i) => ({
    x: xForPos(pos),
    y: PAD_TOP + NODE_SIZE / 2 + i * ROW_HEIGHT,
  }));

  const totalHeight = PAD_TOP + NODE_SIZE / 2 + (nodeCount - 1) * ROW_HEIGHT + NODE_SIZE / 2 + PAD_TOP;

  if (points.length < 2) return null;

  // Build smooth cubic bezier path through all waypoints
  const buildPath = (pts: { x: number; y: number }[]) => {
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const midY = (p0.y + p1.y) / 2;
      // Control points: pull horizontally toward the midpoint then curve to destination
      const cp1x = p0.x;
      const cp1y = midY;
      const cp2x = p1.x;
      const cp2y = midY;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const pathD = buildPath(points);

  // How far along the path is completed (fraction 0–1)
  const completedFraction = nodeCount > 1 ? Math.min(1, completedCount / (nodeCount - 1)) : 0;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width="100%"
      height={totalHeight}
      viewBox={`0 0 ${CARD_WIDTH} ${totalHeight}`}
      preserveAspectRatio="none"
      style={{ zIndex: 0 }}
    >
      <defs>
        {/* Glow filter */}
        <filter id={`road-glow-${accent.replace('#','')}`} x="-30%" y="-10%" width="160%" height="120%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        {/* Completed gradient */}
        <linearGradient id={`road-done-${accent.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* ── Base road track (thick, dark) ── */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(15,28,48,0.95)"
        strokeWidth="22"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ── Road kerb / edge (unit colour, low opacity) ── */}
      <path
        d={pathD}
        fill="none"
        stroke={accent}
        strokeWidth="22"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.18"
      />

      {/* ── Completed section (bright accent) ── */}
      {completedFraction > 0 && (
        <path
          d={pathD}
          fill="none"
          stroke={`url(#road-done-${accent.replace('#','')})`}
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={`${completedFraction * 2000} 2000`}
          filter={`url(#road-glow-${accent.replace('#','')})`}
          strokeOpacity="0.75"
        />
      )}

      {/* ── Upcoming section (faint dashed road markings) ── */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="8 14"
      />

      {/* ── Centre dashes on completed section (white) ── */}
      {completedFraction > 0 && (
        <path
          d={pathD}
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={`${completedFraction * 2000} 2000`}
          strokeDashoffset="0"
          style={{ mixBlendMode: 'overlay' }}
        />
      )}
    </svg>
  );
}

// ─── UNIT PATH CARD ───────────────────────────────────────────────────────────
function UnitPathCard({ children, unitId }: { children: React.ReactNode; unitId: string }) {
  const colors = UNIT_COLORS[unitId] ?? UNIT_COLORS.foundations;
  return (
    <div
      className="mx-4 rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(10,22,40,0.6)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* Top accent line */}
      <div className="h-0.5 w-full" style={{ background: colors.accent, opacity: 0.5 }} />
      <div className="py-6">
        {children}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const NODE_POSITIONS: Array<'left' | 'center' | 'right'> = [
  'center', 'left', 'right', 'center', 'left',
  'right', 'center', 'left', 'right', 'center',
];

export default function JourneyPage() {
  const [, navigate] = useLocation();
  const [showWizard, setShowWizard] = useState(false);
  const [profile, setProfile] = useState<JourneyProfile | null>(null);
  const [showTip, setShowTip] = useState(false);
  const { isDayCompleted } = useJourney();

  useEffect(() => {
    const saved = localStorage.getItem(JOURNEY_PROFILE_KEY);
    if (saved) {
      try { setProfile(JSON.parse(saved)); } catch {}
    } else {
      const t = setTimeout(() => setShowWizard(true), 400);
      return () => clearTimeout(t);
    }
  }, []);

  function handleWizardComplete(p: JourneyProfile) {
    setProfile(p);
    setShowWizard(false);
    setShowTip(true);
  }

  // Group lessons by unit
  const unitGroups = JOURNEY_UNITS.map(unit => ({
    unit,
    lessons: JOURNEY_LESSONS.filter(
      l => l.day >= unit.dayStart && l.day <= unit.dayEnd
    ),
  }));

  return (
    <>
    {showWizard && <JourneySetupWizard onComplete={handleWizardComplete} />}
    <div className="min-h-screen pt-12 pb-28" style={{ background: '#0a1628' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
      {/* Header */}
      <div
        className="sticky top-12 z-40 px-4"
        style={{
          background: 'rgba(10,22,40,0.96)',
          backdropFilter: 'blur(20px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="flex items-center justify-between py-3">
          <button
            onClick={() => navigate('/')}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={18} className="text-slate-300" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-violet-400" />
            <h1
              className="text-base font-black text-white"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              PM Journey
            </h1>
          </div>
          <HeartsBar />
        </div>
        <div className="pb-2.5">
          <XPBar />
        </div>
      </div>

      {/* Stats */}
      <div className="pt-5">
        <StatsStrip />
      </div>

      {/* Personalised tip banner */}
      <AnimatePresence>
        {profile && showTip && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="mx-4 mt-1 mb-3 rounded-2xl p-4 relative"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.10))',
              border: '1.5px solid rgba(124,58,237,0.3)',
              boxShadow: '0 4px 20px rgba(124,58,237,0.1)',
            }}
          >
            <button
              onClick={() => setShowTip(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Dismiss"
            >
              <X size={12} className="text-slate-400" />
            </button>
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0">✨</span>
              <div className="pr-4">
                <p className="text-[11px] font-bold text-violet-300 mb-1">Your personalised path</p>
                <p className="text-[11px] text-slate-300 leading-relaxed">{getPersonalisedTip(profile)}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No hearts banner */}
      <NoHeartsBanner />

      {/* Journey Map — each unit is a card */}
      <div className="space-y-4 pb-4">
        {unitGroups.map(({ unit, lessons }, unitIndex) => {
          const colors = UNIT_COLORS[unit.id] ?? UNIT_COLORS.foundations;
          const completedCount = lessons.filter(l => isDayCompleted(l.day)).length;

          return (
            <div key={unit.id}>
              {/* Unit Banner */}
              <UnitBanner
                unitId={unit.id}
                title={unit.title}
                description={unit.description}
                icon={unit.icon}
                unitNumber={unitIndex + 1}
                lessonCount={lessons.length}
                completedCount={completedCount}
              />

              {/* Day nodes in card container */}
              <UnitPathCard unitId={unit.id}>
                <div className="relative space-y-10 py-2">
                  {/* Winding road SVG */}
                  <WindingRoad
                    positions={lessons.map((_, i) => NODE_POSITIONS[(unitIndex * 5 + i) % NODE_POSITIONS.length])}
                    nodeCount={lessons.length}
                    accent={colors.accent}
                    completedCount={completedCount}
                  />

                  {lessons.map((lesson, i) => {
                    const posIndex = (unitIndex * 5 + i) % NODE_POSITIONS.length;
                    return (
                      <div key={lesson.id} className="relative z-10">
                        <DayNode
                          lesson={lesson}
                          position={NODE_POSITIONS[posIndex]}
                          unitAccent={colors.accent}
                        />
                      </div>
                    );
                  })}
                </div>
              </UnitPathCard>
            </div>
          );
        })}

        {/* Journey complete trophy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-4 mt-2 rounded-2xl p-6 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(245,158,11,0.06))',
            border: '1.5px solid rgba(251,191,36,0.2)',
            boxShadow: '0 8px 32px rgba(234,179,8,0.12)',
          }}
        >
          {/* Glow effect */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 rounded-full blur-2xl opacity-30"
            style={{ background: '#f59e0b' }}
          />
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <Trophy size={36} className="mx-auto text-amber-400 mb-3" />
          </motion.div>
          <p className="text-base font-black text-amber-300 relative" style={{ fontFamily: 'Sora, sans-serif' }}>
            PM Master Awaits
          </p>
          <p className="text-[11px] text-amber-400/70 mt-1 relative">
            Complete all 35 days to earn the PM Master title
          </p>
        </motion.div>
      </div>
      </div>
    </div>
    </>
  );
}
