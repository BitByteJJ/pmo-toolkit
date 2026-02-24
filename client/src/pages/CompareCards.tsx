// CompareCards — Side-by-side comparison of two PM methodology cards
// Design: split-screen layout, deck-colour accents, structured attribute rows

import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  GitCompare,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Shuffle,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { CARDS, DECKS, getDeckById, getCardById, type PMOCard } from '@/lib/pmoData';
import { useTheme } from '@/contexts/ThemeContext';
import PageFooter from '@/components/PageFooter';

// ─── CARD PICKER ──────────────────────────────────────────────────────────────
function CardPicker({
  selected: selectedId,
  onSelect,
  label,
  excludeId,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
  label: string;
  excludeId: string | null;
}) {
  const { isDark } = useTheme();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [deckFilter, setDeckFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return CARDS.filter(c => {
      if (c.id === excludeId) return false;
      if (deckFilter && c.deckId !== deckFilter) return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
      );
    }).slice(0, 40);
  }, [query, deckFilter, excludeId]);

  const selected = selectedId ? getCardById(selectedId) : null;
  const selectedDeck = selected ? getDeckById(selected.deckId) : null;

  const cardBg = isDark ? 'rgba(15,28,48,0.95)' : 'rgba(255,255,255,0.98)';
  const cardBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  return (
    <div className="flex-1 min-w-0">
      {/* Selected card display */}
      {selected && selectedDeck ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl p-4 relative"
          style={{
            background: cardBg,
            border: `2px solid ${selectedDeck.color}40`,
            boxShadow: `0 4px 20px ${selectedDeck.color}20`,
          }}
        >
          <button
            onClick={() => onSelect('')}
            className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
            style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}
          >
            <X size={12} className="text-foreground" />
          </button>
          <div
            className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md inline-block mb-1.5"
            style={{ background: selectedDeck.color + '20', color: selectedDeck.color }}
          >
            {selected.code}
          </div>
          <h3
            className="text-sm font-black text-foreground leading-tight mb-1"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            {selected.title}
          </h3>
          <p className="text-[10px] text-muted-foreground line-clamp-2">{selected.tagline}</p>
          <button
            onClick={() => setOpen(true)}
            className="mt-2 text-[10px] font-bold flex items-center gap-1"
            style={{ color: selectedDeck.color }}
          >
            Change <ChevronDown size={10} />
          </button>
        </motion.div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="w-full rounded-2xl p-4 flex flex-col items-center justify-center gap-2 border-2 border-dashed transition-colors"
          style={{
            borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
            minHeight: '120px',
          }}
        >
          <BookOpen size={20} className="text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground">{label}</span>
        </button>
      )}

      {/* Picker modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.5)' }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="mt-auto rounded-t-3xl flex flex-col overflow-hidden"
              style={{
                background: isDark ? '#0d1f38' : '#ffffff',
                maxHeight: '82vh',
                height: '82vh',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-4 pt-4 pb-3 flex items-center justify-between">
                <h3 className="text-base font-black text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {label}
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
                >
                  <X size={16} className="text-foreground" />
                </button>
              </div>

              {/* Search */}
              <div className="px-4 pb-2">
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}
                >
                  <Search size={14} className="text-muted-foreground shrink-0" />
                  <input
                    autoFocus
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search cards..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  />
                  {query && (
                    <button onClick={() => setQuery('')}>
                      <X size={12} className="text-muted-foreground" />
                    </button>
                  )}
                </div>
              </div>

              {/* Deck filters */}
              <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setDeckFilter(null)}
                  className="shrink-0 px-3 py-1 rounded-full text-[10px] font-bold transition-colors"
                  style={{
                    background: !deckFilter ? 'rgba(99,102,241,0.2)' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
                    color: !deckFilter ? '#818cf8' : 'var(--muted-foreground)',
                    border: !deckFilter ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                  }}
                >
                  All
                </button>
                {DECKS.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setDeckFilter(deckFilter === d.id ? null : d.id)}
                    className="shrink-0 px-3 py-1 rounded-full text-[10px] font-bold transition-colors"
                    style={{
                      background: deckFilter === d.id ? d.color + '22' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
                      color: deckFilter === d.id ? d.color : 'var(--muted-foreground)',
                      border: deckFilter === d.id ? `1px solid ${d.color}40` : '1px solid transparent',
                    }}
                  >
                    {d.icon} {d.title.replace(' Deck', '').replace('Advanced ', '')}
                  </button>
                ))}
              </div>

              {/* Card list — min-h-0 is required for flex-1 + overflow-y-auto to work on iOS Safari */}
              <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-8" style={{ WebkitOverflowScrolling: 'touch' }}>
                {filtered.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">No cards found</p>
                ) : (
                  <div className="space-y-2">
                    {filtered.map(card => {
                      const deck = getDeckById(card.deckId);
                      if (!deck) return null;
                      return (
                        <button
                          key={card.id}
                          onClick={() => { onSelect(card.id); setOpen(false); setQuery(''); }}
                          className="w-full text-left rounded-xl p-3 flex items-center gap-3 transition-colors"
                          style={{
                            background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                            border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                          }}
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                            style={{ background: deck.color + '20' }}
                          >
                            {deck.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                                style={{ background: deck.color + '18', color: deck.color }}
                              >
                                {card.code}
                              </span>
                            </div>
                            <div className="text-sm font-bold text-foreground truncate">{card.title}</div>
                            <div className="text-[10px] text-muted-foreground truncate">{card.tagline}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── COMPARISON ROW ───────────────────────────────────────────────────────────
function CompareRow({
  label,
  left,
  right,
  leftColor,
  rightColor,
  highlight,
}: {
  label: string;
  left: string | string[];
  right: string | string[];
  leftColor: string;
  rightColor: string;
  highlight?: boolean;
}) {
  const { isDark } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const renderValue = (val: string | string[], color: string) => {
    if (Array.isArray(val)) {
      const shown = expanded ? val : val.slice(0, 3);
      return (
        <div className="space-y-1">
          {shown.map((v, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <div className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: color }} />
              <span className="text-xs text-foreground leading-relaxed">{v}</span>
            </div>
          ))}
          {val.length > 3 && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="text-[10px] font-bold flex items-center gap-1 mt-1"
              style={{ color }}
            >
              {expanded ? (
                <><ChevronUp size={10} />Show less</>
              ) : (
                <><ChevronDown size={10} />{val.length - 3} more</>
              )}
            </button>
          )}
        </div>
      );
    }
    return <p className="text-xs text-foreground leading-relaxed">{val}</p>;
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: highlight
          ? (isDark ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.04)')
          : 'transparent',
        border: highlight
          ? '1px solid rgba(99,102,241,0.15)'
          : (isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)'),
      }}
    >
      {/* Row label */}
      <div
        className="px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-center"
        style={{
          background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
          color: 'var(--muted-foreground)',
        }}
      >
        {label}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-2 divide-x" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
        <div className="p-3" style={{ borderRight: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)' }}>
          {renderValue(left, leftColor)}
        </div>
        <div className="p-3">
          {renderValue(right, rightColor)}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function CompareCards() {
  const [, navigate] = useLocation();
  const { isDark } = useTheme();
  const [leftId, setLeftId] = useState<string | null>(null);
  const [rightId, setRightId] = useState<string | null>(null);

  const leftCard = leftId ? getCardById(leftId) : null;
  const rightCard = rightId ? getCardById(rightId) : null;
  const leftDeck = leftCard ? getDeckById(leftCard.deckId) : null;
  const rightDeck = rightCard ? getDeckById(rightCard.deckId) : null;

  const canCompare = !!leftCard && !!rightCard;

  // Shuffle to random pair for inspiration
  function handleShuffle() {
    const pool = CARDS.filter(c => c.whatItIs && c.steps && c.steps.length > 0);
    const a = pool[Math.floor(Math.random() * pool.length)];
    let b = pool[Math.floor(Math.random() * pool.length)];
    while (b.id === a.id) b = pool[Math.floor(Math.random() * pool.length)];
    setLeftId(a.id);
    setRightId(b.id);
  }

  const bg = isDark
    ? 'radial-gradient(ellipse at top, rgba(99,102,241,0.06) 0%, #0a1628 60%)'
    : 'radial-gradient(ellipse at top, rgba(99,102,241,0.04) 0%, #f1f5f9 60%)';

  return (
    <div className="min-h-screen pb-32" style={{ background: bg }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3"
        style={{
          background: isDark ? 'rgba(10,22,40,0.92)' : 'rgba(241,245,249,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <button
          onClick={() => navigate('/')}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
        >
          <ArrowLeft size={16} className="text-foreground" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <GitCompare size={16} className="text-indigo-400" />
          <h1 className="text-base font-black text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
            Compare Cards
          </h1>
        </div>
        <button
          onClick={handleShuffle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
          style={{
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.25)',
            color: '#818cf8',
          }}
        >
          <Shuffle size={12} />
          Random
        </button>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Pickers */}
        <div className="flex gap-3">
          <CardPicker
            selected={leftId}
            onSelect={id => setLeftId(id || null)}
            label="Pick Card A"
            excludeId={rightId}
          />
          <div className="flex items-center justify-center shrink-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
            >
              <GitCompare size={14} className="text-muted-foreground" />
            </div>
          </div>
          <CardPicker
            selected={rightId}
            onSelect={id => setRightId(id || null)}
            label="Pick Card B"
            excludeId={leftId}
          />
        </div>

        {/* Column headers */}
        {canCompare && leftCard && rightCard && leftDeck && rightDeck && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {/* Header row */}
            <div className="grid grid-cols-2 gap-3">
              {[{ card: leftCard, deck: leftDeck }, { card: rightCard, deck: rightDeck }].map(({ card, deck }) => (
                <div
                  key={card.id}
                  className="rounded-2xl p-3 text-center"
                  style={{
                    background: deck.color + '12',
                    border: `1.5px solid ${deck.color}30`,
                  }}
                >
                  <div className="text-lg mb-1">{deck.icon}</div>
                  <div
                    className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md inline-block mb-1"
                    style={{ background: deck.color + '20', color: deck.color }}
                  >
                    {card.code}
                  </div>
                  <div
                    className="text-xs font-black text-foreground leading-tight"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    {card.title}
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison rows */}
            <CompareRow
              label="What it is"
              left={leftCard.whatItIs}
              right={rightCard.whatItIs}
              leftColor={leftDeck.color}
              rightColor={rightDeck.color}
              highlight
            />

            <CompareRow
              label="When to use"
              left={leftCard.whenToUse}
              right={rightCard.whenToUse}
              leftColor={leftDeck.color}
              rightColor={rightDeck.color}
            />

            {leftCard.steps && rightCard.steps && (
              <CompareRow
                label="Key steps"
                left={leftCard.steps}
                right={rightCard.steps}
                leftColor={leftDeck.color}
                rightColor={rightDeck.color}
              />
            )}

            {leftCard.proTip && rightCard.proTip && (
              <CompareRow
                label="Pro tip"
                left={leftCard.proTip}
                right={rightCard.proTip}
                leftColor={leftDeck.color}
                rightColor={rightDeck.color}
              />
            )}

            {leftCard.example && rightCard.example && (
              <CompareRow
                label="Example"
                left={leftCard.example}
                right={rightCard.example}
                leftColor={leftDeck.color}
                rightColor={rightDeck.color}
                highlight
              />
            )}

            {leftCard.tags && rightCard.tags && (
              <CompareRow
                label="Tags"
                left={leftCard.tags}
                right={rightCard.tags}
                leftColor={leftDeck.color}
                rightColor={rightDeck.color}
              />
            )}

            {/* Related cards */}
            {leftCard.relatedCards && rightCard.relatedCards && (
              <CompareRow
                label="Related cards"
                left={leftCard.relatedCards}
                right={rightCard.relatedCards}
                leftColor={leftDeck.color}
                rightColor={rightDeck.color}
              />
            )}

            {/* View full card links */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {[{ card: leftCard, deck: leftDeck }, { card: rightCard, deck: rightDeck }].map(({ card, deck }) => (
                <button
                  key={card.id}
                  onClick={() => navigate(`/card/${card.id}`)}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95"
                  style={{
                    background: deck.color + '18',
                    border: `1px solid ${deck.color}30`,
                    color: deck.color,
                  }}
                >
                  View full card
                  <ArrowRight size={12} />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {!canCompare && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <GitCompare size={40} className="mx-auto text-muted-foreground mb-3 opacity-40" />
            <p className="text-sm font-semibold text-muted-foreground">
              {!leftId && !rightId
                ? 'Select two cards to compare them side by side'
                : 'Select a second card to start comparing'}
            </p>
            <p className="text-xs text-muted-foreground mt-1 opacity-60">
              Or tap "Random" to discover an interesting comparison
            </p>
          </motion.div>
        )}
      </div>

      <PageFooter />
    </div>
  );
}
