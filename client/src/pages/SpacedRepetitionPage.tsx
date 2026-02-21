// StratAlign — Spaced Repetition Review Page
// Shows due cards and records recall quality using SM-2

import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Brain, CheckCircle2, RefreshCw, ExternalLink, Clock } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { CARDS, getDeckById } from '@/lib/pmoData';
import { useSpacedRepetition, RecallQuality } from '@/hooks/useSpacedRepetition';
import { useCardProgress } from '@/hooks/useCardProgress';

const QUALITY_OPTIONS: { quality: RecallQuality; label: string; description: string; color: string; bg: string }[] = [
  { quality: 1, label: 'Forgot it', description: "I had no idea", color: '#E11D48', bg: '#FFF1F2' },
  { quality: 2, label: 'Vague', description: "I sort of remembered", color: '#D97706', bg: '#FEF3C7' },
  { quality: 3, label: 'Got it', description: "I remembered with effort", color: '#0284C7', bg: '#EFF6FF' },
  { quality: 4, label: 'Easy', description: "I remembered it well", color: '#059669', bg: '#ECFDF5' },
  { quality: 5, label: 'Perfect', description: "Instant recall", color: '#7C3AED', bg: '#F5F3FF' },
];

export default function SpacedRepetitionPage() {
  const [, navigate] = useLocation();
  const { readCards } = useCardProgress();
  const { getDueCards, recordReview, getDaysUntilReview } = useSpacedRepetition();

  // Only review cards the user has already read
  const readCardIds = useMemo(() => Array.from(readCards), [readCards]);
  const dueCardIds = useMemo(() => getDueCards(readCardIds), [getDueCards, readCardIds]);

  const [sessionCards] = useState(() => {
    // Shuffle and cap at 20 per session
    const shuffled = [...dueCardIds].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 20);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionResults, setSessionResults] = useState<{ cardId: string; quality: RecallQuality }[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const currentCardId = sessionCards[currentIndex];
  const currentCard = CARDS.find(c => c.id === currentCardId);
  const currentDeck = currentCard ? getDeckById(currentCard.deckId) : null;

  function handleQuality(quality: RecallQuality) {
    if (!currentCardId) return;
    recordReview(currentCardId, quality);
    setSessionResults(prev => [...prev, { cardId: currentCardId, quality }]);
    if (currentIndex + 1 >= sessionCards.length) {
      setIsComplete(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    }
  }

  const avgQuality = sessionResults.length > 0
    ? sessionResults.reduce((sum, r) => sum + r.quality, 0) / sessionResults.length
    : 0;

  // No cards due
  if (readCardIds.length === 0) {
    return (
      <div className="min-h-screen flex flex-col pb-24" style={{ backgroundColor: '#F7F5F0' }}>
        <div className="sticky top-0 z-30 px-4 py-3 flex items-center" style={{ background: 'rgba(247,245,240,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 transition-colors">
            <ChevronLeft size={16} />
            <span className="text-sm font-semibold">Back</span>
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <Brain size={48} className="text-stone-300 mb-4" />
          <h2 className="text-lg font-black text-stone-800 mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>Nothing to review yet</h2>
          <p className="text-sm text-stone-500 mb-6">Read some cards first — they'll appear here for spaced repetition review.</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 rounded-2xl bg-stone-900 text-white font-bold text-sm">Browse cards</button>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (dueCardIds.length === 0) {
    // Show next review schedule
    const nextDue = readCardIds.reduce((min, id) => {
      const days = getDaysUntilReview(id);
      return days < min ? days : min;
    }, Infinity);

    return (
      <div className="min-h-screen flex flex-col pb-24" style={{ backgroundColor: '#F7F5F0' }}>
        <div className="sticky top-0 z-30 px-4 py-3 flex items-center" style={{ background: 'rgba(247,245,240,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 transition-colors">
            <ChevronLeft size={16} />
            <span className="text-sm font-semibold">Back</span>
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <CheckCircle2 size={48} className="text-green-500 mb-4" />
          <h2 className="text-lg font-black text-stone-800 mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>All caught up!</h2>
          <p className="text-sm text-stone-500 mb-2">No cards are due for review right now.</p>
          {nextDue !== Infinity && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-stone-600 text-sm font-semibold mb-6" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <Clock size={13} />
              Next review in {nextDue} day{nextDue !== 1 ? 's' : ''}
            </div>
          )}
          <button onClick={() => navigate('/')} className="px-6 py-3 rounded-2xl bg-stone-900 text-white font-bold text-sm">Back to home</button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-24" style={{ backgroundColor: '#F7F5F0' }}>
      {/* Header */}
      <div className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between" style={{ background: 'rgba(247,245,240,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 transition-colors">
          <ChevronLeft size={16} />
          <span className="text-sm font-semibold">Back</span>
        </button>
        <div className="flex items-center gap-2">
          <Brain size={15} className="text-purple-600" />
          <span className="text-sm font-bold text-stone-800">Review</span>
        </div>
        {!isComplete && (
          <span className="text-xs font-bold text-stone-400">{currentIndex + 1} / {sessionCards.length}</span>
        )}
        {isComplete && <div className="w-12" />}
      </div>

      <div className="flex-1 px-4 py-4 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {!isComplete ? (
            <motion.div
              key={`card-${currentIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Progress bar */}
              <div className="h-1.5 rounded-full overflow-hidden mb-6 mt-1" style={{ backgroundColor: '#e7e5e4' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${((currentIndex) / sessionCards.length) * 100}%`, backgroundColor: '#7C3AED' }}
                />
              </div>

              {/* Card face */}
              {currentCard && currentDeck && (
                <div
                  className="rounded-2xl overflow-hidden mb-4 bg-white"
                  style={{ boxShadow: `0 4px 20px ${currentDeck.color}20, 0 2px 6px rgba(0,0,0,0.08)` }}
                >
                  <div className="h-1.5" style={{ backgroundColor: currentDeck.color }} />
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="text-[10px] font-mono font-bold px-2 py-1 rounded-lg"
                        style={{ backgroundColor: currentDeck.bgColor, color: currentDeck.color }}
                      >
                        {currentCard.code}
                      </span>
                      <button
                        onClick={() => navigate(`/card/${currentCard.id}`)}
                        className="flex items-center gap-1 text-[10px] text-stone-400 hover:text-stone-600 transition-colors"
                      >
                        View card <ExternalLink size={10} />
                      </button>
                    </div>
                    <h2
                      className="text-xl font-black text-stone-900 mb-2"
                      style={{ fontFamily: 'Sora, sans-serif' }}
                    >
                      {currentCard.title}
                    </h2>
                    <p className="text-sm text-stone-500 italic">{currentCard.tagline}</p>
                  </div>

                  {/* Answer reveal */}
                  <AnimatePresence>
                    {showAnswer && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t px-5 py-4"
                        style={{ borderColor: currentDeck.color + '20', backgroundColor: currentDeck.bgColor + '60' }}
                      >
                        <p className="text-xs font-black text-stone-400 uppercase tracking-wider mb-2">What it is</p>
                        <p className="text-sm text-stone-700 leading-relaxed">{currentCard.whatItIs}</p>
                        {currentCard.whenToUse && (
                          <>
                            <p className="text-xs font-black text-stone-400 uppercase tracking-wider mt-3 mb-1">When to use it</p>
                            <p className="text-sm text-stone-600 leading-relaxed">{currentCard.whenToUse}</p>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Action */}
              {!showAnswer ? (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="w-full py-4 rounded-2xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-[0.99]"
                  style={{ background: 'linear-gradient(135deg, #312e81 0%, #7C3AED 100%)' }}
                >
                  Show answer
                </button>
              ) : (
                <div>
                  <p className="text-[11px] font-black text-stone-400 uppercase tracking-wider text-center mb-3">How well did you remember?</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {QUALITY_OPTIONS.map(opt => (
                      <motion.button
                        key={opt.quality}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleQuality(opt.quality)}
                        className="flex flex-col items-center gap-1 px-3 py-3 rounded-2xl text-center transition-all"
                        style={{ backgroundColor: opt.bg, border: `1px solid ${opt.color}25` }}
                      >
                        <span className="text-sm font-black" style={{ color: opt.color }}>{opt.label}</span>
                        <span className="text-[10px] text-stone-500">{opt.description}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            /* Session complete */
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="text-center pt-8"
            >
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-xl font-black text-stone-900 mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                Session complete!
              </h2>
              <p className="text-sm text-stone-500 mb-6">
                You reviewed {sessionCards.length} card{sessionCards.length !== 1 ? 's' : ''}.
                {avgQuality >= 4 ? ' Great recall!' : avgQuality >= 3 ? ' Good work!' : ' Keep practising!'}
              </p>

              {/* Score breakdown */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: 'Remembered', count: sessionResults.filter(r => r.quality >= 3).length, color: '#059669', bg: '#ECFDF5' },
                  { label: 'Struggled', count: sessionResults.filter(r => r.quality < 3).length, color: '#D97706', bg: '#FEF3C7' },
                  { label: 'Avg score', count: avgQuality.toFixed(1), color: '#7C3AED', bg: '#F5F3FF' },
                ].map(stat => (
                  <div key={stat.label} className="rounded-2xl p-3" style={{ backgroundColor: stat.bg }}>
                    <div className="text-xl font-black" style={{ color: stat.color, fontFamily: 'Sora, sans-serif' }}>{stat.count}</div>
                    <div className="text-[10px] font-semibold text-stone-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3.5 rounded-2xl bg-stone-900 text-white font-bold text-sm"
                >
                  Back to home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
