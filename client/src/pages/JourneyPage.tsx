// PMO Toolkit Navigator — Learning Journey Map
// Design: Duolingo-inspired path map with unit banners, day nodes, and progress

import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Flame,
  Star,
  Lock,
  CheckCircle2,
  PlayCircle,
  ChevronRight,
  Trophy,
  Zap,
  BookOpen,
  ArrowLeft,
} from 'lucide-react';
import { useJourney, MAX_HEARTS, TOPICS_TO_EARN_HEART } from '@/contexts/JourneyContext';
import { JOURNEY_LESSONS, JOURNEY_UNITS, getLevelForXP, getNextLevel } from '@/lib/journeyData';

// ─── HEARTS DISPLAY ───────────────────────────────────────────────────────────
function HeartsBar() {
  const { state, heartsRefillCountdown } = useJourney();
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: MAX_HEARTS }).map((_, i) => (
        <Heart
          key={i}
          size={18}
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
        <Star size={14} className="text-amber-500 fill-amber-400 shrink-0" />
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
const UNIT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  foundations:  { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  planning:     { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
  people:       { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
  execution:    { bg: '#FDF4FF', text: '#7E22CE', border: '#E9D5FF' },
  techniques:   { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  mastery:      { bg: '#FFF1F2', text: '#BE123C', border: '#FECDD3' },
};

function UnitBanner({ unitId, title, description, icon }: {
  unitId: string;
  title: string;
  description: string;
  icon: string;
}) {
  const colors = UNIT_COLORS[unitId] ?? UNIT_COLORS.foundations;
  return (
    <div
      className="rounded-2xl px-4 py-3 flex items-center gap-3 mx-4 my-2"
      style={{ backgroundColor: colors.bg, border: `1.5px solid ${colors.border}` }}
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.text }}>
          Unit
        </div>
        <div className="text-sm font-bold text-stone-800" style={{ fontFamily: 'Sora, sans-serif' }}>
          {title}
        </div>
        <div className="text-[10px] text-stone-500 mt-0.5">{description}</div>
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
  const canStart = canStartLesson(lesson.day);

  const positionClass =
    position === 'left' ? 'ml-8' : position === 'right' ? 'mr-8 ml-auto' : 'mx-auto';

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
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ backgroundColor: '#3B82F6', opacity: 0.2 }}
        />
      )}

      <button
        onClick={handleTap}
        disabled={locked}
        className={`relative w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-md transition-all duration-200 ${
          locked
            ? 'bg-stone-200 cursor-not-allowed'
            : completed
            ? 'bg-emerald-500 hover:bg-emerald-600 active:scale-95'
            : active
            ? 'bg-blue-500 hover:bg-blue-600 active:scale-95 ring-4 ring-blue-200'
            : 'bg-stone-300 hover:bg-stone-400 active:scale-95'
        }`}
      >
        {locked ? (
          <Lock size={20} className="text-stone-400" />
        ) : completed ? (
          <CheckCircle2 size={22} className="text-white fill-white" />
        ) : active ? (
          <PlayCircle size={22} className="text-white" />
        ) : (
          <span className="text-lg">{lesson.icon}</span>
        )}
        <span
          className={`text-[9px] font-bold mt-0.5 ${
            locked ? 'text-stone-400' : 'text-white'
          }`}
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
        { icon: Flame, value: state.currentStreak, label: 'Day streak', color: '#F97316', bg: '#FFF7ED' },
        { icon: Zap, value: state.totalXP, label: 'Total XP', color: '#EAB308', bg: '#FEFCE8' },
        { icon: BookOpen, value: `${completedCount}/${totalDays}`, label: 'Days done', color: '#3B82F6', bg: '#EFF6FF' },
      ].map(({ icon: Icon, value, label, color, bg }) => (
        <div key={label} className="rounded-2xl p-3 text-center" style={{ backgroundColor: bg }}>
          <Icon size={16} className="mx-auto mb-1" style={{ color }} />
          <div className="text-base font-black" style={{ color, fontFamily: 'Sora, sans-serif' }}>{value}</div>
          <div className="text-[9px] font-semibold text-stone-500">{label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
// Node layout pattern: zigzag path
const NODE_POSITIONS: Array<'left' | 'center' | 'right'> = [
  'center', 'left', 'right', 'center', 'left',
  'right', 'center', 'left', 'right', 'center',
];

export default function JourneyPage() {
  const [, navigate] = useLocation();

  // Group lessons by unit
  const unitGroups = JOURNEY_UNITS.map(unit => ({
    unit,
    lessons: JOURNEY_LESSONS.filter(
      l => l.day >= unit.dayStart && l.day <= unit.dayEnd
    ),
  }));

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: '#F5F3EE' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-40 px-4 pt-safe"
        style={{
          background: 'rgba(245,243,238,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
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

      {/* No hearts banner */}
      <NoHeartsBanner />

      {/* Journey Map */}
      <div className="space-y-2 pb-4">
        {unitGroups.map(({ unit, lessons }, unitIndex) => (
          <div key={unit.id}>
            {/* Unit Banner */}
            <UnitBanner
              unitId={unit.id}
              title={unit.title}
              description={unit.description}
              icon={unit.icon}
            />

            {/* Day nodes in zigzag */}
            <div className="relative py-4 space-y-8">
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
          </div>
        ))}

        {/* Journey complete trophy */}
        <div className="mx-4 mt-4 rounded-2xl p-4 text-center" style={{ backgroundColor: '#FFFBEB', border: '1.5px solid #FDE68A' }}>
          <Trophy size={28} className="mx-auto text-amber-500 mb-2" />
          <p className="text-sm font-bold text-amber-800" style={{ fontFamily: 'Sora, sans-serif' }}>
            PM Master Awaits
          </p>
          <p className="text-[10px] text-amber-600 mt-1">
            Complete all 30 days to earn the PM Master title
          </p>
        </div>
      </div>
    </div>
  );
}
