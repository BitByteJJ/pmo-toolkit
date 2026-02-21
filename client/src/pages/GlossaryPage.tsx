// StratAlign — Glossary Page
// Design: "Clarity Cards" — A–Z jargon buster with card links
import { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, BookOpen, ExternalLink } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { GLOSSARY, getGlossaryLetters, getTermsByLetter, searchGlossary, GlossaryTerm } from '@/lib/glossaryData';
import { getCardById, getDeckById } from '@/lib/pmoData';

function CardChip({ cardId }: { cardId: string }) {
  const [, navigate] = useLocation();
  const card = getCardById(cardId);
  const deck = card ? getDeckById(card.deckId) : null;
  if (!card || !deck) return null;
  return (
    <button
      onClick={() => navigate(`/card/${card.id}`)}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all hover:opacity-80 active:scale-95"
      style={{ backgroundColor: deck.bgColor, color: deck.color, border: `1px solid ${deck.color}30` }}
    >
      <span className="font-mono">{card.code}</span>
      <ExternalLink size={8} />
    </button>
  );
}

function TermCard({ term }: { term: GlossaryTerm }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      layout
      className="bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
    >
      <button
        className="w-full text-left px-4 py-3 flex items-center justify-between gap-3"
        onClick={() => setExpanded(v => !v)}
      >
        <span className="text-sm font-bold text-stone-800">{term.term}</span>
        <span className="text-stone-400 shrink-0 text-xs">{expanded ? '▲' : '▼'}</span>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              <p className="text-[13px] text-stone-600 leading-relaxed">{term.definition}</p>
              {term.cardIds.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">Related cards</p>
                  <div className="flex flex-wrap gap-1.5">
                    {term.cardIds.map(id => (
                      <CardChip key={id} cardId={id} />
                    ))}
                  </div>
                </div>
              )}
              {term.tags && term.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {term.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-400 uppercase tracking-wide">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function GlossaryPage() {
  const [query, setQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const letters = getGlossaryLetters();

  const displayedTerms = query.trim()
    ? searchGlossary(query)
    : activeLetter
    ? getTermsByLetter(activeLetter)
    : GLOSSARY.slice().sort((a, b) => a.term.localeCompare(b.term));

  function clearSearch() {
    setQuery('');
    setActiveLetter(null);
    searchRef.current?.focus();
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#F7F5F0' }}>
      <div className="pt-11">
        <div className="max-w-2xl mx-auto px-4 pt-6 pb-4">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
                <BookOpen size={15} className="text-blue-600" />
              </div>
              <h1 className="text-2xl font-black text-stone-900" style={{ fontFamily: 'Sora, sans-serif' }}>
                Glossary
              </h1>
            </div>
            <p className="text-sm text-stone-500 mb-4">
              {GLOSSARY.length} plain-language definitions — tap any term to expand it
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="relative mb-4"
          >
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setActiveLetter(null); }}
              placeholder="Search terms or definitions…"
              className="w-full pl-9 pr-9 py-2.5 rounded-2xl bg-white text-sm text-stone-700 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-200"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            />
            {query && (
              <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-stone-100">
                <X size={13} className="text-stone-400" />
              </button>
            )}
          </motion.div>

          {/* A–Z letter index */}
          {!query && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.08 }}
              className="flex flex-wrap gap-1.5 mb-5"
            >
              <button
                onClick={() => setActiveLetter(null)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                  !activeLetter ? 'bg-stone-800 text-white' : 'bg-white text-stone-500 hover:bg-stone-100'
                }`}
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
              >
                All
              </button>
              {letters.map(l => (
                <button
                  key={l}
                  onClick={() => setActiveLetter(l === activeLetter ? null : l)}
                  className={`w-7 h-7 rounded-xl text-[11px] font-bold transition-all ${
                    activeLetter === l ? 'bg-stone-800 text-white' : 'bg-white text-stone-500 hover:bg-stone-100'
                  }`}
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
                >
                  {l}
                </button>
              ))}
            </motion.div>
          )}

          {/* Results */}
          <div className="space-y-2">
            {displayedTerms.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-stone-400 text-sm">No terms found for "{query}"</p>
              </div>
            ) : (
              displayedTerms.map((term, i) => (
                <motion.div
                  key={term.term}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.3) }}
                >
                  <TermCard term={term} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
