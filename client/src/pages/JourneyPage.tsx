// JourneyPage — Duolingo-inspired path map, visually lifted with card framing
// Design: rich warm background, card-contained path, elevated unit banners

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
        <Heart
          key={i}
          size={16}
          className={i < state.hearts ? 'text-rose-500 fill-rose-500' : 'text-stone-300 fill-stone-100'}
        />
      ))}
      {state.hearts === 0 && heartsRefillCountdown && (
        <span className="text-[10px] font-bold text-stone-400 ml-1">{heartsRefillCountdown}</span>
      )}
    </div>
  );
}

// ─── XP / LEVEL BAR ──────────────────────────────────────────────────────────
function XPBar() {
  const { state, level, nextLevel, xpProgressPercent } = useJourney();
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex items-center gap-1">
        <Star size={13} className="text-amber-500 fill-amber-400 shrink-0" />
        <span className="text-[11px] font-bold text-stone-700">{level.title}</span>
      </div>
      {nextLevel && (
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-20 h-1.5 rounded-full bg-stone-200 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-amber-400"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgressPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <span className="text-[10px] text-stone-400 shrink-0">{state.totalXP} XP</span>
        </div>
      )}
      {!nextLevel && (
        <span className="text-[10px] font-bold text-amber-600">MAX</span>
      )}
    </div>
  );
}

// ─── UNIT BANNER ─────────────────────────────────────────────────────────────
const UNIT_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  foundations:  { bg: '#1D4ED8', text: '#ffffff', border: '#1e40af', glow: '#3b82f640' },
  planning:     { bg: '#15803D', text: '#ffffff', border: '#166534', glow: '#22c55e40' },
  people:       { bg: '#C2410C', text: '#ffffff', border: '#9a3412', glow: '#f9731640' },
  execution:    { bg: '#7E22CE', text: '#ffffff', border: '#6b21a8', glow: '#a855f740' },
  techniques:   { bg: '#B45309', text: '#ffffff', border: '#92400e', glow: '#f59e0b40' },
  mastery:      { bg: '#BE123C', text: '#ffffff', border: '#9f1239', glow: '#f4436640' },
};

function UnitBanner({ unitId, title, description, icon, unitNumber }: {
  unitId: string;
  title: string;
  description: string;
  icon: string;
  unitNumber: number;
}) {
  const colors = UNIT_COLORS[unitId] ?? UNIT_COLORS.foundations;
  return (
    <div
      className="rounded-2xl px-5 py-4 flex items-center gap-4 mx-4 my-3 relative overflow-hidden"
      style={{
        backgroundColor: colors.bg,
        border: `1.5px solid ${colors.border}`,
        boxShadow: `0 4px 20px ${colors.glow}, 0 1px 4px rgba(0,0,0,0.15)`,
      }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 60%)',
        }}
      />
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 relative"
        style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
      >
        {icon}
      </div>
      <div className="relative">
        <div className="text-[9px] font-black uppercase tracking-widest opacity-70" style={{ color: colors.text }}>
          Unit {unitNumber}
        </div>
        <div className="text-[15px] font-black leading-tight" style={{ fontFamily: 'Sora, sans-serif', color: colors.text }}>
          {title}
        </div>
        <div className="text-[11px] mt-0.5 opacity-80" style={{ color: colors.text }}>{description}</div>
      </div>
    </div>
  );
}

// ─── DAY NODE ─────────────────────────────────────────────────────────────────
function DayNode({
  lesson,
  position,
}: {
  lesson: typeof JOURNEY_LESSONS[0];
  position: 'left' | 'center' | 'right';
}) {
  const [, navigate] = useLocation();
  const { isDayCompleted, isDayLocked, canStartLesson, state } = useJourney();
  const completed = isDayCompleted(lesson.day);
  const locked = isDayLocked(lesson.day);
  const active = lesson.day === state.highestDayUnlocked && !completed;

  const positionClass =
    position === 'left' ? 'ml-10' : position === 'right' ? 'mr-10 ml-auto' : 'mx-auto';

  const handleTap = () => {
    if (locked) return;
    navigate(`/journey/lesson/${lesson.day}`);
  };

  return (
    <motion.div
      className={`relative ${positionClass} w-fit`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Active glow ring */}
      {active && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ backgroundColor: '#3B82F6', opacity: 0.25 }}
        />
      )}

      <button
        onClick={handleTap}
        disabled={locked}
        className={`relative w-[68px] h-[68px] rounded-full flex flex-col items-center justify-center transition-all duration-200 ${
          locked
            ? 'cursor-not-allowed'
            : 'active:scale-95'
        }`}
        style={{
          backgroundColor: locked
            ? '#e7e5e0'
            : completed
            ? '#10b981'
            : active
            ? '#3b82f6'
            : '#94a3b8',
          boxShadow: locked
            ? 'none'
            : completed
            ? '0 4px 14px rgba(16,185,129,0.45), 0 2px 4px rgba(0,0,0,0.1)'
            : active
            ? '0 4px 16px rgba(59,130,246,0.5), 0 2px 4px rgba(0,0,0,0.1), 0 0 0 4px rgba(59,130,246,0.2)'
            : '0 2px 8px rgba(0,0,0,0.12)',
        }}
      >
        {locked ? (
          <Lock size={20} className="text-stone-400" />
        ) : completed ? (
          <CheckCircle2 size={24} className="text-white fill-white" />
        ) : active ? (
          <PlayCircle size={24} className="text-white" />
        ) : (
          <span className="text-xl">{lesson.icon}</span>
        )}
        <span
          className={`text-[9px] font-bold mt-0.5 ${locked ? 'text-stone-400' : 'text-white'}`}
        >
          Day {lesson.day}
        </span>
      </button>

      {/* Tooltip label */}
      {!locked && (
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-[9px] font-semibold text-stone-500 text-center block max-w-[80px] truncate">
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
      className="mx-4 mb-3 rounded-2xl p-4"
      style={{ backgroundColor: '#FFF1F2', border: '1.5px solid #FECDD3' }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
          <Heart size={18} className="text-rose-500 fill-rose-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-rose-700">Out of hearts!</p>
          <p className="text-[11px] text-rose-600 mt-0.5">
            Hearts refill in <strong>{heartsRefillCountdown}</strong>, or study 5 topics to earn one back.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-rose-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-rose-400 transition-all duration-500"
                style={{ width: `${(topicsStudiedForHeart / TOPICS_TO_EARN_HEART) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-rose-500">
              {topicsStudiedForHeart}/{TOPICS_TO_EARN_HEART}
            </span>
          </div>
          <button
            onClick={() => navigate('/journey/earn-heart')}
            className="mt-2 text-[11px] font-bold text-rose-600 underline underline-offset-2"
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

  return (
    <div className="grid grid-cols-3 gap-2 mx-4 mb-4">
      {[
        { icon: Flame, value: state.currentStreak, label: 'Day streak', color: '#F97316', bg: 'white', shadow: '0 2px 8px rgba(249,115,22,0.15)' },
        { icon: Zap, value: state.totalXP, label: 'Total XP', color: '#EAB308', bg: 'white', shadow: '0 2px 8px rgba(234,179,8,0.15)' },
        { icon: BookOpen, value: `${completedCount}/${totalDays}`, label: 'Days done', color: '#3B82F6', bg: 'white', shadow: '0 2px 8px rgba(59,130,246,0.15)' },
      ].map(({ icon: Icon, value, label, color, bg, shadow }) => (
        <div
          key={label}
          className="rounded-2xl p-3 text-center"
          style={{ backgroundColor: bg, boxShadow: shadow + ', 0 0 0 1px rgba(0,0,0,0.04)' }}
        >
          <Icon size={16} className="mx-auto mb-1" style={{ color }} />
          <div className="text-base font-black" style={{ color, fontFamily: 'Sora, sans-serif' }}>{value}</div>
          <div className="text-[9px] font-semibold text-stone-500">{label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── UNIT PATH CARD ───────────────────────────────────────────────────────────
// Wraps each unit's day nodes in a card-like container for visual lift
function UnitPathCard({ children, unitId }: { children: React.ReactNode; unitId: string }) {
  const colors = UNIT_COLORS[unitId] ?? UNIT_COLORS.foundations;
  return (
    <div
      className="mx-4 rounded-2xl overflow-hidden"
      style={{
        backgroundColor: 'white',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.04)',
      }}
    >
      {/* Top accent line */}
      <div className="h-1 w-full" style={{ backgroundColor: colors.bg }} />
      <div className="py-4">
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
    <div className="min-h-screen pt-12 pb-28">
      {/* Header */}
      <div
        className="sticky top-12 z-40 px-4"
        style={{
          background: 'rgba(252,251,249,0.96)',
          backdropFilter: 'blur(20px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
          borderBottom: '1.5px solid rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex items-center justify-between py-3">
          <button
            onClick={() => navigate('/')}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft size={18} className="text-stone-600" />
          </button>
          <h1
            className="text-base font-black text-stone-900"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            PM Journey
          </h1>
          <HeartsBar />
        </div>
        <div className="pb-2">
          <XPBar />
        </div>
      </div>

      {/* Stats */}
      <div className="pt-4">
        <StatsStrip />
      </div>

      {/* Personalised tip banner */}
      <AnimatePresence>
        {profile && showTip && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mx-4 mt-1 mb-3 rounded-2xl p-4 relative"
            style={{ background: 'linear-gradient(135deg, #7c3aed12, #2563eb08)', border: '1.5px solid #7c3aed30' }}
          >
            <button
              onClick={() => setShowTip(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Dismiss"
            >
              <X size={12} className="text-stone-400" />
            </button>
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0">✨</span>
              <div className="pr-4">
                <p className="text-[11px] font-bold text-violet-700 mb-1">Your personalised path</p>
                <p className="text-[11px] text-stone-600 leading-relaxed">{getPersonalisedTip(profile)}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No hearts banner */}
      <NoHeartsBanner />

      {/* Journey Map — each unit is a card */}
      <div className="space-y-4 pb-4">
        {unitGroups.map(({ unit, lessons }, unitIndex) => (
          <div key={unit.id}>
            {/* Unit Banner */}
            <UnitBanner
              unitId={unit.id}
              title={unit.title}
              description={unit.description}
              icon={unit.icon}
              unitNumber={unitIndex + 1}
            />

            {/* Day nodes in card container */}
            <UnitPathCard unitId={unit.id}>
              <div className="relative space-y-8 py-2">
                {/* Connector line */}
                <div
                  className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
                  style={{ backgroundColor: '#E7E5E0', zIndex: 0 }}
                />

                {lessons.map((lesson, i) => {
                  const posIndex = (unitIndex * 5 + i) % NODE_POSITIONS.length;
                  return (
                    <div key={lesson.id} className="relative z-10">
                      <DayNode
                        lesson={lesson}
                        position={NODE_POSITIONS[posIndex]}
                      />
                    </div>
                  );
                })}
              </div>
            </UnitPathCard>
          </div>
        ))}

        {/* Journey complete trophy */}
        <div
          className="mx-4 mt-2 rounded-2xl p-5 text-center"
          style={{
            background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
            border: '1.5px solid #FDE68A',
            boxShadow: '0 4px 16px rgba(234,179,8,0.2), 0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Trophy size={32} className="mx-auto text-amber-500 mb-2" />
          </motion.div>
          <p className="text-sm font-black text-amber-800" style={{ fontFamily: 'Sora, sans-serif' }}>
            PM Master Awaits
          </p>
          <p className="text-[11px] text-amber-600 mt-1">
            Complete all 35 days to earn the PM Master title
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
