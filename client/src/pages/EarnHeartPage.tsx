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
  Sparkles,
} from 'lucide-react';
import { useJourney, TOPICS_TO_EARN_HEART, MAX_HEARTS } from '@/contexts/JourneyContext';
import { CARDS, DECKS, getDeckById } from '@/lib/pmoData';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { isDark } = useTheme();
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
      style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        className="w-full max-w-lg rounded-t-3xl overflow-hidden"
        style={{ backgroundColor: isDark ? '#0f1c30' : '#ffffff', maxHeight: '88vh', overflowY: 'auto', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.1)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Card header — dark navy with accent colour strip */}
        <div
          className="px-5 pt-5 pb-4 relative"
          style={{
            background: isDark ? `linear-gradient(135deg, rgba(15,28,48,0.95), rgba(15,28,48,0.85))` : `linear-gradient(135deg, ${(deck?.color ?? '#4f46e5')}12, ${(deck?.color ?? '#4f46e5')}08)`,
            borderBottom: `2px solid ${deck?.color ?? '#4f46e5'}40`,
          }}
        >
          {/* Colour accent left bar */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-tl-3xl"
            style={{ backgroundColor: deck?.color ?? '#4f46e5' }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <X size={14} className="text-foreground" />
          </button>
          <div
            className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md inline-block mb-2"
            style={{ backgroundColor: (deck?.color ?? '#888') + '20', color: deck?.color ?? '#94a3b8', border: `1px solid ${deck?.color ?? '#888'}30` }}
          >
            {card.code}
          </div>
          <h3
            className="text-lg font-black leading-tight text-white"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            {card.title}
          </h3>
          <p className="text-[11px] mt-1 text-muted-foreground">
            {card.tagline}
          </p>
          {/* Deck label */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: deck?.color ?? '#888' }} />
            <span className="text-[9px] font-semibold text-muted-foreground">{deck?.title}</span>
          </div>
        </div>

        {/* Card body */}
        <div className="px-5 py-4 space-y-4">
          {card.whatItIs && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">What It Is</p>
              <p className="text-sm text-foreground leading-relaxed">{card.whatItIs}</p>
            </div>
          )}
          {card.whenToUse && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">When to Use</p>
              <p className="text-sm text-foreground leading-relaxed">{card.whenToUse}</p>
            </div>
          )}
          {card.steps && card.steps.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Key Steps</p>
              <ol className="space-y-2">
                {card.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span
                      className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white mt-0.5"
                      style={{ backgroundColor: deck?.color ?? '#4f46e5' }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm text-foreground leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {card.proTip && (
            <div
              className="rounded-xl p-3.5"
              style={{
                background: `${deck?.color ?? '#4f46e5'}10`,
                border: `1px solid ${deck?.color ?? '#4f46e5'}25`,
              }}
            >
              <p className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: deck?.color ?? '#818cf8' }}>
                Pro Tip
              </p>
              <p className="text-[12px] text-foreground leading-relaxed">{card.proTip}</p>
            </div>
          )}
        </div>

        {/* Mark as studied button */}
        <div className="px-5 pb-8 pt-2">
          {confirmed || alreadyStudied ? (
            <div
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
              style={{ background: 'rgba(16,185,129,0.12)', border: '1.5px solid rgba(16,185,129,0.3)' }}
            >
              <CheckCircle2 size={18} className="text-emerald-400" />
              <span className="text-sm font-bold text-emerald-400">Studied!</span>
            </div>
          ) : (
            <button
              onClick={handleMarkStudied}
              className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 active:scale-95 transition-all"
              style={{
                background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
              }}
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
  const { isDark } = useTheme();
  const { state, studyTopicForHeart, topicsStudiedForHeart } = useJourney();
  const [selectedCard, setSelectedCard] = useState<typeof CARDS[0] | null>(null);

  const studyCards = useMemo(() => {
    const studied = new Set(state.earnHeartProgress.topicsStudied);
    const unstudied = CARDS.filter(c => !studied.has(c.id));
    const shuffled = [...unstudied].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 15);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const studiedInSession = state.earnHeartProgress.topicsStudied;
  const progressInBatch = topicsStudiedForHeart;
  const currentHearts = state.hearts;
  const isComplete = progressInBatch >= TOPICS_TO_EARN_HEART;

  const handleStudied = (cardId: string) => {
    studyTopicForHeart(cardId);
  };

  return (
    <div className="min-h-screen pt-11 pb-24" style={{ background: isDark ? '#0a1628' : '#f1f5f9' }}>
      {/* Header — dark navy, rose accent */}
      <div
          className="sticky top-11 z-40 px-4 py-3"
        style={{
          background: isDark ? 'rgba(10,22,40,0.97)' : 'rgba(241,245,249,0.97)',
          backdropFilter: 'blur(24px) saturate(1.6)',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/journey')}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={18} className="text-foreground" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <Heart size={13} className="text-rose-400 fill-rose-400" />
              <h1 className="text-base font-black text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
                Earn a Heart
              </h1>
            </div>
            <p className="text-[10px] text-muted-foreground">Study {TOPICS_TO_EARN_HEART} topics to earn 1 heart</p>
          </div>
          {/* Current hearts */}
          <div className="flex items-center gap-1">
            {Array.from({ length: MAX_HEARTS }).map((_, i) => (
              <Heart
                key={i}
                size={16}
                className={i < currentHearts ? 'text-rose-400 fill-rose-400' : isDark ? 'text-slate-600 fill-slate-700' : 'text-slate-300 fill-slate-200'}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-5">
        {/* Progress toward next heart */}
        <div
          className="rounded-2xl p-4 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(220,38,38,0.1), rgba(190,18,60,0.06))',
            border: '1.5px solid rgba(220,38,38,0.2)',
            boxShadow: '0 4px 20px rgba(220,38,38,0.08)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-foreground">Progress to next heart</p>
            <span
              className="text-sm font-black px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(220,38,38,0.15)', color: '#f87171', border: '1px solid rgba(220,38,38,0.25)' }}
            >
              {progressInBatch} / {TOPICS_TO_EARN_HEART}
            </span>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: TOPICS_TO_EARN_HEART }).map((_, i) => (
              <motion.div
                key={i}
                className="flex-1 h-3 rounded-full overflow-hidden"
                style={{ background: 'rgba(220,38,38,0.15)' }}
                animate={i < progressInBatch ? { scale: [1, 1.06, 1] } : {}}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #f43f5e, #fb7185)' }}
                  initial={{ width: 0 }}
                  animate={{ width: i < progressInBatch ? '100%' : '0%' }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                />
              </motion.div>
            ))}
          </div>
          {progressInBatch === 0 && (
            <p className="text-[11px] text-muted-foreground mt-2">
              Open any card below and tap "Mark as Studied" to count it.
            </p>
          )}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center gap-2 p-3 rounded-xl"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}
            >
              <Heart size={16} className="text-rose-400 fill-rose-400 shrink-0" />
              <p className="text-[11px] font-bold text-emerald-400">
                Heart earned! Keep studying to earn more.
              </p>
            </motion.div>
          )}
        </div>

        {/* Topics to study */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={12} className="text-violet-400" />
            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              Topics to Study
            </p>
          </div>
          <div className="space-y-2.5">
            {studyCards.map((card, i) => {
              const deck = getDeckById(card.deckId);
              const isStudied = studiedInSession.includes(card.id);
              return (
                <motion.button
                  key={card.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.035 }}
                  onClick={() => setSelectedCard(card)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left rounded-2xl p-3.5 flex items-center gap-3 transition-all"
                  style={{
                    background: isStudied
                      ? 'rgba(16,185,129,0.06)'
                      : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                    border: isStudied
                      ? '1px solid rgba(16,185,129,0.2)'
                      : isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.08)',
                    opacity: isStudied ? 0.75 : 1,
                  }}
                >
                  {/* Deck colour bar */}
                  <div
                    className="w-1.5 h-10 rounded-full shrink-0"
                    style={{ backgroundColor: deck?.color ?? '#888' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-md"
                        style={{ backgroundColor: (deck?.color ?? '#888') + '18', color: deck?.color ?? '#94a3b8', border: `1px solid ${deck?.color ?? '#888'}25` }}
                      >
                        {card.code}
                      </span>
                      <span className="text-[9px] text-muted-foreground">{deck?.title}</span>
                    </div>
                    <p className="text-sm font-bold text-foreground truncate" style={{ fontFamily: 'Sora, sans-serif' }}>
                      {card.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">{card.tagline}</p>
                  </div>
                  {isStudied ? (
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Back to journey */}
        <button
          onClick={() => navigate('/journey')}
          className="w-full py-3 rounded-2xl font-semibold text-foreground text-sm transition-all active:scale-95"
          style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)' }}
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
