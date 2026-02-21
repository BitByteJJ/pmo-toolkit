// GlossaryPage — Searchable A–Z PM jargon buster
// Design: "Clarity Cards" — warm white, category colour wayfinding, Sora headings

import { useState, useMemo, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, BookMarked, ChevronRight, Tag } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import {
  GLOSSARY_TERMS,
  GLOSSARY_LETTERS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  searchTerms,
  getTermsByLetter,
  type GlossaryTerm,
  type GlossaryCategory,
} from '@/lib/glossaryData';
import { getCardById, getDeckById } from '@/lib/pmoData';

// ─── Term Card ────────────────────────────────────────────────────────────────

function TermCard({ term, onCardClick }: { term: GlossaryTerm; onCardClick: (cardId: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const colors = CATEGORY_COLORS[term.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: `1.5px solid ${colors.border}18` }}
    >
      {/* Left accent bar */}
      <div className="flex">
        <div className="w-1 shrink-0 rounded-l-2xl" style={{ backgroundColor: colors.border }} />
        <div className="flex-1 p-4">
          {/* Header */}
          <button
            className="w-full text-left"
            onClick={() => setExpanded(v => !v)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3
                    className="text-[14px] font-bold text-stone-800"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    {term.term}
                  </h3>
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: colors.bg, color: colors.text }}
                  >
                    {CATEGORY_LABELS[term.category]}
                  </span>
                </div>
                <p className={`text-[12px] text-stone-500 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
                  {term.definition}
                </p>
              </div>
              <ChevronRight
                size={14}
                className="text-stone-300 shrink-0 mt-0.5 transition-transform"
                style={{ transform: expanded ? 'rotate(90deg)' : 'none' }}
              />
            </div>
          </button>

          {/* Expanded: related cards + see also */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-2">
                  {/* Related cards */}
                  {term.relatedCards.length > 0 && (
                    <div>
                      <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">
                        Related Cards
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {term.relatedCards.map(cardId => {
                          const card = getCardById(cardId);
                          const deck = card ? getDeckById(card.deckId) : undefined;
                          if (!card) return null;
                          return (
                            <button
                              key={cardId}
                              onClick={() => onCardClick(cardId)}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all hover:opacity-80 active:scale-95"
                              style={{
                                backgroundColor: deck ? deck.color + '18' : '#f5f3ee',
                                color: deck ? deck.color : '#57534e',
                              }}
                            >
                              <span className="font-mono">{card.code}</span>
                              <span className="font-semibold opacity-80">{card.title}</span>
                              <ChevronRight size={9} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* See also */}
                  {term.seeAlso && term.seeAlso.length > 0 && (
                    <div>
                      <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">
                        See Also
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {term.seeAlso.map(id => {
                          const related = GLOSSARY_TERMS.find(t => t.id === id);
                          if (!related) return null;
                          return (
                            <span
                              key={id}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: '#f5f3ee', color: '#78716c' }}
                            >
                              {related.term}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function GlossaryPage() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory | null>(null);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const categories = Object.keys(CATEGORY_LABELS) as GlossaryCategory[];

  const filtered = useMemo(() => {
    let result = GLOSSARY_TERMS;
    if (searchQuery.trim()) {
      result = searchTerms(searchQuery);
    } else if (activeLetter) {
      result = getTermsByLetter(activeLetter);
    } else {
      result = [...GLOSSARY_TERMS].sort((a, b) => a.term.localeCompare(b.term));
    }
    if (selectedCategory) {
      result = result.filter(t => t.category === selectedCategory);
    }
    return result;
  }, [searchQuery, activeLetter, selectedCategory]);

  // Group by first letter when not searching
  const grouped = useMemo(() => {
    if (searchQuery.trim() || selectedCategory) return null;
    const map: Record<string, GlossaryTerm[]> = {};
    filtered.forEach(t => {
      const letter = t.term[0].toUpperCase();
      if (!map[letter]) map[letter] = [];
      map[letter].push(t);
    });
    return map;
  }, [filtered, searchQuery, selectedCategory]);

  function scrollToLetter(letter: string) {
    setActiveLetter(letter);
    setSearchQuery('');
    setTimeout(() => {
      letterRefs.current[letter]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#F5F3EE' }}>
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#F5F3EE]/95 backdrop-blur-sm border-b border-stone-100">
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-3">
          <div className="mb-3">
            <h1
              className="text-[20px] font-black text-stone-900 leading-tight"
              style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}
            >
              Glossary
            </h1>
            <p className="text-[11px] text-stone-400 font-semibold mt-0.5">
              {GLOSSARY_TERMS.length} PM terms explained in plain English
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search terms and definitions…"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setActiveLetter(null); }}
              className="w-full pl-8 pr-8 py-2.5 rounded-xl bg-white text-[12px] text-stone-700 placeholder-stone-400 outline-none"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Category filter pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            <button
              onClick={() => setSelectedCategory(null)}
              className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all"
              style={{
                backgroundColor: !selectedCategory ? '#1c1917' : '#1c191712',
                color: !selectedCategory ? '#fff' : '#57534e',
              }}
            >
              All
            </button>
            {categories.map(cat => {
              const colors = CATEGORY_COLORS[cat];
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(active ? null : cat)}
                  className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all"
                  style={{
                    backgroundColor: active ? colors.border : colors.bg,
                    color: active ? '#fff' : colors.text,
                  }}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              );
            })}
          </div>
        </div>

        {/* A–Z index bar */}
        {!searchQuery && !selectedCategory && (
          <div className="max-w-2xl mx-auto px-4 pb-2">
            <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {GLOSSARY_LETTERS.map(letter => (
                <button
                  key={letter}
                  onClick={() => scrollToLetter(letter)}
                  className="shrink-0 w-7 h-7 rounded-lg text-[11px] font-black transition-all"
                  style={{
                    backgroundColor: activeLetter === letter ? '#1c1917' : '#1c191710',
                    color: activeLetter === letter ? '#fff' : '#78716c',
                  }}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <BookMarked size={32} className="mx-auto text-stone-300 mb-3" />
            <p className="text-sm font-semibold text-stone-400">No terms match your search</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory(null); setActiveLetter(null); }}
              className="mt-2 text-[11px] font-bold text-stone-400 underline"
            >
              Clear filters
            </button>
          </div>
        ) : searchQuery.trim() || selectedCategory ? (
          // Flat list when searching or filtering
          <div className="space-y-2.5">
            <p className="text-[10px] font-semibold text-stone-400 mb-3">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </p>
            <AnimatePresence mode="popLayout">
              {filtered.map(term => (
                <TermCard
                  key={term.id}
                  term={term}
                  onCardClick={id => navigate(`/card/${id}`)}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          // Grouped by letter
          <div className="space-y-6 pb-4">
            {Object.entries(grouped ?? {}).sort(([a], [b]) => a.localeCompare(b)).map(([letter, terms]) => (
              <div
                key={letter}
                ref={el => { letterRefs.current[letter] = el; }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-[14px] font-black"
                    style={{ backgroundColor: '#1c191712', color: '#1c1917' }}
                  >
                    {letter}
                  </div>
                  <div className="flex-1 h-px bg-stone-200" />
                  <span className="text-[10px] text-stone-400 font-semibold">{terms.length}</span>
                </div>
                <div className="space-y-2">
                  {terms.map(term => (
                    <TermCard
                      key={term.id}
                      term={term}
                      onCardClick={id => navigate(`/card/${id}`)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
