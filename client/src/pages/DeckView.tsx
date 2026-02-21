// Design: "Clarity Cards" — deck view with illustrated title card, intro cards, and card list
// Structure: bold cover → how to start → categories → individual cards

import { useRoute, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Bookmark, BookmarkCheck, ChevronDown, ChevronUp, Lightbulb, Layers, Compass } from 'lucide-react';
import { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import { getCardsByDeck, getDeckById } from '@/lib/pmoData';
import { getDeckIntro } from '@/lib/deckIntroData';
import { useBookmarks } from '@/contexts/BookmarksContext';

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
};

// ─── Title Cover Card ──────────────────────────────────────────────────────────
function TitleCard({ deck, intro }: { deck: NonNullable<ReturnType<typeof getDeckById>>; intro: NonNullable<ReturnType<typeof getDeckIntro>> }) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)',
        border: `3px solid ${deck.color}`,
        minHeight: '460px',
      }}
    >
      {/* Illustration */}
      <div className="w-full" style={{ maxHeight: '360px', overflow: 'hidden' }}>
        <img
          src={intro.coverImage}
          alt={deck.title}
          className="w-full object-cover object-center"
          style={{ maxHeight: '360px', minHeight: '280px' }}
        />
      </div>

      {/* Title block */}
      <div className="px-6 pb-6 pt-4 text-center">
        <h1
          className="text-4xl font-black leading-tight tracking-tight"
          style={{ color: '#1a1a1a', fontFamily: "'Sora', sans-serif", letterSpacing: '-0.02em' }}
        >
          {deck.title}
        </h1>
        <p className="text-sm mt-2 font-bold uppercase tracking-widest" style={{ color: deck.color }}>
          {deck.subtitle}
        </p>
        <p className="text-xs text-stone-500 mt-2 leading-relaxed italic">{intro.tagline}</p>
      </div>

      {/* Bottom accent bar */}
      <div className="h-3 w-full" style={{ background: `linear-gradient(90deg, ${deck.color}, ${deck.color}99)` }} />
    </div>
  );
}

// ─── How To Start Card ─────────────────────────────────────────────────────────
function HowToStartCard({ deck, intro }: { deck: NonNullable<ReturnType<typeof getDeckById>>; intro: NonNullable<ReturnType<typeof getDeckIntro>> }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        border: `2px solid ${deck.color}20`,
      }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: `2px solid ${deck.color}15` }}>
        <div className="flex items-center gap-2 mb-1">
          <Compass size={16} style={{ color: deck.color }} />
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: deck.color }}>
            How to Start
          </span>
        </div>
        <h2 className="text-xl font-black text-stone-800" style={{ fontFamily: "'Sora', sans-serif" }}>
          There&apos;s no one right way to start
        </h2>
        <p className="text-xs text-stone-500 mt-1 leading-relaxed">
          Sometimes you have to make decisions when there&apos;s no single right answer. Here are a few low-stakes ways to begin.
        </p>
      </div>

      {/* Ways to start */}
      <div className="px-5 py-4 space-y-4">
        {intro.howToStart.map((way, i) => (
          <div key={i}>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                style={{ backgroundColor: deck.color }}
              >
                {i + 1}
              </div>
              <span className="text-sm font-bold text-stone-800">{way.title}</span>
            </div>
            <ol className="space-y-1 pl-7">
              {way.steps.map((step, j) => (
                <li key={j} className="text-xs text-stone-600 leading-relaxed flex gap-1.5">
                  <span className="font-bold text-stone-400 flex-shrink-0">{j + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      {/* Quick tips toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-3 text-xs font-bold"
        style={{
          borderTop: `1px solid ${deck.color}20`,
          color: deck.color,
          backgroundColor: `${deck.color}08`,
        }}
      >
        <span className="flex items-center gap-1.5">
          <Lightbulb size={12} />
          A few quick tips
        </span>
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <ul className="px-5 py-4 space-y-2" style={{ backgroundColor: `${deck.color}05` }}>
              {intro.quickTips.map((tip, i) => (
                <li key={i} className="text-xs text-stone-600 leading-relaxed flex gap-2">
                  <span style={{ color: deck.color }} className="flex-shrink-0">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom accent */}
      <div className="h-1.5 w-full" style={{ backgroundColor: deck.color }} />
    </div>
  );
}

// ─── System / Decision Card ────────────────────────────────────────────────────
function SystemCard({ deck, intro }: { deck: NonNullable<ReturnType<typeof getDeckById>>; intro: NonNullable<ReturnType<typeof getDeckIntro>> }) {
  if (!intro.systemNodes || intro.systemNodes.length === 0) return null;

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        border: `2px solid ${deck.color}20`,
      }}
    >
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: `2px solid ${deck.color}15` }}>
        <div className="flex items-center gap-2 mb-1">
          <Layers size={16} style={{ color: deck.color }} />
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: deck.color }}>
            Decision System
          </span>
        </div>
        <h2 className="text-xl font-black text-stone-800" style={{ fontFamily: "'Sora', sans-serif" }}>
          Which approach fits?
        </h2>
      </div>

      <div className="px-5 py-5 space-y-3">
        {intro.systemNodes.map((node, i) => (
          <div key={i} className="flex gap-3 items-start">
            {/* Question box */}
            <div className="flex-1">
              <div
                className="rounded-xl px-3 py-2.5 text-xs text-stone-700 font-medium leading-relaxed"
                style={{ backgroundColor: `${deck.color}10`, border: `1px solid ${deck.color}25` }}
              >
                {node.question}
              </div>
              {/* Yes arrow */}
              {i < intro.systemNodes!.length - 1 && (
                <div className="flex items-center gap-1 mt-1 ml-3">
                  <span className="text-[10px] font-bold text-stone-400">Yes ↓</span>
                </div>
              )}
              {i === intro.systemNodes!.length - 1 && intro.systemTerminal && (
                <div className="flex items-center gap-1 mt-1 ml-3">
                  <span className="text-[10px] font-bold text-stone-400">Yes →</span>
                  <span className="text-[10px] font-bold" style={{ color: deck.color }}>{intro.systemTerminal}</span>
                </div>
              )}
            </div>

            {/* No → Category */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0 w-20">
              <div className="text-[10px] font-bold text-stone-400">No →</div>
              <div
                className="rounded-xl px-2 py-2 text-center text-[10px] font-bold w-full"
                style={{ backgroundColor: deck.color, color: '#fff' }}
              >
                <div className="text-base mb-0.5">{node.noIcon}</div>
                {node.noCategory}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-1.5 w-full" style={{ backgroundColor: deck.color }} />
    </div>
  );
}

// ─── Categories Card ───────────────────────────────────────────────────────────
function CategoriesCard({ deck, intro }: { deck: NonNullable<ReturnType<typeof getDeckById>>; intro: NonNullable<ReturnType<typeof getDeckIntro>> }) {
  return (
    <div
      className="w-full overflow-hidden"
      style={{
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        border: `2px solid ${deck.color}20`,
      }}
    >
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: `2px solid ${deck.color}15` }}>
        <div className="flex items-center gap-2 mb-1">
          <Layers size={16} style={{ color: deck.color }} />
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: deck.color }}>
            Categories
          </span>
        </div>
        <h2 className="text-xl font-black text-stone-800" style={{ fontFamily: "'Sora', sans-serif" }}>
          What&apos;s in this deck
        </h2>
      </div>

      <div className="px-5 py-4 space-y-3">
        {intro.categories.map((cat, i) => (
          <div key={i} className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ backgroundColor: `${cat.color}18` }}
            >
              {cat.icon}
            </div>
            <div>
              <div className="text-sm font-bold text-stone-800">{cat.name}</div>
              <div className="text-[11px] text-stone-500 leading-relaxed">{cat.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-1.5 w-full" style={{ backgroundColor: deck.color }} />
    </div>
  );
}

// ─── Card List Item ────────────────────────────────────────────────────────────
function CardListItem({
  card,
  deck,
  index,
  onNavigate,
}: {
  card: ReturnType<typeof getCardsByDeck>[0];
  deck: NonNullable<ReturnType<typeof getDeckById>>;
  index: number;
  onNavigate: () => void;
}) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(card.id);

  return (
    <motion.div variants={itemVariants}>
      <div
        className="bg-white overflow-hidden"
        style={{
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: `1.5px solid ${deck.color}20`,
        }}
      >
        <div
          onClick={onNavigate}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && onNavigate()}
          className="w-full text-left p-4 pr-2 cursor-pointer"
        >
          <div className="flex items-start gap-3">
            {/* Card number badge */}
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5"
              style={{ backgroundColor: `${deck.color}18`, color: deck.color }}
            >
              {index + 1}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md"
                  style={{ backgroundColor: deck.bgColor, color: deck.textColor }}
                >
                  {card.code}
                </span>
                <span className="text-[9px] text-stone-400 font-medium capitalize">
                  {card.type.replace('-', ' ')}
                </span>
              </div>
              <h3 className="text-sm font-bold text-stone-800 leading-tight">{card.title}</h3>
              <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">{card.tagline}</p>
            </div>

            <button
              onClick={e => { e.stopPropagation(); toggleBookmark(card.id); }}
              className="p-2 rounded-xl flex-shrink-0"
              style={{ color: bookmarked ? deck.color : '#d1d5db' }}
            >
              {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            </button>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="h-0.5 w-full" style={{ backgroundColor: `${deck.color}30` }} />
      </div>
    </motion.div>
  );
}

// ─── Main DeckView ─────────────────────────────────────────────────────────────
export default function DeckView() {
  const [, params] = useRoute('/deck/:deckId');
  const [, navigate] = useLocation();
  const deckId = params?.deckId ?? '';
  const deck = getDeckById(deckId);
  const intro = getDeckIntro(deckId);
  const cards = getCardsByDeck(deckId);

  if (!deck) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-500 mb-4">Deck not found</p>
          <button onClick={() => navigate('/')} className="text-blue-600 font-medium">
            Go home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#F7F6F3' }}>
      {/* Sticky header */}
      <div
        className="sticky top-0 z-40 px-4 py-3 flex items-center justify-between"
        style={{
          backgroundColor: 'rgba(247,246,243,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: `2px solid ${deck.color}20`,
        }}
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm font-semibold"
          style={{ color: deck.color }}
        >
          <ArrowLeft size={16} />
          All Decks
        </button>

        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ backgroundColor: deck.bgColor, color: deck.textColor }}
          >
            {deck.cardCount} cards
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-5 space-y-4">
        {/* Title Card */}
        {intro && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <TitleCard deck={deck} intro={intro} />
          </motion.div>
        )}

        {/* How To Start Card */}
        {intro && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <HowToStartCard deck={deck} intro={intro} />
          </motion.div>
        )}

        {/* System / Decision Card (only for decks that have it) */}
        {intro?.systemNodes && intro.systemNodes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <SystemCard deck={deck} intro={intro} />
          </motion.div>
        )}

        {/* Categories Card */}
        {intro && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <CategoriesCard deck={deck} intro={intro} />
          </motion.div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 py-2">
          <div className="flex-1 h-px" style={{ backgroundColor: `${deck.color}30` }} />
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: deck.color }}>
            {cards.length} Cards
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: `${deck.color}30` }} />
        </div>

        {/* Card list */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
          className="space-y-2.5"
        >
          {cards.map((card, index) => (
            <CardListItem
              key={card.id}
              card={card}
              deck={deck}
              index={index}
              onNavigate={() => navigate(`/card/${card.id}`)}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
