// PMO Toolkit Navigator — Search Page
// Design: "Clarity Cards" — live search with deck-color results

import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Bookmark, BookmarkCheck } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { searchCards, getDeckById, DECKS, getCardsByDeck } from '@/lib/pmoData';
import { useBookmarks } from '@/contexts/BookmarksContext';
import { getCardLevel, LEVEL_LABELS, LEVEL_COLORS, DifficultyLevel } from '@/lib/cardLevels';

const DECK_FILTERS = [
  { id: 'all', label: 'All' },
  ...DECKS.map(d => ({ id: d.id, label: d.icon + ' ' + d.title.split(' ')[0] })),
];

export default function SearchPage() {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState('');
  const [activeDeck, setActiveDeck] = useState('all');
  const [activeLevel, setActiveLevel] = useState<DifficultyLevel | null>(null);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const results = useMemo(() => {
    let cards = query.trim().length > 0 ? searchCards(query) : [];
    if (activeDeck !== 'all') {
      cards = cards.filter(c => c.deckId === activeDeck);
    }
    if (activeLevel) {
      cards = cards.filter(c => getCardLevel(c.id) === activeLevel);
    }
    return cards;
  }, [query, activeDeck, activeLevel]);

  const popularSearches = ['RACI', 'risk', 'stakeholder', 'Agile', 'SWOT', 'communication', 'change', 'Kanban'];

  return (
    <div className="min-h-screen pt-12 pb-24" style={{ background: '#0a1628' }}>
      {/* Header — sticky below TopNav */}
      <div
        className="pb-3 sticky top-12 z-30"
        style={{
          paddingTop: '12px',
          background: 'rgba(19,24,42,0.96)',
          backdropFilter: 'blur(20px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
          borderBottom: '1.5px solid rgba(0,0,0,0.06)',
        }}
      >
        <div className="max-w-2xl mx-auto px-4">
        <h1
          className="text-xl font-bold text-slate-100 mb-3"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Search
        </h1>
        {/* Search input */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tools, techniques, frameworks…"
            className="w-full bg-card rounded-xl pl-9 pr-9 py-2.5 text-sm text-slate-200 placeholder:text-slate-300 outline-none transition-all"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05)' }}
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-300 transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Difficulty level filter pills */}
        <div className="flex gap-2 mt-2.5 flex-wrap">
          {(['beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map(lvl => {
            const lc = LEVEL_COLORS[lvl];
            const isActive = activeLevel === lvl;
            return (
              <button
                key={lvl}
                onClick={() => setActiveLevel(prev => prev === lvl ? null : lvl)}
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
        {/* Deck filter chips */}
        <div className="flex gap-1.5 mt-2 overflow-x-auto pb-0.5 scrollbar-hide -mx-4 px-4">
          {DECK_FILTERS.map(f => {
            const deck = DECKS.find(d => d.id === f.id);
            const isActive = activeDeck === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveDeck(f.id)}
                className="shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full transition-all"
                style={
                  isActive
                    ? { backgroundColor: deck?.color ?? '#1C1917', color: '#fff' }
                    : { backgroundColor: '#162035', color: '#94a3b8' }
                }
              >
                {f.label}
              </button>
            );
          })}
        </div>
        </div>{/* /max-w-2xl */}
      </div>

      <div className="px-4 pt-4 max-w-2xl mx-auto">
        {/* Empty state — no query */}
        {!query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            <div>
              <h2 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2.5">
                Popular Searches
              </h2>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map(s => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="text-xs px-3 py-1.5 bg-card rounded-xl text-slate-300 font-medium hover:shadow-md transition-all active:scale-95"
                    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2.5">
                Browse by Deck
              </h2>
              <div className="space-y-2">
                {DECKS.map(deck => (
                  <button
                    key={deck.id}
                    onClick={() => navigate(`/deck/${deck.id}`)}
                    className="w-full flex items-center gap-3 rounded-2xl p-3 transition-all hover:scale-[1.01] active:scale-[0.98]"
                    style={{
                      backgroundColor: deck.bgColor,
                      borderLeft: `3px solid ${deck.color}`,
                      boxShadow: `0 1px 3px ${deck.color}18`,
                    }}
                  >
                    <span className="text-xl">{deck.icon}</span>
                    <div className="flex-1 text-left">
                      <span className="text-sm font-semibold" style={{ color: deck.textColor }}>{deck.title}</span>
                    </div>
                    <span className="text-[10px] font-medium opacity-50" style={{ color: deck.textColor }}>
                      {getCardsByDeck(deck.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {query && (
          <div>
            <p className="text-[11px] text-slate-300 font-semibold mb-3">
              {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
            </p>
            <AnimatePresence>
              {results.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-slate-300 text-sm">No cards match your search.</p>
                  <p className="text-slate-400 text-xs mt-1">Try different keywords or browse by deck.</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  {results.map((card, i) => {
                    const deck = getDeckById(card.deckId);
                    const bookmarked = isBookmarked(card.id);
                    return (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.025 }}
                      >
                        <div
                          className="bg-card rounded-2xl overflow-hidden"
                          style={{
                            borderLeft: `4px solid ${deck?.color ?? '#ccc'}`,
                            boxShadow: '0 2px 10px rgba(0,0,0,0.055), 0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)',
                          }}
                        >
                          <div
                            onClick={() => navigate(`/card/${card.id}`)}
                            className="w-full text-left p-4 pr-2 cursor-pointer"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span
                                    className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                                    style={{ backgroundColor: deck?.bgColor, color: deck?.textColor }}
                                  >
                                    {card.code}
                                  </span>
                                  <span className="text-[9px] text-slate-300 font-medium capitalize">{card.type}</span>
                                </div>
                                <h3 className="text-sm font-semibold text-slate-200 leading-tight">{card.title}</h3>
                                <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">{card.tagline}</p>
                              </div>
                              <button
                                onClick={e => { e.stopPropagation(); toggleBookmark(card.id); }}
                                className="shrink-0 p-2 rounded-xl hover:bg-white/5 transition-colors"
                              >
                                {bookmarked ? (
                                  <BookmarkCheck size={15} className="text-rose-500" />
                                ) : (
                                  <Bookmark size={15} className="text-slate-400" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
