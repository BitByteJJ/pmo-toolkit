// SprintMode — full-screen focused card flipper for workshops and self-study
// Swipe left/right or use arrow buttons to move between cards
// Tap card to flip and see the back (What it is + Pro Tip)

import { useState, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Bookmark, BookmarkCheck, Zap, RotateCcw } from 'lucide-react';
import { getDeckById, getCardsByDeck } from '@/lib/pmoData';
import { getCardIllustration } from '@/lib/toolImages';
import { useBookmarks } from '@/contexts/BookmarksContext';
import { useCardProgress } from '@/hooks/useCardProgress';
import { useLocation } from 'wouter';

interface SprintModeProps {
  deckId: string;
  startIndex?: number;
  onClose: () => void;
}

export default function SprintMode({ deckId, startIndex = 0, onClose }: SprintModeProps) {
  const deck = getDeckById(deckId);
  const cards = getCardsByDeck(deckId);
  const [index, setIndex] = useState(startIndex);
  const [flipped, setFlipped] = useState(false);
  const [direction, setDirection] = useState(0); // -1 prev, 1 next
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { markRead, isRead, deckReadCount } = useCardProgress();
  const [, navigate] = useLocation();

  const card = cards[index];
  const bookmarked = card ? isBookmarked(card.id) : false;
  const readCount = deckReadCount(cards.map(c => c.id));

  const goNext = useCallback(() => {
    if (!card) return;
    markRead(card.id);
    if (index < cards.length - 1) {
      setDirection(1);
      setFlipped(false);
      setTimeout(() => setIndex(i => i + 1), 50);
    }
  }, [index, cards.length, card, markRead]);

  const goPrev = useCallback(() => {
    if (index > 0) {
      setDirection(-1);
      setFlipped(false);
      setTimeout(() => setIndex(i => i - 1), 50);
    }
  }, [index]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -70) goNext();
    else if (info.offset.x > 70) goPrev();
  }

  if (!deck || !card) return null;

  const progress = ((index + 1) / cards.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex flex-col"
      style={{ background: deck.bgColor }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={onClose}
          className="p-2 rounded-xl transition-all hover:bg-black/10 active:scale-90"
        >
          <X size={18} style={{ color: deck.textColor }} />
        </button>
        <div className="text-center">
          <div className="text-[11px] font-black uppercase tracking-widest" style={{ color: deck.color }}>
            Sprint Mode
          </div>
          <div className="text-[10px] font-semibold" style={{ color: deck.textColor, opacity: 0.5 }}>
            {deck.title}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold" style={{ color: deck.color }}>
            {readCount}/{cards.length}
          </span>
          <Zap size={11} style={{ color: deck.color }} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 mb-4">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: deck.color + '25' }}>
          <motion.div
            className="h-full rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
            style={{ backgroundColor: deck.color }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] font-medium" style={{ color: deck.textColor, opacity: 0.4 }}>
            {index + 1} of {cards.length}
          </span>
          <span className="text-[9px] font-bold" style={{ color: deck.color }}>
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Card area */}
      <div className="flex-1 flex items-center justify-center px-4 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={card.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 80, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction * -80, scale: 0.94 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            onClick={() => setFlipped(f => !f)}
            className="w-full max-w-sm cursor-pointer select-none"
            style={{ touchAction: 'pan-y' }}
          >
            {/* Card shell — fixed height so front/back occupy the same space */}
            <div
              className="relative w-full rounded-3xl overflow-hidden"
              style={{
                minHeight: '420px',
                boxShadow: `0 20px 60px ${deck.color}30, 0 8px 24px rgba(0,0,0,0.12)`,
                border: `2px solid ${deck.color}30`,
              }}
            >
              {/* ── FRONT FACE ── */}
              <AnimatePresence mode="wait">
                {!flipped && (
                  <motion.div
                    key="front"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.22 }}
                    className="absolute inset-0 flex flex-col p-6 bg-white"
                  >
                    {/* Colour top bar */}
                    <div className="absolute top-0 left-0 right-0 h-2 rounded-t-3xl" style={{ backgroundColor: deck.color }} />

                    <div className="flex items-start justify-between mt-3 mb-4">
                      <span
                        className="text-[10px] font-mono font-bold px-2 py-1 rounded-lg"
                        style={{ backgroundColor: deck.bgColor, color: deck.color }}
                      >
                        {card.code}
                      </span>
                      {isRead(card.id) && (
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Read ✓
                        </span>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center">
                      <h2
                        className="text-2xl font-black leading-tight mb-2 text-center"
                        style={{ fontFamily: 'Sora, sans-serif', color: '#1a1a1a', letterSpacing: '-0.02em' }}
                      >
                        {card.title}
                      </h2>
                      <p className="text-sm text-stone-500 leading-relaxed text-center mb-4">{card.tagline}</p>

                      {/* Card illustration */}
                      {getCardIllustration(card.id) && (
                        <div className="relative w-36 h-36 mx-auto">
                          <div
                            className="absolute inset-0 rounded-full"
                            style={{ backgroundColor: deck.bgColor }}
                          />
                          <img
                            src={getCardIllustration(card.id)!}
                            alt={card.title}
                            className="relative w-full h-full object-contain"
                            style={{ opacity: 0.7, mixBlendMode: 'multiply' }}
                          />
                          {/* Fade edges */}
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: 'radial-gradient(circle, transparent 55%, white 90%)',
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Tap hint */}
                    <div className="flex items-center justify-center gap-1.5 mt-4">
                      <RotateCcw size={11} style={{ color: deck.color, opacity: 0.5 }} />
                      <span className="text-[10px] font-medium" style={{ color: deck.color, opacity: 0.6 }}>
                        tap to reveal
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── BACK FACE ── */}
              <AnimatePresence mode="wait">
                {flipped && (
                  <motion.div
                    key="back"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.22 }}
                    className="absolute inset-0 flex flex-col p-6"
                    style={{ backgroundColor: deck.bgColor }}
                  >
                    {/* Colour top bar */}
                    <div className="absolute top-0 left-0 right-0 h-2 rounded-t-3xl" style={{ backgroundColor: deck.color }} />

                    <div className="flex items-center justify-between mt-3 mb-3">
                      <span
                        className="text-[10px] font-mono font-bold px-2 py-1 rounded-lg"
                        style={{ backgroundColor: deck.color + '20', color: deck.color }}
                      >
                        {card.code} · {card.type}
                      </span>
                      {/* Flip back hint */}
                      <div className="flex items-center gap-1" style={{ color: deck.color, opacity: 0.5 }}>
                        <RotateCcw size={10} />
                        <span className="text-[9px] font-medium">tap to flip</span>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3">
                      {card.whatItIs && (
                        <div>
                          <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: deck.color }}>
                            What it is
                          </div>
                          <p className="text-[12px] text-stone-700 leading-relaxed">{card.whatItIs}</p>
                        </div>
                      )}
                      {card.proTip && (
                        <div
                          className="rounded-xl p-3"
                          style={{ backgroundColor: deck.color + '12', borderLeft: `2px solid ${deck.color}` }}
                        >
                          <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: deck.color }}>
                            Pro Tip
                          </div>
                          <p className="text-[11px] text-stone-600 leading-relaxed">{card.proTip}</p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/card/${card.id}`); onClose(); }}
                      className="mt-3 w-full py-2.5 rounded-xl text-[11px] font-bold text-white transition-all hover:opacity-90 active:scale-95"
                      style={{ backgroundColor: deck.color }}
                    >
                      Open full card →
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="px-4 pb-8 pt-4 flex items-center justify-between">
        <button
          onClick={goPrev}
          disabled={index === 0}
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 disabled:opacity-30"
          style={{ backgroundColor: deck.color + '20' }}
        >
          <ChevronLeft size={20} style={{ color: deck.color }} />
        </button>

        <button
          onClick={() => toggleBookmark(card.id)}
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 hover:scale-110"
          style={{ backgroundColor: bookmarked ? deck.color : deck.color + '20' }}
        >
          {bookmarked
            ? <BookmarkCheck size={18} className="text-white" />
            : <Bookmark size={18} style={{ color: deck.color }} />
          }
        </button>

        <button
          onClick={goNext}
          disabled={index === cards.length - 1}
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 disabled:opacity-30"
          style={{ backgroundColor: deck.color + '20' }}
        >
          <ChevronRight size={20} style={{ color: deck.color }} />
        </button>
      </div>
    </motion.div>
  );
}
