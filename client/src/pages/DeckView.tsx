// PMO Toolkit Navigator — Deck View
// Design: "Clarity Cards" — deck view with illustrated title card, intro cards, and card list
// Structure: bold cover → how to start → categories (interactive filter) → individual cards
// Features: Sprint Mode, category filter, tag filter, sort, read tracking, in-list bookmarks

import { useRoute, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark, BookmarkCheck, ChevronDown, ChevronUp,
  Lightbulb, Layers, Compass, CheckCircle2, Zap,
  SlidersHorizontal, ArrowUpDown, X,
} from 'lucide-react';
import { useState, useMemo, useRef, useCallback } from 'react';
import BottomNav from '@/components/BottomNav';
import { getCardsByDeck, getDeckById } from '@/lib/pmoData';
import { getCardIllustration } from '@/lib/toolImages';
import { getDeckIntro } from '@/lib/deckIntroData';
import { useBookmarks } from '@/contexts/BookmarksContext';
import { useCardProgress } from '@/hooks/useCardProgress';
import SprintMode from '@/components/SprintMode';

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
};

// ─── Title Cover Card ──────────────────────────────────────────────────────────
function TitleCard({
  deck,
  intro,
}: {
  deck: NonNullable<ReturnType<typeof getDeckById>>;
  intro: NonNullable<ReturnType<typeof getDeckIntro>>;
}) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        borderRadius: '20px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)',
        border: `3px solid ${deck.color}`,
        minHeight: '380px',
        backgroundColor: '#ffffff',
      }}
    >
      <div className="absolute inset-0">
        <img
          src={intro.coverImage}
          alt={deck.title}
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center center', mixBlendMode: 'multiply', opacity: 1 }}
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.75) 58%, rgba(255,255,255,0.95) 72%, #ffffff 85%)',
        }}
      />
      <div className="relative z-10 flex flex-col justify-end" style={{ minHeight: '380px' }}>
        <div className="px-6 pb-6 pt-2 text-center">
          <h1
            className="text-4xl font-black leading-tight tracking-tight"
            style={{ color: '#1a1a1a', fontFamily: "'Sora', sans-serif", letterSpacing: '-0.02em' }}
          >
            {deck.title}
          </h1>
          <p className="text-sm mt-2 font-bold uppercase tracking-widest" style={{ color: deck.color }}>
            {deck.subtitle}
          </p>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: '#57534e', opacity: 0.8 }}>
            {intro.tagline}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── How To Start Card ─────────────────────────────────────────────────────────
function HowToStartCard({
  deck,
  intro,
}: {
  deck: NonNullable<ReturnType<typeof getDeckById>>;
  intro: NonNullable<ReturnType<typeof getDeckIntro>>;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="rounded-2xl overflow-hidden bg-white"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `1.5px solid ${deck.color}20` }}
    >
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-4 py-3.5"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: deck.color + '20' }}
          >
            <Lightbulb size={13} style={{ color: deck.color }} />
          </div>
          <span className="text-sm font-bold text-stone-800">How to start</span>
        </div>
        {expanded ? (
          <ChevronUp size={15} className="text-stone-400" />
        ) : (
          <ChevronDown size={15} className="text-stone-400" />
        )}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {intro.howToStart.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: deck.color, color: '#fff' }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-stone-700">{item.title}</p>
                    {item.steps.map((s, j) => (
                      <p key={j} className="text-[11px] text-stone-500 leading-relaxed mt-0.5">
                        {s}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── System / Decision Card ────────────────────────────────────────────────────
function SystemCard({
  deck,
  intro,
}: {
  deck: NonNullable<ReturnType<typeof getDeckById>>;
  intro: NonNullable<ReturnType<typeof getDeckIntro>>;
}) {
  const [expanded, setExpanded] = useState(false);
  if (!intro.systemNodes || intro.systemNodes.length === 0) return null;
  return (
    <div
      className="rounded-2xl overflow-hidden bg-white"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `1.5px solid ${deck.color}20` }}
    >
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-4 py-3.5"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: deck.color + '20' }}
          >
            <Compass size={13} style={{ color: deck.color }} />
          </div>
          <span className="text-sm font-bold text-stone-800">Decision guide</span>
        </div>
        {expanded ? (
          <ChevronUp size={15} className="text-stone-400" />
        ) : (
          <ChevronDown size={15} className="text-stone-400" />
        )}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {intro.systemNodes.map((node, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: deck.color + '20', color: deck.color }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-stone-700">{node.question}</p>
                    {node.yesNext && (
                      <p className="text-[11px] text-stone-500 mt-0.5">→ Yes: {node.yesNext}</p>
                    )}
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {node.noIcon} {node.noCategory}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Categories Card (interactive filter) ─────────────────────────────────────
function CategoriesCard({
  deck,
  intro,
  activeCategory,
  onCategorySelect,
}: {
  deck: NonNullable<ReturnType<typeof getDeckById>>;
  intro: NonNullable<ReturnType<typeof getDeckIntro>>;
  activeCategory: string | null;
  onCategorySelect: (name: string | null) => void;
}) {
  const [manualExpanded, setManualExpanded] = useState(false);
  if (!intro.categories || intro.categories.length === 0) return null;

  // Auto-open when a category is active so the active pill is always visible
  const isOpen = manualExpanded || activeCategory !== null;

  return (
    <div
      className="rounded-2xl overflow-hidden bg-white"
      style={{
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: `1.5px solid ${activeCategory ? deck.color + '60' : deck.color + '20'}`,
        transition: 'border-color 0.2s',
      }}
    >
      {/* Header row */}
      <button
        onClick={() => setManualExpanded(e => !e)}
        className="w-full flex items-center justify-between px-4 py-3.5"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: deck.color + '20' }}
          >
            <Layers size={13} style={{ color: deck.color }} />
          </div>
          <span className="text-sm font-bold text-stone-800">Categories</span>
          {/* Active badge shown in header */}
          {activeCategory && (
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: deck.color, color: '#fff' }}
            >
              {activeCategory}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp size={15} className="text-stone-400" />
        ) : (
          <ChevronDown size={15} className="text-stone-400" />
        )}
      </button>

      {/* Expandable body */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {/* Pill row */}
              <div className="flex flex-wrap gap-2 mb-3">
                {/* "All" clear pill */}
                <button
                  onClick={() => onCategorySelect(null)}
                  className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full transition-all"
                  style={{
                    backgroundColor: activeCategory === null ? deck.color : deck.color + '15',
                    color: activeCategory === null ? '#fff' : deck.color,
                  }}
                >
                  All cards
                </button>

                {intro.categories.map((cat, i) => {
                  const isActive = activeCategory === cat.name;
                  return (
                    <button
                      key={i}
                      onClick={() => onCategorySelect(isActive ? null : cat.name)}
                      className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all active:scale-95"
                      style={{
                        backgroundColor: isActive ? cat.color : cat.color + '20',
                        color: isActive ? '#fff' : cat.color,
                        boxShadow: isActive ? `0 2px 8px ${cat.color}50` : 'none',
                        transform: isActive ? 'scale(1.03)' : 'scale(1)',
                      }}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                      {isActive && <X size={10} className="ml-0.5 opacity-80" />}
                    </button>
                  );
                })}
              </div>

              {/* Description of the active category */}
              {activeCategory &&
                (() => {
                  const cat = intro.categories.find(c => c.name === activeCategory);
                  return cat ? (
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      <span className="font-semibold" style={{ color: cat.color }}>
                        {cat.icon} {cat.name}:
                      </span>{' '}
                      {cat.description}
                    </p>
                  ) : null;
                })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
  const { isRead } = useCardProgress();
  const bookmarked = isBookmarked(card.id);
  const read = isRead(card.id);
  const illustration = getCardIllustration(card.id);

  return (
    <motion.div variants={itemVariants}>
      <div
        className="relative overflow-hidden cursor-pointer"
        style={{
          borderRadius: '16px',
          boxShadow: `0 3px 12px ${deck.color}22, 0 1px 4px rgba(0,0,0,0.07)`,
          border: `1.5px solid ${read ? deck.color + '50' : deck.color + '25'}`,
          minHeight: '88px',
          backgroundColor: '#ffffff',
        }}
        onClick={onNavigate}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && onNavigate()}
      >
        {illustration && (
          <div className="absolute inset-0 pointer-events-none">
            <img
              src={illustration}
              alt=""
              aria-hidden="true"
              className="absolute"
              style={{
                right: '-4px',
                top: '50%',
                transform: 'translateY(-50%)',
                height: '140%',
                width: 'auto',
                maxWidth: '48%',
                objectFit: 'contain',
                mixBlendMode: 'multiply',
                opacity: 0.9,
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to right, #ffffff 42%, rgba(255,255,255,0.85) 60%, rgba(255,255,255,0.5) 78%, transparent 100%)',
              }}
            />
          </div>
        )}

        <div className="relative z-10 flex items-center gap-3 px-4 py-3 pr-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 transition-colors"
            style={{ backgroundColor: read ? deck.color : `${deck.color}22`, color: read ? '#fff' : deck.color }}
          >
            {read ? <CheckCircle2 size={14} /> : index + 1}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span
                className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md"
                style={{ backgroundColor: deck.color + '25', color: deck.textColor }}
              >
                {card.code}
              </span>
              <span
                className="text-[9px] font-medium capitalize"
                style={{ color: deck.textColor, opacity: 0.55 }}
              >
                {card.type.replace('-', ' ')}
              </span>
              {read && (
                <span className="text-[9px] font-bold" style={{ color: deck.color }}>
                  ✓
                </span>
              )}
            </div>
            <h3
              className="text-sm font-bold leading-tight"
              style={{ color: deck.textColor, opacity: read ? 0.6 : 1 }}
            >
              {card.title}
            </h3>
            <p
              className="text-[11px] mt-0.5 line-clamp-1 leading-relaxed"
              style={{ color: deck.textColor, opacity: 0.55 }}
            >
              {card.tagline}
            </p>
          </div>

          <button
            onClick={e => {
              e.stopPropagation();
              toggleBookmark(card.id);
            }}
            className="p-2 rounded-xl flex-shrink-0 transition-transform hover:scale-110 active:scale-90"
            style={{ color: bookmarked ? deck.color : deck.color + '55' }}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark this card'}
          >
            {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>

        <div className="h-0.5 w-full" style={{ backgroundColor: `${deck.color}40` }} />
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
  const allCards = getCardsByDeck(deckId);
  const { deckReadCount, deckProgress } = useCardProgress();

  const [sprintMode, setSprintMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'default' | 'alpha' | 'unread'>('default');
  const [showFilters, setShowFilters] = useState(false);

  // Ref used to scroll to the card list after a category is selected
  const cardListRef = useRef<HTMLDivElement>(null);

  // All unique tags across cards in this deck (for the advanced tag filter panel)
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allCards.forEach(c => c.tags?.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [allCards]);

  // Resolve the filterTags for the active category
  const activeCategoryTags = useMemo(() => {
    if (!activeCategory || !intro) return null;
    const cat = intro.categories.find(c => c.name === activeCategory);
    return cat?.filterTags ?? null;
  }, [activeCategory, intro]);

  // Filter + sort
  const cards = useMemo(() => {
    let result = [...allCards];
    // Category filter takes precedence over individual tag filter
    if (activeCategoryTags && activeCategoryTags.length > 0) {
      result = result.filter(c => c.tags?.some(t => activeCategoryTags.includes(t)));
    } else if (activeTag) {
      result = result.filter(c => c.tags?.includes(activeTag));
    }
    if (sortOrder === 'alpha') result.sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [allCards, activeCategoryTags, activeTag, sortOrder]);

  const readCount = deckReadCount(allCards.map(c => c.id));
  const pct = Math.round(deckProgress(allCards.map(c => c.id)) * 100);
  const isFiltered = activeCategory !== null || activeTag !== null;

  // Select a category: clear individual tag filter, scroll to card list
  const handleCategorySelect = useCallback((name: string | null) => {
    setActiveCategory(name);
    setActiveTag(null);
    if (name && cardListRef.current) {
      setTimeout(() => {
        cardListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  }, []);

  // Select an individual tag: clear category filter
  const handleTagSelect = useCallback((tag: string | null) => {
    setActiveTag(tag);
    setActiveCategory(null);
  }, []);

  const clearFilter = useCallback(() => {
    setActiveCategory(null);
    setActiveTag(null);
  }, []);

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
      {/* Sprint Mode overlay */}
      <AnimatePresence>
        {sprintMode && (
          <SprintMode deckId={deckId} onClose={() => setSprintMode(false)} />
        )}
      </AnimatePresence>

      {/* Sticky deck sub-header */}
      <div
        className="sticky z-30 py-2"
        style={{
          top: '44px',
          backgroundColor: 'rgba(247,246,243,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: `2px solid ${deck.color}20`,
        }}
      >
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-lg leading-none">{deck.icon}</span>
            <span className="text-sm font-bold" style={{ color: deck.textColor }}>
              {deck.title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {readCount > 0 && (
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{ backgroundColor: deck.color + '15', color: deck.color }}
              >
                <Zap size={8} />
                {pct}%
              </span>
            )}
            <button
              onClick={() => setSprintMode(true)}
              className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded-xl transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: deck.color, color: '#fff' }}
              title="Sprint Mode — focused card flipper"
            >
              <Zap size={11} />
              Sprint
            </button>
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ backgroundColor: deck.bgColor, color: deck.textColor }}
            >
              {deck.cardCount}
            </span>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="px-4 pt-4 space-y-4 max-w-2xl mx-auto">
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

        {/* How To Start */}
        {intro && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <HowToStartCard deck={deck} intro={intro} />
          </motion.div>
        )}

        {/* Decision guide */}
        {intro?.systemNodes && intro.systemNodes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <SystemCard deck={deck} intro={intro} />
          </motion.div>
        )}

        {/* Categories — now filters the card list */}
        {intro && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <CategoriesCard
              deck={deck}
              intro={intro}
              activeCategory={activeCategory}
              onCategorySelect={handleCategorySelect}
            />
          </motion.div>
        )}

        {/* Divider + filter / sort controls */}
        <div ref={cardListRef}>
          <div className="flex items-center gap-3 py-2">
            <div className="flex-1 h-px" style={{ backgroundColor: `${deck.color}30` }} />
            <button
              onClick={() => setShowFilters(f => !f)}
              className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-xl transition-all hover:opacity-80"
              style={{ color: deck.color, backgroundColor: deck.color + '12' }}
            >
              <SlidersHorizontal size={10} />
              Filter
              {isFiltered && (
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: deck.color }} />
              )}
            </button>
            <button
              onClick={() =>
                setSortOrder(s =>
                  s === 'default' ? 'alpha' : s === 'alpha' ? 'unread' : 'default',
                )
              }
              className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-xl transition-all hover:opacity-80"
              style={{ color: deck.color, backgroundColor: deck.color + '12' }}
              title={`Sort: ${sortOrder}`}
            >
              <ArrowUpDown size={10} />
              {sortOrder === 'default' ? 'Default' : sortOrder === 'alpha' ? 'A–Z' : 'Unread'}
            </button>
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: deck.color }}
            >
              {isFiltered ? `${cards.length} / ${allCards.length}` : `${cards.length} Cards`}
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: `${deck.color}30` }} />
          </div>

          {/* Active filter banner */}
          <AnimatePresence>
            {isFiltered && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div
                  className="flex items-center justify-between px-3 py-2 rounded-xl mb-2"
                  style={{ backgroundColor: deck.color + '12' }}
                >
                  <span className="text-[11px] font-semibold" style={{ color: deck.color }}>
                    {activeCategory ? `Showing: ${activeCategory}` : `Tag: #${activeTag}`}
                    {' '}· {cards.length} card{cards.length !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={clearFilter}
                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full transition-all hover:opacity-80"
                    style={{ backgroundColor: deck.color + '25', color: deck.color }}
                  >
                    <X size={9} />
                    Clear
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Advanced tag filter pills (opened via Filter button) */}
          <AnimatePresence>
            {showFilters && allTags.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex gap-2 flex-wrap pb-3">
                  <button
                    onClick={() => handleTagSelect(null)}
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full transition-all"
                    style={{
                      backgroundColor:
                        activeTag === null && activeCategory === null
                          ? deck.color
                          : deck.color + '15',
                      color:
                        activeTag === null && activeCategory === null ? '#fff' : deck.color,
                    }}
                  >
                    All
                  </button>
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagSelect(activeTag === tag ? null : tag)}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full transition-all"
                      style={{
                        backgroundColor: activeTag === tag ? deck.color : deck.color + '15',
                        color: activeTag === tag ? '#fff' : deck.color,
                      }}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Card list */}
        <motion.div
          key={`${activeCategory}-${activeTag}`}
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
          className="space-y-2.5"
        >
          {cards.length === 0 ? (
            <div
              className="text-center py-10 rounded-2xl"
              style={{ backgroundColor: deck.color + '08' }}
            >
              <p className="text-sm font-semibold text-stone-400">No cards match this filter.</p>
              <button
                onClick={clearFilter}
                className="mt-2 text-xs font-bold"
                style={{ color: deck.color }}
              >
                Clear filter
              </button>
            </div>
          ) : (
            cards.map((card, index) => (
              <CardListItem
                key={card.id}
                card={card}
                deck={deck}
                index={index}
                onNavigate={() => navigate(`/card/${card.id}`)}
              />
            ))
          )}
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
