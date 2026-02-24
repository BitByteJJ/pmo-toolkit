// ReviewPage — Spaced Repetition Review Queue
// Shows cards due for review today, lets user rate recall quality (Again/Hard/Good/Easy)
// Design: immersive full-screen flip-card flow, dark/light aware

import { useState, useMemo, useCallback } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  ChevronRight,
  Zap,
  Star,
  Trophy,
  Clock,
  BookOpen,
  Flame,
} from 'lucide-react';
import { CARDS, getCardById, getDeckById } from '@/lib/pmoData';
import { useSpacedRepetition, type SRQuality } from '@/hooks/useSpacedRepetition';
import { useTheme } from '@/contexts/ThemeContext';
import PageFooter from '@/components/PageFooter';

// ─── QUALITY BUTTONS ──────────────────────────────────────────────────────────
const QUALITY_OPTIONS: { quality: SRQuality; label: string; sublabel: string; color: string; bg: string; border: string }[] = [
  { quality: 0, label: 'Again', sublabel: '< 1 day', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
  { quality: 1, label: 'Hard', sublabel: '1 day', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  { quality: 2, label: 'Good', sublabel: '3–6 days', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)' },
  { quality: 3, label: 'Easy', sublabel: '1–2 weeks', color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
];

// ─── FLIP CARD ────────────────────────────────────────────────────────────────
function FlipCard({
  cardId,
  onRate,
}: {
  cardId: string;
  onRate: (quality: SRQuality) => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const { isDark } = useTheme();
  const card = getCardById(cardId);
  const deck = card ? getDeckById(card.deckId) : null;

  if (!card || !deck) return null;

  const cardBg = isDark
    ? 'rgba(15,28,48,0.95)'
    : 'rgba(255,255,255,0.98)';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col gap-4">
      {/* Flip card */}
      <div
        className="relative cursor-pointer select-none"
        style={{ perspective: '1000px', minHeight: '280px' }}
        onClick={() => !flipped && setFlipped(true)}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformStyle: 'preserve-3d', position: 'relative', minHeight: '280px' }}
        >
          {/* Front face */}
          <div
            className="absolute inset-0 rounded-3xl p-6 flex flex-col justify-between"
            style={{
              background: cardBg,
              border: `1.5px solid ${cardBorder}`,
              boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.1)',
              backfaceVisibility: 'hidden',
            }}
          >
            {/* Deck badge */}
            <div className="flex items-center justify-between mb-4">
              <div
                className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: deck.color + '22', color: deck.color }}
              >
                <span>{deck.icon}</span>
                <span>{deck.title}</span>
              </div>
              <span
                className="text-xs font-mono font-bold px-2 py-0.5 rounded-md"
                style={{ background: deck.color + '18', color: deck.color }}
              >
                {card.code}
              </span>
            </div>

            {/* Card title — the "question" */}
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-4">
              <h2
                className="text-2xl font-black text-foreground leading-tight"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                {card.title}
              </h2>
              <p className="text-sm text-muted-foreground italic">{card.tagline}</p>
            </div>

            {/* Tap to reveal */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                style={{ background: deck.color + '18', color: deck.color }}
              >
                <BookOpen size={14} />
                Tap to reveal
              </div>
            </div>
          </div>

          {/* Back face */}
          <div
            className="absolute inset-0 rounded-3xl p-6 flex flex-col"
            style={{
              background: cardBg,
              border: `1.5px solid ${cardBorder}`,
              boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.1)',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-md"
                style={{ background: deck.color + '18', color: deck.color }}
              >
                {card.code}
              </span>
              <button
                onClick={e => { e.stopPropagation(); setFlipped(false); }}
                className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <RotateCcw size={12} />
                Flip back
              </button>
            </div>

            <h3
              className="text-lg font-black text-foreground mb-2"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              {card.title}
            </h3>

            <p className="text-sm text-foreground leading-relaxed flex-1 overflow-y-auto">
              {card.whatItIs}
            </p>

            {card.example && (
              <div
                className="mt-3 p-3 rounded-xl text-xs text-muted-foreground"
                style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', borderLeft: `3px solid ${deck.color}` }}
              >
                <span className="font-bold text-foreground">Example: </span>
                {card.example}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quality buttons — only show when flipped */}
      <AnimatePresence>
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-4 gap-2"
          >
            {QUALITY_OPTIONS.map(opt => (
              <button
                key={opt.quality}
                onClick={() => onRate(opt.quality)}
                className="flex flex-col items-center gap-1 py-3 rounded-2xl font-bold text-xs transition-all active:scale-95"
                style={{
                  background: opt.bg,
                  border: `1.5px solid ${opt.border}`,
                  color: opt.color,
                }}
              >
                <span className="text-sm font-black">{opt.label}</span>
                <span className="text-[9px] opacity-70">{opt.sublabel}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint when not flipped */}
      {!flipped && (
        <p className="text-center text-xs text-muted-foreground">
          Try to recall the definition, then tap the card to reveal it
        </p>
      )}
    </div>
  );
}

// ─── COMPLETE SCREEN ──────────────────────────────────────────────────────────
function ReviewCompleteScreen({
  reviewed: reviewedCount,
  onDone,
}: {
  reviewed: number;
  onDone: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 pb-24"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 20, delay: 0.1 }}
        className="w-28 h-28 rounded-full flex items-center justify-center mb-6"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.2), rgba(99,102,241,0.05))',
          border: '2px solid rgba(99,102,241,0.3)',
          boxShadow: '0 0 40px rgba(99,102,241,0.2)',
        }}
      >
        <Trophy size={48} className="text-indigo-400" />
      </motion.div>

      <h2
        className="text-2xl font-black text-foreground text-center mb-2"
        style={{ fontFamily: 'Sora, sans-serif' }}
      >
        Review Complete!
      </h2>
      <p className="text-sm text-muted-foreground text-center mb-8">
        You reviewed {reviewedCount} card{reviewedCount !== 1 ? 's' : ''} today. Your next review is scheduled automatically.
      </p>

      <div
        className="flex items-center gap-3 px-5 py-3 rounded-2xl mb-8"
        style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
      >
        <Brain size={18} className="text-indigo-400" />
        <span className="text-sm text-foreground">Spaced repetition schedules your next review at the optimal time for long-term memory.</span>
      </div>

      <button
        onClick={onDone}
        className="px-8 py-4 rounded-2xl font-bold text-white text-base flex items-center gap-2 active:scale-95 transition-all"
        style={{
          background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
          boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
        }}
      >
        Back to Journey
        <ChevronRight size={18} />
      </button>
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ReviewPage() {
  const [, navigate] = useLocation();
  const { isDark } = useTheme();
  const { getDueCards, getDueCount, recordReview, srState } = useSpacedRepetition();

  // All card IDs that have been scheduled for SR
  const allScheduledIds = useMemo(() => Object.keys(srState), [srState]);
  const dueIds = useMemo(() => getDueCards(allScheduledIds), [getDueCards, allScheduledIds]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [done, setDone] = useState(false);

  const handleRate = useCallback(
    (quality: SRQuality) => {
      const cardId = dueIds[currentIndex];
      if (!cardId) return;
      recordReview(cardId, quality);
      setReviewedCount(c => c + 1);
      if (currentIndex + 1 >= dueIds.length) {
        setDone(true);
      } else {
        setCurrentIndex(i => i + 1);
      }
    },
    [dueIds, currentIndex, recordReview]
  );

  const bg = isDark
    ? 'radial-gradient(ellipse at top, rgba(99,102,241,0.08) 0%, #0a1628 60%)'
    : 'radial-gradient(ellipse at top, rgba(99,102,241,0.05) 0%, #f1f5f9 60%)';

  if (done || dueIds.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: bg }}>
        <div className="pt-16">
          {done ? (
            <ReviewCompleteScreen reviewed={reviewedCount} onDone={() => navigate('/journey')} />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-screen flex flex-col items-center justify-center px-6 pb-24"
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
                style={{
                  background: 'rgba(16,185,129,0.1)',
                  border: '2px solid rgba(16,185,129,0.25)',
                }}
              >
                <CheckCircle2 size={40} className="text-emerald-400" />
              </div>
              <h2
                className="text-2xl font-black text-foreground text-center mb-2"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                All Caught Up!
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-6 max-w-xs">
                No cards are due for review right now. Keep reading cards to build your review queue — cards are automatically scheduled after you read them.
              </p>

              {allScheduledIds.length > 0 && (
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-8"
                  style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
                >
                  <Clock size={16} className="text-emerald-400" />
                  <span className="text-sm text-foreground">
                    {allScheduledIds.length} card{allScheduledIds.length !== 1 ? 's' : ''} scheduled — check back tomorrow
                  </span>
                </div>
              )}

              <button
                onClick={() => navigate('/journey')}
                className="px-8 py-4 rounded-2xl font-bold text-white text-base flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 4px 20px rgba(16,185,129,0.3)' }}
              >
                Back to Journey
                <ChevronRight size={18} />
              </button>
            </motion.div>
          )}
        </div>
        <PageFooter />
      </div>
    );
  }

  const currentCardId = dueIds[currentIndex];
  const progress = Math.round((currentIndex / dueIds.length) * 100);

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
          onClick={() => navigate('/journey')}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
        >
          <ArrowLeft size={16} className="text-foreground" />
        </button>

        {/* Progress bar */}
        <div
          className="flex-1 h-2 rounded-full overflow-hidden"
          style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #6366f1, #3b82f6)' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Brain size={14} className="text-indigo-400" />
          <span className="text-xs font-bold text-foreground">
            {currentIndex + 1} / {dueIds.length}
          </span>
        </div>
      </div>

      {/* Stats strip */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-center gap-4">
        <div className="flex items-center gap-1.5">
          <Flame size={14} className="text-amber-400" />
          <span className="text-xs font-semibold text-muted-foreground">{dueIds.length} due today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap size={14} className="text-indigo-400" />
          <span className="text-xs font-semibold text-muted-foreground">{reviewedCount} reviewed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Star size={14} className="text-emerald-400" />
          <span className="text-xs font-semibold text-muted-foreground">{allScheduledIds.length} total scheduled</span>
        </div>
      </div>

      {/* Card */}
      <div className="px-4 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCardId}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <FlipCard cardId={currentCardId} onRate={handleRate} />
          </motion.div>
        </AnimatePresence>
      </div>

      <PageFooter />
    </div>
  );
}
