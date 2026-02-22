// PMO Toolkit Navigator — Earn a Heart Page
// Study 5 topics from the card library to earn back one heart

import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  X,
} from 'lucide-react';
import { useJourney, TOPICS_TO_EARN_HEART, MAX_HEARTS } from '@/contexts/JourneyContext';
import { CARDS, DECKS, getDeckById } from '@/lib/pmoData';

// ─── CARD STUDY MODAL ─────────────────────────────────────────────────────────
function CardStudyModal({
  card,
  onClose,
  onStudied,
  alreadyStudied,
}: {
  card: typeof CARDS[0];
  onClose: () => void;
  onStudied: () => void;
  alreadyStudied: boolean;
}) {
  const deck = getDeckById(card.deckId);
  const [confirmed, setConfirmed] = useState(false);

  const handleMarkStudied = () => {
    setConfirmed(true);
    onStudied();
    setTimeout(onClose, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        className="w-full max-w-lg rounded-t-3xl overflow-hidden"
        style={{ backgroundColor: '#fff', maxHeight: '85vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Card header */}
        <div
          className="px-5 pt-5 pb-4 relative"
          style={{ backgroundColor: deck?.bgColor ?? '#F5F3EE' }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/10 flex items-center justify-center"
          >
            <X size={14} className="text-stone-600" />
          </button>
          <div
            className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md inline-block mb-2"
            style={{ backgroundColor: (deck?.color ?? '#888') + '20', color: deck?.textColor ?? '#333' }}
          >
            {card.code}
          </div>
          <h3
            className="text-lg font-black leading-tight"
            style={{ fontFamily: 'Sora, sans-serif', color: deck?.textColor ?? '#1c1917' }}
          >
            {card.title}
          </h3>
          <p className="text-[11px] mt-1" style={{ color: deck?.textColor ?? '#78716c', opacity: 0.7 }}>
            {card.tagline}
          </p>
          {/* Bottom accent */}
          <div className="h-1 w-full mt-4 rounded-full" style={{ backgroundColor: deck?.color }} />
        </div>

        {/* Card body */}
        <div className="px-5 py-4 space-y-4">
          {card.whatItIs && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">What It Is</p>
              <p className="text-sm text-stone-700 leading-relaxed">{card.whatItIs}</p>
            </div>
          )}
          {card.whenToUse && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">When to Use</p>
              <p className="text-sm text-stone-700 leading-relaxed">{card.whenToUse}</p>
            </div>
          )}
          {card.steps && card.steps.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">Key Steps</p>
              <ol className="space-y-1.5">
                {card.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span
                      className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white mt-0.5"
                      style={{ backgroundColor: deck?.color ?? '#888' }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm text-stone-700 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {card.proTip && (
            <div
              className="rounded-xl p-3"
              style={{ backgroundColor: (deck?.color ?? '#888') + '12', border: `1px solid ${deck?.color ?? '#888'}30` }}
            >
              <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: deck?.color }}>
                Pro Tip
              </p>
              <p className="text-[11px] text-stone-700 leading-relaxed">{card.proTip}</p>
            </div>
          )}
        </div>

        {/* Mark as studied button */}
        <div className="px-5 pb-8 pt-2">
          {confirmed || alreadyStudied ? (
            <div className="w-full py-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span className="text-sm font-bold text-emerald-700">Studied!</span>
            </div>
          ) : (
            <button
              onClick={handleMarkStudied}
              className="w-full py-4 rounded-2xl font-bold text-white text-base bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <BookOpen size={18} />
              Mark as Studied
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function EarnHeartPage() {
  const [, navigate] = useLocation();
  const { state, studyTopicForHeart, topicsStudiedForHeart } = useJourney();
  const [selectedCard, setSelectedCard] = useState<typeof CARDS[0] | null>(null);

  // Pick a curated set of cards for study — prioritise cards not yet studied
  const studyCards = useMemo(() => {
    const studied = new Set(state.earnHeartProgress.topicsStudied);
    // First: unstudied cards, shuffled
    const unstudied = CARDS.filter(c => !studied.has(c.id));
    const shuffled = [...unstudied].sort(() => Math.random() - 0.5);
    // Take up to 15 cards to show
    return shuffled.slice(0, 15);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const studiedInSession = state.earnHeartProgress.topicsStudied;
  const progressInBatch = topicsStudiedForHeart; // 0–TOPICS_TO_EARN_HEART
  const heartsEarned = state.earnHeartProgress.heartsEarned;
  const currentHearts = state.hearts;

  const handleStudied = (cardId: string) => {
    studyTopicForHeart(cardId);
  };

  return (
    <div className="min-h-screen pt-11 pb-24" style={{ backgroundColor: '#FFF1F2' }}>
      {/* Header */}
      <div
        className="sticky top-11 z-40 px-4 py-3"
        style={{
          background: 'rgba(255,241,242,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(254,205,211,0.6)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/journey')}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-rose-100 transition-colors"
          >
            <ArrowLeft size={18} className="text-rose-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-black text-rose-800" style={{ fontFamily: 'Sora, sans-serif' }}>
              Earn a Heart
            </h1>
            <p className="text-[10px] text-rose-500">Study {TOPICS_TO_EARN_HEART} topics to earn 1 heart</p>
          </div>
          {/* Current hearts */}
          <div className="flex items-center gap-1">
            {Array.from({ length: MAX_HEARTS }).map((_, i) => (
              <Heart
                key={i}
                size={16}
                className={i < currentHearts ? 'text-rose-500 fill-rose-500' : 'text-stone-300 fill-stone-100'}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-5">
        {/* Progress toward next heart */}
        <div className="rounded-2xl p-4 bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-stone-700">Progress to next heart</p>
            <span className="text-sm font-black text-rose-600">
              {progressInBatch} / {TOPICS_TO_EARN_HEART}
            </span>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: TOPICS_TO_EARN_HEART }).map((_, i) => (
              <motion.div
                key={i}
                className="flex-1 h-3 rounded-full overflow-hidden bg-rose-100"
                animate={i < progressInBatch ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <motion.div
                  className="h-full rounded-full bg-rose-400"
                  initial={{ width: 0 }}
                  animate={{ width: i < progressInBatch ? '100%' : '0%' }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                />
              </motion.div>
            ))}
          </div>
          {progressInBatch === 0 && (
            <p className="text-[11px] text-stone-400 mt-2">
              Open any card below and tap "Mark as Studied" to count it.
            </p>
          )}
          {progressInBatch >= TOPICS_TO_EARN_HEART && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center gap-2 p-2 rounded-xl bg-rose-50 border border-rose-200"
            >
              <Heart size={16} className="text-rose-500 fill-rose-500" />
              <p className="text-[11px] font-bold text-rose-700">
                Heart earned! Keep studying to earn more.
              </p>
            </motion.div>
          )}
        </div>

        {/* Instruction */}
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-stone-400 mb-3">
            Topics to Study
          </p>
          <div className="space-y-2.5">
            {studyCards.map((card, i) => {
              const deck = getDeckById(card.deckId);
              const isStudied = studiedInSession.includes(card.id);
              return (
                <motion.button
                  key={card.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSelectedCard(card)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left rounded-2xl p-3.5 bg-white flex items-center gap-3"
                  style={{
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    opacity: isStudied ? 0.7 : 1,
                  }}
                >
                  {/* Deck colour dot */}
                  <div
                    className="w-2 h-10 rounded-full shrink-0"
                    style={{ backgroundColor: deck?.color ?? '#888' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-md"
                        style={{ backgroundColor: (deck?.color ?? '#888') + '20', color: deck?.textColor ?? '#333' }}
                      >
                        {card.code}
                      </span>
                      <span className="text-[9px] text-stone-400">{deck?.title}</span>
                    </div>
                    <p className="text-sm font-bold text-stone-800 truncate" style={{ fontFamily: 'Sora, sans-serif' }}>
                      {card.title}
                    </p>
                    <p className="text-[10px] text-stone-400 truncate">{card.tagline}</p>
                  </div>
                  {isStudied ? (
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  ) : (
                    <ChevronRight size={16} className="text-stone-300 shrink-0" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Back to journey */}
        <button
          onClick={() => navigate('/journey')}
          className="w-full py-3 rounded-2xl font-semibold text-stone-600 text-sm bg-stone-100 hover:bg-stone-200 active:scale-95 transition-all"
        >
          Back to Journey Map
        </button>
      </div>

      {/* Card study modal */}
      <AnimatePresence>
        {selectedCard && (
          <CardStudyModal
            card={selectedCard}
            onClose={() => setSelectedCard(null)}
            onStudied={() => handleStudied(selectedCard.id)}
            alreadyStudied={studiedInSession.includes(selectedCard.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
