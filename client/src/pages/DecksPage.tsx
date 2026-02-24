// StratAlign — DecksPage
// Design: "Clarity Cards" — shows all 8 decks in the same grid as the home page
// Fonts: Sora (display) + Inter (body)

import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy, Star } from 'lucide-react';
import { DECKS, getCardsByDeck } from '@/lib/pmoData';
import { useCardProgress } from '@/hooks/useCardProgress';
import { useMasteryBadges } from '@/hooks/useMasteryBadges';
import { useTheme } from '@/contexts/ThemeContext';
import PageFooter from '@/components/PageFooter';

// Cover illustrations for each deck (same as Home.tsx)
const DECK_COVERS: Record<string, string> = {
  phases:        'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/epNvaChDmInzjphr.png',
  archetypes:    'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/UHlTjAHHMkQgHafH.png',
  methodologies: 'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/bdAxarcmvXIHqVvw.png',
  people:        'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/TOYDIIqTWyLFwfCY.png',
  process:       'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/GrdQOwJjSnFKcKVn.png',
  business:      'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/CbjqUzAWrljDJesJ.png',
  tools:         'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/wYAdBnNHDXPbyggk.png',
  techniques:    'https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/nazJKMRPUyxDWRas.png',
};

const DECK_TILTS = [1.5, -1.2, 2.0, -0.8, 1.8, -1.5, 0.9, -2.2];

function DeckCard({ deck, index }: { deck: typeof DECKS[0]; index: number }) {
  const [, navigate] = useLocation();
  const { isDark } = useTheme();
  const { deckProgress, deckReadCount } = useCardProgress();
  const cards = getCardsByDeck(deck.id);
  const cardIds = cards.map(c => c.id);
  const tilt = DECK_TILTS[index % DECK_TILTS.length];
  const coverImg = DECK_COVERS[deck.id];
  const pct = Math.round(deckProgress(cardIds) * 100);
  const readCount = deckReadCount(cardIds);
  const isComplete = pct === 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: tilt * 1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="relative cursor-pointer h-full"
      style={{ marginBottom: '4px' }}
      onClick={() => navigate(`/deck/${deck.id}`)}
    >
      {/* Card stack shadow layers */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{ backgroundColor: deck.color, opacity: 0.25, transform: `rotate(${tilt * 1.8}deg) translateY(4px)`, zIndex: 0 }}
      />
      <div
        className="absolute inset-0 rounded-2xl"
        style={{ backgroundColor: deck.color, opacity: 0.15, transform: `rotate(${tilt * 0.9}deg) translateY(2px)`, zIndex: 1 }}
      />

      {/* Main card face */}
      <motion.div
        whileHover={{ scale: 1.02, rotate: tilt * 0.3, y: -3 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="relative w-full h-full text-left rounded-2xl overflow-hidden flex flex-col"
        style={{ zIndex: 2, boxShadow: `0 4px 16px ${deck.color}30, 0 2px 6px rgba(0,0,0,0.08)` }}
      >
        {/* ── DESKTOP: full-bleed illustration, text overlay at bottom ── */}
        <div className="hidden lg:flex flex-col h-full relative" style={{ minHeight: '360px' }}>
          {coverImg && (
            <div className="absolute inset-0">
              <img
                src={coverImg}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center center', opacity: 0.95 }}
              />
            </div>
          )}
          <div
            className="absolute inset-0"
            style={{ background: isDark ? `linear-gradient(to bottom, transparent 30%, rgba(10,22,40,0.8) 62%, rgba(10,22,40,0.95) 80%, #0a1628 100%)` : `linear-gradient(to bottom, transparent 30%, rgba(241,245,249,0.8) 62%, rgba(241,245,249,0.95) 80%, #f1f5f9 100%)` }}
          />
          <div className="absolute top-3 right-3 z-10">
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[10px] font-bold"
              style={{ backgroundColor: deck.color }}
            >
              <span>{cards.length}</span>
              <span className="opacity-80">cards</span>
            </div>
          </div>
          {isComplete && (
            <div className="absolute top-3 left-3 z-10">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: deck.color }}
              >✓</span>
            </div>
          )}
          <div className="relative mt-auto px-4 pb-4 pt-2 z-10">
            <span
              className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md inline-block mb-1.5"
              style={{ backgroundColor: deck.color + '30', color: deck.textColor }}
            >
              {deck.subtitle}
            </span>
            <h3
              className="text-[15px] font-bold leading-tight mb-1"
              style={{ fontFamily: 'Sora, sans-serif', color: deck.textColor }}
            >
              {deck.title}
            </h3>
            <p
              className="text-[10px] leading-relaxed line-clamp-2 mb-2"
              style={{ color: deck.textColor, opacity: 0.7 }}
            >
              {deck.description}
            </p>
            {readCount > 0 && (
              <div className="mb-2">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[9px] font-semibold" style={{ color: deck.textColor, opacity: 0.85 }}>
                    {readCount} / {cards.length} read
                  </span>
                  <span className="text-[9px] font-bold" style={{ color: deck.color }}>
                    {pct}%{isComplete ? ' ✓' : ''}
                  </span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: deck.color + '30' }}>
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{ backgroundColor: deck.color }}
                  />
                </div>
              </div>
            )}
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-1 text-[11px] font-bold" style={{ color: deck.color }}>
                {readCount === 0 ? 'Start deck' : isComplete ? 'Review deck' : 'Continue'}
                <ArrowRight size={12} />
              </div>
            </div>
          </div>
          <div className="h-1 w-full shrink-0 relative z-10" style={{ backgroundColor: deck.color }} />
        </div>

        {/* ── MOBILE: original horizontal layout ── */}
        <div className="lg:hidden flex flex-col h-full">
          <div className="absolute inset-0" style={{ backgroundColor: isDark ? '#0f1c30' : '#ffffff' }} />
          {coverImg && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
              <img
                src={coverImg}
                alt=""
                aria-hidden="true"
                className="absolute"
                style={{
                  right: '-8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  height: '130%',
                  width: 'auto',
                  maxWidth: '55%',
                  objectFit: 'contain',
                  mixBlendMode: isDark ? 'screen' : 'multiply',
                  opacity: isDark ? 0.35 : 0.70,
                  filter: isDark ? 'invert(1) grayscale(1) brightness(1.8)' : 'grayscale(1) brightness(0.75) contrast(1.1)',
                }}
              />
              <div
                className="absolute inset-0"
                style={{ background: isDark ? `linear-gradient(to right, #0f1c30 38%, rgba(15,28,48,0.85) 58%, transparent 85%)` : `linear-gradient(to right, #f8fafc 38%, rgba(248,250,252,0.85) 58%, transparent 85%)` }}
              />
            </div>
          )}
          <div className="relative flex flex-col flex-1 px-4 pb-4 pt-2" style={{ zIndex: 2 }}>
            <div className="flex items-center justify-between mb-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-lg shrink-0 relative"
                style={{ backgroundColor: deck.color + '22' }}
              >
                {deck.icon}
                {isComplete && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px]"
                    style={{ backgroundColor: deck.color, color: '#fff' }}
                  >✓</span>
                )}
              </div>
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[10px] font-bold"
                style={{ backgroundColor: deck.color }}
              >
                <span>{cards.length}</span>
                <span className="opacity-75">cards</span>
              </div>
            </div>
            <div className="mb-1">
              <span
                className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md"
                style={{ backgroundColor: deck.color + '20', color: deck.textColor, opacity: 0.7 }}
              >
                {deck.subtitle}
              </span>
            </div>
            <h3
              className="text-base font-bold leading-tight mb-1"
              style={{ fontFamily: 'Sora, sans-serif', color: deck.textColor }}
            >
              {deck.title}
            </h3>
            <p
              className="text-[11px] leading-relaxed line-clamp-2 mb-3 flex-1"
              style={{ color: deck.textColor, opacity: 0.65, maxWidth: '62%' }}
            >
              {deck.description}
            </p>
            {readCount > 0 && (
              <div className="mb-2">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[9px] font-semibold" style={{ color: deck.textColor, opacity: 0.85 }}>
                    {readCount} / {cards.length} read
                  </span>
                  <span className="text-[9px] font-bold" style={{ color: deck.color }}>
                    {pct}%{isComplete ? ' ✓' : ''}
                  </span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: deck.color + '30' }}>
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{ backgroundColor: deck.color }}
                  />
                </div>
              </div>
            )}
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-1 text-[11px] font-bold" style={{ color: deck.color }}>
                {readCount === 0 ? 'Start deck' : isComplete ? 'Review deck' : 'Continue'}
                <ArrowRight size={12} />
              </div>
            </div>
          </div>
          <div className="h-1 w-full shrink-0 relative z-10" style={{ backgroundColor: deck.color }} />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DecksPage() {
  const { badges, totalBadges } = useMasteryBadges();
  const { isDark } = useTheme();
  const maxBadges = DECKS.length * 2;
  return (
    <div className="min-h-screen pb-24" style={{ background: isDark ? '#0a1628' : '#f1f5f9' }}>
      <div className="pt-12">
        <div className="max-w-5xl mx-auto px-4 pt-6 pb-4">
          <h1 className="text-2xl font-black text-slate-100 mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
            All Decks
          </h1>

          {/* Mastery Badge Summary */}
          <div className="flex items-center gap-3 mb-6 p-3 rounded-2xl bg-card" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.055), 0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.04)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(245,158,11,0.18)' }}>
              <Trophy size={16} className="text-amber-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground">Mastery Badges</p>
              <p className="text-[11px] text-foreground">{totalBadges} of {maxBadges} earned — read all cards or ace a quiz to unlock</p>
            </div>
            <div className="flex gap-1 flex-wrap justify-end">
              {DECKS.map(d => {
                const deckBadges = badges.filter(b => b.deckId === d.id);
                const hasBoth = deckBadges.length >= 2;
                const hasOne = deckBadges.length === 1;
                return (
                  <div key={d.id} title={`${d.title}${hasBoth ? ' — Mastered!' : hasOne ? ' — 1 badge' : ''}`} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: hasBoth ? d.color : hasOne ? d.color + '50' : 'rgba(255,255,255,0.08)' }}>
                    {(hasBoth || hasOne) && <Star size={10} className={hasBoth ? 'text-white' : ''} style={hasOne && !hasBoth ? { color: d.color } : {}} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile: single column */}
          <div className="flex flex-col gap-4 lg:hidden">
            {DECKS.map((deck, i) => (
              <DeckCard key={deck.id} deck={deck} index={i} />
            ))}
          </div>

          {/* Desktop: responsive grid */}
          <div className="hidden lg:grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {DECKS.map((deck, i) => (
              <DeckCard key={deck.id} deck={deck} index={i} />
            ))}
          </div>
        </div>
      </div>
      <PageFooter />
    </div>
  );
}
