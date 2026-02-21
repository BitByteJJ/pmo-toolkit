// PMO Toolkit Navigator — Home Page
// Design: "Clarity Cards" — fun physical card-deck aesthetic
// Each deck shows its cover illustration + progress bar
// Fonts: Sora (display) + Inter (body)

import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Layers, Zap, BookOpen, Search, ArrowRight } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { DECKS, CARDS, getCardsByDeck } from '@/lib/pmoData';
import { useBookmarks } from '@/contexts/BookmarksContext';
import { useCardProgress } from '@/hooks/useCardProgress';

const HERO_IMG = 'https://private-us-east-1.manuscdn.com/sessionFile/wGRSygz6Vjmbiu3SMWngYA/sandbox/8jjxsB34pPKxphOQiFs3Lq-img-1_1771664268000_na1fn_aG9tZS1oZXJvLWlsbHVzdHJhdGlvbg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvd0dSU3lnejZWam1iaXUzU01XbmdZQS9zYW5kYm94LzhqanhzQjM0cFBLeHBoT1FpRnMzTHEtaW1nLTFfMTc3MTY2NDI2ODAwMF9uYTFmbl9hRzl0WlMxb1pYSnZMV2xzYkhWemRISmhkR2x2YmcucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=S4o3nchQdvzrXjUzaEmILHtCFu3pQr8MJpBH6Vvsi3RozJHomZIlRLfeUaXF5eJgP~rOqh8WXVwSJysXS95gf7QCOlA4MTjVZoGtUUBSGKOCK68-X7QS6NNnpM0OMV1Ce3T6e-XJitV2r2ErD5-LvTGahuVXBqv9fy52lSsonVrGXHbs9zcV3M7ZrkaZy2ZVyoL1MNkLv4srxJia9Sdi2R0np11He-mXIiX4vBuQfFXTXVCyS717hslV5omlIwCxEm37whyzscAz9IHG29-6bviv8gQn09Is7qp5DxrCId89EM2kCQfoMp6CSsAHTddeIM3eHbREOv3gQRyEZs8OUA__';

// Cover illustrations for each deck
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

function PhysicalDeckCard({ deck, index }: { deck: typeof DECKS[0]; index: number }) {
  const [, navigate] = useLocation();
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
          {/* Full-bleed background illustration — object-cover fills the card, top-anchored so heads aren't cropped */}
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
          {/* Gradient overlay — strong at bottom for text legibility */}
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to bottom, transparent 30%, ${deck.bgColor}CC 62%, ${deck.bgColor}F5 80%, ${deck.bgColor} 100%)` }}
          />
          {/* Top-right card count badge */}
          <div className="absolute top-3 right-3 z-10">
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[10px] font-bold"
              style={{ backgroundColor: deck.color }}
            >
              <span>{cards.length}</span>
              <span className="opacity-80">cards</span>
            </div>
          </div>
          {/* Top-left completion badge */}
          {isComplete && (
            <div className="absolute top-3 left-3 z-10">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: deck.color }}
              >✓</span>
            </div>
          )}
          {/* Bottom text overlay */}
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
                  <span className="text-[9px] font-semibold" style={{ color: deck.textColor, opacity: 0.55 }}>
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
          {/* Bottom accent bar */}
          <div className="h-1 w-full shrink-0 relative z-10" style={{ backgroundColor: deck.color }} />
        </div>

        {/* ── MOBILE: original horizontal layout ── */}
        <div className="lg:hidden flex flex-col h-full">
          {/* Background */}
          <div className="absolute inset-0" style={{ backgroundColor: deck.bgColor }} />
          {/* Illustration floats right */}
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
                  mixBlendMode: 'multiply',
                  opacity: 0.88,
                }}
              />
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(to right, ${deck.bgColor} 38%, ${deck.bgColor}CC 58%, transparent 85%)` }}
              />
            </div>
          )}
          {/* Mobile content */}
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
                  >
                    ✓
                  </span>
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
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-semibold" style={{ color: deck.textColor, opacity: 0.5 }}>
                    {readCount} / {cards.length} read
                  </span>
                  <span className="text-[9px] font-bold" style={{ color: deck.color }}>
                    {pct}%{isComplete ? ' ✓' : ''}
                  </span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: deck.color + '25' }}>
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
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-1">
                {cards.slice(0, 4).map((c, i) => (
                  <div
                    key={c.id}
                    className="w-5 h-7 rounded-md"
                    style={{
                      backgroundColor: deck.color,
                      opacity: 0.15 + i * 0.15,
                      transform: `rotate(${(i - 1.5) * 3}deg)`,
                      marginLeft: i > 0 ? '-5px' : '0',
                      zIndex: i,
                      position: 'relative',
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold" style={{ color: deck.color }}>
                {readCount === 0 ? 'Start deck' : isComplete ? 'Review deck' : 'Continue'}
                <ArrowRight size={12} />
              </div>
            </div>
          </div>
          <div className="h-1 w-full shrink-0 relative" style={{ backgroundColor: deck.color }} />
        </div>

      </motion.div>
    </motion.div>
  );
}

function QuickStats() {
  const { bookmarks } = useBookmarks();
  const { deckProgress } = useCardProgress();
  const totalCards = CARDS.length;
  const readCount = DECKS.reduce((sum, d) => {
    const ids = getCardsByDeck(d.id).map(c => c.id);
    return sum + Math.round(deckProgress(ids) * ids.length);
  }, 0);

  const stats = [
    { icon: Layers, label: 'Cards', value: totalCards, color: '#0284C7', bg: '#EFF6FF', textColor: '#1E40AF' },
    { icon: BookOpen, label: 'Decks', value: DECKS.length, color: '#059669', bg: '#ECFDF5', textColor: '#065F46' },
    { icon: Zap, label: 'Read', value: readCount, color: '#D97706', bg: '#FEF3C7', textColor: '#92400E' },
    { icon: Zap, label: 'Saved', value: bookmarks.length, color: '#E11D48', bg: '#FFF1F2', textColor: '#9F1239' },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map(({ icon: Icon, label, value, color, bg, textColor }) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl p-2.5 text-center relative overflow-hidden"
          style={{ backgroundColor: bg }}
        >
          <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full opacity-10" style={{ backgroundColor: color }} />
          <Icon size={14} className="mx-auto mb-1" style={{ color }} />
          <div className="text-lg font-bold" style={{ fontFamily: 'Sora, sans-serif', color: textColor }}>{value}</div>
          <div className="text-[9px] font-semibold" style={{ color: textColor, opacity: 0.6 }}>{label}</div>
        </motion.div>
      ))}
    </div>
  );
}

export default function Home() {
  const [, navigate] = useLocation();

  const featuredCards = [
    CARDS.find(c => c.id === 'T7'),
    CARDS.find(c => c.id === 'A29'),
    CARDS.find(c => c.id === 'A35'),
    CARDS.find(c => c.id === 'T5'),
    CARDS.find(c => c.id === 'M2'),
  ].filter(Boolean);

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#F5F3EE' }}>
      {/* Hero Banner */}
      <div className="relative overflow-hidden px-4 pt-6 pb-2" style={{ backgroundColor: '#F5F3EE' }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-3"
        >
          <h1
            className="text-[26px] font-black text-stone-900 leading-tight"
            style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}
          >
            StratAlign
          </h1>
          <p className="text-xs text-stone-500 font-semibold mt-0.5 tracking-wide">
            {CARDS.length} tools, techniques & frameworks
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="w-full rounded-2xl overflow-hidden relative"
          style={{ backgroundColor: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.05)', minHeight: '220px' }}
        >
          <img
            src={HERO_IMG}
            alt="StratAlign"
            className="w-full"
            style={{ display: 'block', mixBlendMode: 'multiply', maxHeight: '220px', objectFit: 'contain', objectPosition: 'center' }}
          />
          {/* Floating text overlay — bottom-left, matching deck card style */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.6) 28%, transparent 55%)',
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 pointer-events-none">
            <p
              className="text-[11px] font-bold tracking-widest uppercase mb-1"
              style={{ color: '#a8956a', fontFamily: 'Sora, sans-serif' }}
            >
              Your strategy toolkit
            </p>
            <h2
              className="text-[22px] font-black leading-tight"
              style={{ color: '#1c1917', fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}
            >
              StratAlign
            </h2>
            <p className="text-[12px] text-stone-500 font-medium mt-0.5">
              {CARDS.length} tools, techniques &amp; frameworks across {DECKS.length} decks
            </p>
          </div>
        </motion.div>
      </div>

      <div className="px-4 pt-3 space-y-5">
        {/* Quick Stats */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
          <QuickStats />
        </motion.div>

        {/* Search shortcut */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          onClick={() => navigate('/search')}
          className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 bg-white text-left"
          style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
            <Search size={15} className="text-stone-500" />
          </div>
          <span className="text-sm text-stone-400 font-medium flex-1">Search tools, frameworks, techniques…</span>
          <ArrowRight size={14} className="text-stone-300 shrink-0" />
        </motion.button>

        {/* All Decks */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="flex items-center justify-between mb-3"
          >
            <h2 className="text-[11px] font-black text-stone-400 uppercase tracking-[0.12em]">All Decks</h2>
            <span className="text-[10px] text-stone-400 font-medium">{DECKS.length} decks</span>
          </motion.div>
          {/* Mobile: single column | Tablet: 2 columns | Desktop: 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
            {DECKS.map((deck, index) => (
              <PhysicalDeckCard key={deck.id} deck={deck} index={index} />
            ))}
          </div>
        </div>

        {/* Quick Reference */}
        <div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-[11px] font-black text-stone-400 uppercase tracking-[0.12em] mb-3"
          >
            Quick Reference
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4"
            style={{ scrollbarWidth: 'none' }}
          >
            {featuredCards.map((card, i) => {
              if (!card) return null;
              const deck = DECKS.find(d => d.id === card.deckId);
              return (
                <motion.button
                  key={card.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  onClick={() => navigate(`/card/${card.id}`)}
                  className="flex-shrink-0 w-44 text-left rounded-2xl p-3.5 bg-white relative overflow-hidden"
                  style={{ boxShadow: `0 2px 8px ${deck?.color ?? '#ccc'}20, 0 1px 3px rgba(0,0,0,0.06)` }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ backgroundColor: deck?.color }} />
                  <div
                    className="text-[9px] font-mono font-bold mb-2 px-1.5 py-0.5 rounded-md inline-block mt-1"
                    style={{ backgroundColor: deck?.bgColor, color: deck?.textColor }}
                  >
                    {card.code}
                  </div>
                  <h3 className="text-xs font-bold text-stone-800 leading-tight mb-1.5" style={{ fontFamily: 'Sora, sans-serif' }}>
                    {card.title}
                  </h3>
                  <p className="text-[10px] text-stone-400 line-clamp-2 leading-relaxed">{card.tagline}</p>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
