// PMO Toolkit Navigator — Deck View
// Design: "Clarity Cards" — deck view with illustrated title card, intro cards, and card list
// Structure: bold cover → how to start → categories (interactive filter) → individual cards
// Features: Sprint Mode, category filter, tag filter, sort, read tracking, in-list bookmarks

import { useRoute, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark, BookmarkCheck, ChevronDown, ChevronUp,
  Lightbulb, Layers, Compass, CheckCircle2, Zap, Star,
  SlidersHorizontal, ArrowUpDown, X,
} from 'lucide-react';
import { useState, useMemo, useRef, useCallback } from 'react';
import { getCardsByDeck, getDeckById } from '@/lib/pmoData';
import { getCardLevel, LEVEL_LABELS, LEVEL_COLORS, DifficultyLevel } from '@/lib/cardLevels';
import { getCardIllustration } from '@/lib/toolImages';
import { getDeckIntro } from '@/lib/deckIntroData';
import { useBookmarks } from '@/contexts/BookmarksContext';
import { useCardProgress } from '@/hooks/useCardProgress';
import SprintMode from '@/components/SprintMode';
import { CARDS_WITH_CASE_STUDIES } from '@/lib/caseStudiesData';
import { BookOpen } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import PageFooter from '@/components/PageFooter';

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28 } },
};

// ─── Title Cover Card ──────────────────────────────────────────────────────────
function TitleCard({
  deck,
  intro,
  isDark,
}: {
  deck: NonNullable<ReturnType<typeof getDeckById>>;
  intro: NonNullable<ReturnType<typeof getDeckIntro>>;
  isDark: boolean;
}) {
  const cardBg = isDark ? '#0f1c30' : '#ffffff';
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        borderRadius: '20px',
        boxShadow: isDark
          ? '0 12px 40px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3)'
          : '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
        border: `2px solid ${deck.color}50`,
        backgroundColor: cardBg,
      }}
    >
      {/* Base layer */}
      <div className="absolute inset-0" style={{ backgroundColor: cardBg, zIndex: 0 }} />

      {/* Full-height illustration */}
      <img
        src={intro.coverImage}
        alt={deck.title}
        className="w-full block"
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          position: 'relative',
          zIndex: 1,
          mixBlendMode: isDark ? 'screen' : 'multiply',
          opacity: isDark ? 0.9 : 0.75,
          filter: isDark
            ? 'invert(1) grayscale(1) brightness(1.15) contrast(1.2)'
            : 'grayscale(1) brightness(0.9) contrast(1.1)',
        }}
      />

      {/* Text overlay at the top */}
      <div
        className="absolute inset-x-0 top-0 z-10 px-6 pt-5 pb-16 text-center"
        style={{
          background: isDark
            ? `linear-gradient(to bottom, #0f1c30 0%, #0f1c30CC 50%, transparent 100%)`
            : `linear-gradient(to bottom, ${deck.color}18 0%, rgba(255,255,255,0.85) 50%, transparent 100%)`,
        }}
      >
        <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: deck.color }}>
          {deck.subtitle}
        </p>
        <h1
          className="text-4xl font-black leading-tight tracking-tight"
          style={{ color: isDark ? deck.textColor : deck.color, fontFamily: "'Sora', sans-serif", letterSpacing: '-0.02em' }}
        >
          {deck.title}
        </h1>
        <p className="text-sm mt-3 leading-relaxed" style={{ color: isDark ? deck.textColor : '#475569', opacity: 0.85 }}>
          {intro.tagline}
        </p>
      </div>
    </div>
  );
}

// ─── Shared accordion card style ──────────────────────────────────────────────
function accordionStyle(isDark: boolean, deckColor: string) {
  return {
    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(32px) saturate(1.8)',
    WebkitBackdropFilter: 'blur(32px) saturate(1.8)',
    border: isDark ? `1px solid rgba(255,255,255,0.10)` : `1px solid rgba(0,0,0,0.08)`,
    boxShadow: isDark
      ? `0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 0 1px ${deckColor}18`
      : `0 2px 12px rgba(0,0,0,0.06), inset 0 0 0 1px ${deckColor}18`,
  };
}

// ─── How To Start Card ─────────────────────────────────────────────────────────
function HowToStartCard({
  deck,
  intro,
  isDark,
}: {
  deck: NonNullable<ReturnType<typeof getDeckById>>;
  intro: NonNullable<ReturnType<typeof getDeckIntro>>;
  isDark: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const textPrimary = isDark ? '#cbd5e1' : '#334155';
  const textSecondary = isDark ? '#94a3b8' : '#64748b';
  const headerTitle = isDark ? '#ffffff' : '#0f172a';
  const chevronColor = isDark ? '#94a3b8' : '#64748b';
  return (
    <div className="rounded-2xl overflow-hidden" style={accordionStyle(isDark, deck.color)}>
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-4 py-3.5"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: deck.color + '25', border: `1px solid ${deck.color}50` }}
          >
            <Lightbulb size={13} style={{ color: deck.color }} />
          </div>
          <span className="text-sm font-bold" style={{ color: headerTitle }}>How to start</span>
        </div>
        {expanded ? (
          <ChevronUp size={15} style={{ color: chevronColor }} />
        ) : (
          <ChevronDown size={15} style={{ color: chevronColor }} />
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
                    <p className="text-sm font-semibold" style={{ color: textPrimary }}>{item.title}</p>
                    {item.steps.map((s, j) => (
                      <p key={j} className="text-[11px] leading-relaxed mt-0.5" style={{ color: textSecondary }}>
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
  isDark,
}: {
  deck: NonNullable<ReturnType<typeof getDeckById>>;
  intro: NonNullable<ReturnType<typeof getDeckIntro>>;
  isDark: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  if (!intro.systemNodes || intro.systemNodes.length === 0) return null;
  const textPrimary = isDark ? '#cbd5e1' : '#334155';
  const textSecondary = isDark ? '#94a3b8' : '#64748b';
  const headerTitle = isDark ? '#ffffff' : '#0f172a';
  const chevronColor = isDark ? '#94a3b8' : '#64748b';
  return (
    <div className="rounded-2xl overflow-hidden" style={accordionStyle(isDark, deck.color)}>
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-4 py-3.5"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: deck.color + '25', border: `1px solid ${deck.color}50` }}
          >
            <Compass size={13} style={{ color: deck.color }} />
          </div>
          <span className="text-sm font-bold" style={{ color: headerTitle }}>Decision guide</span>
        </div>
        {expanded ? (
          <ChevronUp size={15} style={{ color: chevronColor }} />
        ) : (
          <ChevronDown size={15} style={{ color: chevronColor }} />
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
                    <p className="text-sm font-semibold" style={{ color: textPrimary }}>{node.question}</p>
                    {node.yesNext && (
                      <p className="text-[11px] mt-0.5" style={{ color: textSecondary }}>→ Yes: {node.yesNext}</p>
                    )}
                    <p className="text-[11px] mt-0.5" style={{ color: textSecondary }}>
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
  isDark,
}: {
  deck: NonNullable<ReturnType<typeof getDeckById>>;
  intro: NonNullable<ReturnType<typeof getDeckIntro>>;
  activeCategory: string | null;
  onCategorySelect: (name: string | null) => void;
  isDark: boolean;
}) {
  const [manualExpanded, setManualExpanded] = useState(false);
  if (!intro.categories || intro.categories.length === 0) return null;

  const isOpen = manualExpanded || activeCategory !== null;
  const headerTitle = isDark ? '#ffffff' : '#0f172a';
  const chevronColor = isDark ? '#94a3b8' : '#64748b';
  const textSecondary = isDark ? '#94a3b8' : '#64748b';

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        ...accordionStyle(isDark, deck.color),
        border: `1px solid ${activeCategory ? deck.color + '60' : (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)')}`,
        transition: 'border-color 0.2s',
      }}
    >
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
          <span className="text-sm font-bold" style={{ color: headerTitle }}>Categories</span>
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
          <ChevronUp size={15} style={{ color: chevronColor }} />
        ) : (
          <ChevronDown size={15} style={{ color: chevronColor }} />
        )}
      </button>

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
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  onClick={() => onCategorySelect(null)}
                  className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full transition-all"
                  style={{
                    backgroundColor: activeCategory === null ? deck.color : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.07)'),
                    color: activeCategory === null ? '#fff' : (isDark ? '#e2e8f0' : '#334155'),
                    border: activeCategory === null ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.12)'}`,
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
                        backgroundColor: isActive ? cat.color : (isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)'),
                        color: isActive ? '#fff' : (isDark ? '#e2e8f0' : '#334155'),
                        border: isActive ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.10)'}`,
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

              {activeCategory &&
                (() => {
                  const cat = intro.categories.find(c => c.name === activeCategory);
                  return cat ? (
                    <p className="text-[11px] leading-relaxed" style={{ color: textSecondary }}>
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
  isDark,
}: {
  card: ReturnType<typeof getCardsByDeck>[0];
  deck: NonNullable<ReturnType<typeof getDeckById>>;
  index: number;
  onNavigate: () => void;
  isDark: boolean;
}) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { isRead } = useCardProgress();
  const bookmarked = isBookmarked(card.id);
  const read = isRead(card.id);
  const illustration = getCardIllustration(card.id);

  const cardBg = isDark ? '#0a1628' : '#ffffff';
  const titleColor = isDark ? '#f1f5f9' : '#0f172a';
  const taglineColor = isDark ? '#94a3b8' : '#64748b';
  const metaPillBg = isDark ? 'rgba(10,22,40,0.75)' : 'rgba(255,255,255,0.9)';
  const textShadow = isDark ? '0 1px 6px rgba(10,22,40,0.9), 0 0 12px rgba(10,22,40,0.7)' : 'none';
  const bookmarkBg = isDark ? 'rgba(15,28,48,0.9)' : 'rgba(255,255,255,0.95)';

  return (
    <motion.div variants={itemVariants} className="relative">
      {/* Floating bookmark badge */}
      <button
        onClick={e => {
          e.stopPropagation();
          toggleBookmark(card.id);
        }}
        className="absolute -top-2 -right-2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-90"
        style={{
          background: bookmarked ? deck.color : bookmarkBg,
          border: `1.5px solid ${bookmarked ? deck.color : deck.color + '40'}`,
          boxShadow: bookmarked ? `0 2px 12px ${deck.color}60` : '0 2px 8px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(8px)',
        }}
        title={bookmarked ? 'Remove bookmark' : 'Bookmark this card'}
      >
        {bookmarked
          ? <BookmarkCheck size={14} style={{ color: '#fff' }} />
          : <Bookmark size={14} style={{ color: deck.color }} />}
      </button>

      {/* Card body */}
      <div
        className="relative cursor-pointer"
        style={{
          borderRadius: '18px',
          overflow: 'hidden',
          boxShadow: isDark
            ? `0 3px 18px ${deck.color}22, 0 1px 4px rgba(0,0,0,0.12), 0 0 0 1px ${read ? deck.color + '50' : deck.color + '20'}`
            : `0 2px 12px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04), 0 0 0 1px ${read ? deck.color + '50' : deck.color + '20'}`,
          minHeight: '88px',
          backgroundColor: cardBg,
        }}
        onClick={onNavigate}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && onNavigate()}
      >
        {/* Illustration */}
        {illustration && (
          <div className="absolute inset-0 pointer-events-none" style={{ overflow: 'hidden' }}>
            <img
              src={illustration}
              alt=""
              aria-hidden="true"
              style={{
                position: 'absolute',
                right: '-4px',
                top: '50%',
                transform: 'translateY(-50%)',
                height: '160%',
                width: 'auto',
                maxWidth: '58%',
                objectFit: 'contain',
                objectPosition: 'center right',
                mixBlendMode: isDark ? 'screen' : 'multiply',
                opacity: isDark ? 1 : 0.55,
                filter: isDark
                  ? 'invert(1) grayscale(1) brightness(1.7) contrast(1.25)'
                  : 'grayscale(1) brightness(0.85) contrast(1.1)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 42%)',
                maskImage: 'linear-gradient(to right, transparent 0%, black 42%)',
              }}
            />
            {/* Deck-colour tint overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to left, ${deck.color}28 0%, transparent 55%)`,
                mixBlendMode: 'normal',
              }}
            />
            {/* Text-side overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: isDark
                  ? 'linear-gradient(to right, #0a1628 0%, #0a1628 30%, rgba(10,22,40,0.82) 50%, rgba(10,22,40,0.2) 72%, transparent 100%)'
                  : 'linear-gradient(to right, #ffffff 0%, #ffffff 30%, rgba(255,255,255,0.82) 50%, rgba(255,255,255,0.2) 72%, transparent 100%)',
              }}
            />
          </div>
        )}

        {/* Frosted glass header strip */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: '52px',
            background: `linear-gradient(to bottom, ${deck.color}14 0%, transparent 100%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex items-center gap-3 px-4 py-3 pr-10">
          {/* Number / read badge */}
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 transition-colors"
            style={{
              background: read
                ? `linear-gradient(135deg, ${deck.color}cc, ${deck.color})`
                : `${deck.color}18`,
              color: read ? '#fff' : deck.color,
              border: `1px solid ${read ? 'transparent' : deck.color + '30'}`,
              boxShadow: read ? `0 2px 8px ${deck.color}50` : 'none',
            }}
          >
            {read ? <CheckCircle2 size={14} /> : index + 1}
          </div>

          <div className="flex-1 min-w-0">
            {/* Meta row */}
            <div
              className="inline-flex items-center gap-1.5 mb-1 px-2 py-0.5 rounded-full"
              style={{
                background: metaPillBg,
                backdropFilter: 'blur(20px) saturate(1.5)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${deck.color}20`,
              }}
            >
              <span className="text-[9px] font-mono font-black" style={{ color: deck.color }}>
                {card.code}
              </span>
              <span className="text-[8px]" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>·</span>
              <span className="text-[9px] font-medium capitalize" style={{ color: deck.color, opacity: 0.7 }}>
                {card.type.replace('-', ' ')}
              </span>
              {read && (
                <span className="text-[9px] font-bold" style={{ color: deck.color }}>✓</span>
              )}
              {CARDS_WITH_CASE_STUDIES.has(card.id) && (
                <span
                  className="flex items-center gap-0.5 text-[8px] font-bold px-1 py-0.5 rounded-md"
                  style={{ backgroundColor: '#0284C720', color: '#38bdf8' }}
                  title="Has case study"
                >
                  <BookOpen size={8} />
                  Case
                </span>
              )}
            </div>

            {/* Title */}
            <h3
              className="text-sm font-bold leading-tight"
              style={{ color: titleColor, textShadow }}
            >
              {card.title}
            </h3>
            <p
              className="text-[11px] mt-0.5 line-clamp-1 leading-relaxed"
              style={{ color: taglineColor, textShadow: isDark ? '0 1px 4px rgba(10,22,40,0.8)' : 'none' }}
            >
              {card.tagline}
            </p>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="h-0.5 w-full" style={{ backgroundColor: `${deck.color}50` }} />
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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [sprintMode, setSprintMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'default' | 'alpha' | 'unread'>('default');
  const [showFilters, setShowFilters] = useState(false);
  const [activeLevel, setActiveLevel] = useState<DifficultyLevel | null>(null);

  const cardListRef = useRef<HTMLDivElement>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allCards.forEach(c => c.tags?.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [allCards]);

  const activeCategoryTags = useMemo(() => {
    if (!activeCategory || !intro) return null;
    const cat = intro.categories.find(c => c.name === activeCategory);
    return cat?.filterTags ?? null;
  }, [activeCategory, intro]);

  const cards = useMemo(() => {
    let result = [...allCards];
    if (activeCategoryTags && activeCategoryTags.length > 0) {
      result = result.filter(c => c.tags?.some(t => activeCategoryTags.includes(t)));
    } else if (activeTag) {
      result = result.filter(c => c.tags?.includes(activeTag));
    }
    if (activeLevel) result = result.filter(c => getCardLevel(c.id) === activeLevel);
    if (sortOrder === 'alpha') result.sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [allCards, activeCategoryTags, activeTag, sortOrder, activeLevel]);

  const readCount = deckReadCount(allCards.map(c => c.id));
  const pct = Math.round(deckProgress(allCards.map(c => c.id)) * 100);
  const isFiltered = activeCategory !== null || activeTag !== null || activeLevel !== null;

  const handleCategorySelect = useCallback((name: string | null) => {
    setActiveCategory(name);
    setActiveTag(null);
    if (name && cardListRef.current) {
      setTimeout(() => {
        cardListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  }, []);

  const handleTagSelect = useCallback((tag: string | null) => {
    setActiveTag(tag);
    setActiveCategory(null);
  }, []);
  const handleLevelSelect = useCallback((level: DifficultyLevel | null) => {
    setActiveLevel(prev => prev === level ? null : level);
  }, []);

  const clearFilter = useCallback(() => {
    setActiveCategory(null);
    setActiveTag(null);
    setActiveLevel(null);
  }, []);

  const pageBg = isDark ? '#0a1628' : '#f0f4f8';
  const subHeaderBg = isDark ? 'rgba(10,22,40,0.88)' : 'rgba(248,250,252,0.95)';
  const deckTitleColor = isDark ? '#e2e8f0' : '#0f172a';
  const emptyTextColor = isDark ? '#94a3b8' : '#64748b';

  if (!deck) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: pageBg }}>
        <div className="text-center">
          <p className="mb-4" style={{ color: emptyTextColor }}>Deck not found</p>
          <button onClick={() => navigate('/')} className="text-blue-600 font-medium">
            Go home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 pb-24" style={{ background: pageBg }}>
      {/* Sprint Mode overlay */}
      <AnimatePresence>
        {sprintMode && (
          <SprintMode deckId={deckId} onClose={() => setSprintMode(false)} />
        )}
      </AnimatePresence>

      {/* Sticky deck sub-header */}
      <div
        className="sticky top-12 z-30 py-2"
        style={{
          background: subHeaderBg,
          backdropFilter: 'blur(20px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
          borderBottom: `1.5px solid ${deck.color}50`,
          boxShadow: isDark
            ? `0 2px 16px rgba(0,0,0,0.3), 0 1px 0 ${deck.color}20`
            : `0 2px 12px rgba(0,0,0,0.06), 0 1px 0 ${deck.color}20`,
        }}
      >
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-lg leading-none">{deck.icon}</span>
            <span className="text-sm font-bold" style={{ color: deckTitleColor }}>
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
              onClick={() => navigate(`/quiz/${deckId}`)}
              className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded-xl transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: deck.color + '20', color: deck.color }}
              title="Take the deck quiz"
            >
              <Star size={11} />
              Quiz
            </button>
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
              style={{ backgroundColor: deck.color + '22', color: deck.color }}
            >
              {deck.cardCount}
            </span>
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="px-4 pt-4 space-y-4 max-w-2xl mx-auto">
        {intro && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <TitleCard deck={deck} intro={intro} isDark={isDark} />
          </motion.div>
        )}

        {intro && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <HowToStartCard deck={deck} intro={intro} isDark={isDark} />
          </motion.div>
        )}

        {intro?.systemNodes && intro.systemNodes.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
            <SystemCard deck={deck} intro={intro} isDark={isDark} />
          </motion.div>
        )}

        {intro && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
            <CategoriesCard
              deck={deck}
              intro={intro}
              activeCategory={activeCategory}
              onCategorySelect={handleCategorySelect}
              isDark={isDark}
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

          {/* Difficulty level filter pills */}
          <div className="flex gap-2 flex-wrap pb-2">
            {(['beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map(lvl => {
              const lc = LEVEL_COLORS[lvl];
              const isActive = activeLevel === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => handleLevelSelect(lvl)}
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full transition-all"
                  style={{
                    backgroundColor: isActive ? lc.text : lc.bg,
                    color: isActive ? '#fff' : lc.text,
                    border: `1px solid ${lc.border}`,
                  }}
                >
                  {LEVEL_LABELS[lvl]}
                </button>
              );
            })}
          </div>

          {/* Advanced tag filter pills */}
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
              <p className="text-sm font-semibold" style={{ color: emptyTextColor }}>No cards match this filter.</p>
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
                isDark={isDark}
              />
            ))
          )}
        </motion.div>
      </div>
      <PageFooter />
    </div>
  );
}
