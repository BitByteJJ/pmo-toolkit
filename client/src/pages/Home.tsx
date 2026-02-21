// PMO Toolkit Navigator — Home Page
// Design: "Clarity Cards" — Scandinavian Minimalism, warm whites, category color wayfinding
// Fonts: Sora (display) + Inter (body)

import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, Zap, BookOpen, ChevronRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { DECKS, CARDS, getCardsByDeck } from '@/lib/pmoData';
import { useBookmarks } from '@/contexts/BookmarksContext';

const HERO_IMG = 'https://private-us-east-1.manuscdn.com/sessionFile/wGRSygz6Vjmbiu3SMWngYA/sandbox/Bis0r5tEGaWriXBtGv96Rx-img-1_1771651638000_na1fn_cG1vLWhlcm8tYmFubmVy.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvd0dSU3lnejZWam1iaXUzU01XbmdZQS9zYW5kYm94L0JpczByNXRFR2FXcmlYQnRHdjk2UngtaW1nLTFfMTc3MTY1MTYzODAwMF9uYTFmbl9jRzF2TFdobGNtOHRZbUZ1Ym1WeS5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=QPHG77k95miWFomx90vCXezGYLGtrl9vBgMGmj7thOAhKD2Z~o7uz8Ob3O3Kq~pyQQwFcie9xSgd1aqB-A9ir26XperqA3KvJ-ZS-ouyWbvpHA01w8j7pI05XUrXGGhyGf6FhKPFPyfe8pbxA9QHyPvtorvfPAGIfeTfcvFCLS-6DE4GM8P77Ocfxtimz2HR~UZf5KW-s-OLeSVfcH1pPR9sLP9wVwH8EYeg~THgbylRwVa78TuulHHaMZtH48yLm9fsHQs~lA-eLF9F-~0DSZ5Bk3K37LvFk1ruVwfAlYYTfHyHWuQWq3KbvlBdvgKI64dxC-3ArjUkial9R6wq8A__';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function DeckCard({ deck }: { deck: typeof DECKS[0] }) {
  const [, navigate] = useLocation();
  const cards = getCardsByDeck(deck.id);

  return (
    <motion.button
      variants={itemVariants}
      onClick={() => navigate(`/deck/${deck.id}`)}
      className="w-full text-left rounded-2xl p-4 transition-all duration-200 hover:scale-[1.01] active:scale-[0.98]"
      style={{
        backgroundColor: deck.bgColor,
        boxShadow: `0 1px 3px ${deck.color}18, 0 1px 2px ${deck.color}10`,
        borderLeft: `4px solid ${deck.color}`,
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl leading-none shrink-0">{deck.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span
              className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
              style={{ backgroundColor: deck.color + '25', color: deck.textColor }}
            >
              {deck.subtitle}
            </span>
          </div>
          <h3 className="font-semibold text-sm leading-tight" style={{ color: deck.textColor }}>
            {deck.title}
          </h3>
          <p className="text-[11px] mt-0.5 opacity-60 line-clamp-1" style={{ color: deck.textColor }}>
            {deck.description}
          </p>
        </div>
        <div className="flex flex-col items-end gap-0.5 shrink-0">
          <span className="text-xl font-bold leading-none" style={{ color: deck.color }}>
            {cards.length}
          </span>
          <span className="text-[9px] font-medium opacity-50" style={{ color: deck.textColor }}>
            cards
          </span>
          <ChevronRight size={12} style={{ color: deck.color }} className="mt-0.5" />
        </div>
      </div>
    </motion.button>
  );
}

function QuickStats() {
  const { bookmarks } = useBookmarks();
  const stats = [
    { icon: Layers, label: 'Cards', value: CARDS.length, color: '#0284C7', bg: '#EFF6FF' },
    { icon: BookOpen, label: 'Decks', value: DECKS.length, color: '#059669', bg: '#ECFDF5' },
    { icon: Zap, label: 'Saved', value: bookmarks.length, color: '#E11D48', bg: '#FFF1F2' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5">
      {stats.map(({ icon: Icon, label, value, color, bg }) => (
        <div key={label} className="rounded-2xl p-3 text-center" style={{ backgroundColor: bg }}>
          <Icon size={16} className="mx-auto mb-1" style={{ color }} />
          <div className="text-xl font-bold" style={{ color }}>{value}</div>
          <div className="text-[10px] font-medium text-stone-500">{label}</div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [, navigate] = useLocation();

  const featuredCards = [
    CARDS.find(c => c.id === 'T7'),
    CARDS.find(c => c.id === 'A29'),
    CARDS.find(c => c.id === 'A73'),
    CARDS.find(c => c.id === 'A35'),
    CARDS.find(c => c.id === 'T5'),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-24">
      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{ height: '210px' }}>
        <img
          src={HERO_IMG}
          alt="PMO Toolkit"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(250,250,248,0) 30%, rgba(250,250,248,0.6) 70%, rgba(250,250,248,1) 100%)'
        }} />
        {/* Top status bar area */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1
              className="text-2xl font-bold text-stone-900 leading-tight"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              PMO Toolkit
            </h1>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              {CARDS.length} tools, techniques & frameworks
            </p>
          </motion.div>
        </div>
      </div>

      <div className="px-4 pt-3 space-y-5">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <QuickStats />
        </motion.div>

        {/* All Decks */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex items-center justify-between mb-2.5"
          >
            <h2 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
              All Decks
            </h2>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            {DECKS.map(deck => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </motion.div>
        </div>

        {/* Quick Reference — horizontal scroll */}
        <div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-2.5"
          >
            Quick Reference
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide"
          >
            {featuredCards.map(card => {
              if (!card) return null;
              const deck = DECKS.find(d => d.id === card.deckId);
              return (
                <button
                  key={card.id}
                  onClick={() => navigate(`/card/${card.id}`)}
                  className="flex-shrink-0 w-44 text-left rounded-2xl p-3.5 bg-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
                  style={{
                    borderLeft: `3px solid ${deck?.color ?? '#ccc'}`,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
                  }}
                >
                  <div
                    className="text-[9px] font-mono font-bold mb-1.5 px-1.5 py-0.5 rounded inline-block"
                    style={{ backgroundColor: deck?.bgColor, color: deck?.textColor }}
                  >
                    {card.code}
                  </div>
                  <h3 className="text-xs font-semibold text-stone-800 leading-tight mb-1">
                    {card.title}
                  </h3>
                  <p className="text-[10px] text-stone-400 line-clamp-2 leading-relaxed">
                    {card.tagline}
                  </p>
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* How to use */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl p-4 bg-stone-100 border border-stone-200/60"
        >
          <h3 className="text-xs font-semibold text-stone-600 mb-2.5 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-stone-300 flex items-center justify-center text-[9px] text-stone-600 font-bold">?</span>
            How to use this app
          </h3>
          <ul className="space-y-1.5">
            {[
              ['Decks', 'Browse by category — each deck has its own colour'],
              ['Cards', 'Tap any card to read full details, steps, and tips'],
              ['Search', 'Find tools by name, keyword, or framework'],
              ['Bookmark', 'Save cards to build your personal reference set'],
            ].map(([label, desc]) => (
              <li key={label} className="flex items-start gap-2 text-xs text-stone-500">
                <span className="text-stone-300 mt-0.5 shrink-0">→</span>
                <span>
                  <strong className="text-stone-600">{label}</strong> — {desc}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
