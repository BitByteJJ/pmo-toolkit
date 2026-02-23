// CaseStudiesPage — Browse all case studies with filters by deck and industry
// Design: "Clarity Cards" — consistent with the rest of the app

import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Building2, Clock, Users, ChevronRight, Search, X, Filter,
} from 'lucide-react';
import { getAllCaseStudies, type CaseStudy } from '@/lib/caseStudiesData';
import { DECKS, getDeckById } from '@/lib/pmoData';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getUniqueIndustries(studies: CaseStudy[]): string[] {
  const set = new Set(studies.map(cs => cs.industry));
  return Array.from(set).sort();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CaseStudyCard({ cs, onClick }: { cs: CaseStudy; onClick: () => void }) {
  const deck = getDeckById(cs.cardId.startsWith('people') ? 'people'
    : cs.cardId.startsWith('process') ? 'process'
    : cs.cardId.startsWith('business') ? 'business'
    : cs.cardId.startsWith('M') ? 'methodologies'
    : cs.cardId.startsWith('T') ? 'tools'
    : cs.cardId.startsWith('A') ? 'techniques'
    : cs.cardId.startsWith('phase') ? 'phases'
    : 'techniques');

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28 }}
      onClick={onClick}
      className="w-full text-left bg-card rounded-2xl overflow-hidden transition-all hover:shadow-md active:scale-[0.98]"
      style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.055), 0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)' }}
    >
      {/* Deck colour accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: deck?.color ?? '#475569' }} />
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div
              className="text-[9px] font-bold uppercase tracking-widest mb-1"
              style={{ color: deck?.color ?? '#475569' }}
            >
              {deck?.title ?? 'Techniques'}
            </div>
            <h3
              className="text-[14px] font-bold text-slate-200 leading-tight"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              {cs.projectName}
            </h3>
          </div>
          <ChevronRight size={14} className="text-slate-400 shrink-0 mt-1" />
        </div>

        {/* Fictional badge */}
        {cs.fictional && (
          <div className="flex items-center gap-1 mb-2">
            <span className="text-[8px] font-bold uppercase tracking-widest text-amber-600">Fictional</span>
            <span className="text-[8px] font-semibold bg-amber-900/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded-full">Illustrative Example</span>
          </div>
        )}
        {/* Meta row */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-300">
            <Building2 size={10} style={{ color: deck?.color }} />
            {cs.organisation}
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-[11px] text-slate-300">{cs.industry}</span>
          {cs.timeframe && (
            <>
              <span className="text-slate-400">·</span>
              <span className="flex items-center gap-1 text-[11px] text-slate-300">
                <Clock size={9} />
                {cs.timeframe}
              </span>
            </>
          )}
        </div>

        {/* Challenge snippet */}
        <p className="text-[12px] text-slate-300 leading-relaxed line-clamp-2">
          {cs.challenge}
        </p>
      </div>
    </motion.button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CaseStudiesPage() {
  const [, navigate] = useLocation();
  const allStudies = useMemo(() => getAllCaseStudies(), []);
  const industries = useMemo(() => getUniqueIndustries(allStudies), [allStudies]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Map case study cardId to deckId
  function getDeckIdForCard(cardId: string): string {
    if (cardId.startsWith('people')) return 'people';
    if (cardId.startsWith('process')) return 'process';
    if (cardId.startsWith('business')) return 'business';
    if (cardId.startsWith('M')) return 'methodologies';
    if (cardId.startsWith('T')) return 'tools';
    if (cardId.startsWith('A')) return 'techniques';
    if (cardId.startsWith('phase')) return 'phases';
    return 'techniques';
  }

  const filtered = useMemo(() => {
    let result = allStudies;
    if (selectedDeck) {
      result = result.filter(cs => getDeckIdForCard(cs.cardId) === selectedDeck);
    }
    if (selectedIndustry) {
      result = result.filter(cs => cs.industry === selectedIndustry);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(cs =>
        cs.projectName.toLowerCase().includes(q) ||
        cs.organisation.toLowerCase().includes(q) ||
        cs.industry.toLowerCase().includes(q) ||
        cs.challenge.toLowerCase().includes(q) ||
        cs.outcome.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allStudies, selectedDeck, selectedIndustry, searchQuery]);

  const activeFilterCount = (selectedDeck ? 1 : 0) + (selectedIndustry ? 1 : 0);

  return (
    <div className="min-h-screen pt-12 pb-24" style={{ background: '#0a1628' }}>
      {/* Header */}
      <div className="sticky top-12 z-30 border-b" style={{ background: 'rgba(8,14,32,0.94)', backdropFilter: 'blur(20px) saturate(1.4)', WebkitBackdropFilter: 'blur(20px) saturate(1.4)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1
                className="text-[20px] font-black text-slate-100 leading-tight"
                style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}
              >
                Case Studies
              </h1>
              <p className="text-[11px] text-slate-300 font-semibold mt-0.5">
                {filtered.length} of {allStudies.length} examples · {allStudies.filter(s => !s.fictional).length} real-world, {allStudies.filter(s => s.fictional).length} illustrative
              </p>
            </div>
            <button
              onClick={() => setShowFilters(v => !v)}
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold transition-all"
              style={{
                backgroundColor: showFilters || activeFilterCount > 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
                color: '#e2e8f0',
              }}
            >
              <Filter size={12} />
              Filter
              {activeFilterCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[8px] font-bold text-white flex items-center justify-center"
                  style={{ backgroundColor: '#E11D48' }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              placeholder="Search organisations, projects, industries…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-2.5 rounded-xl bg-card text-[12px] text-slate-300 placeholder-slate-500 outline-none"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05)' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-300"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden border-t border-white/8"
            >
              <div className="max-w-2xl mx-auto px-4 py-3 space-y-3">
                {/* Deck filter */}
                <div>
                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1.5">Deck</p>
                  <div className="flex flex-wrap gap-1.5">
                    {DECKS.map(deck => (
                      <button
                        key={deck.id}
                        onClick={() => setSelectedDeck(selectedDeck === deck.id ? null : deck.id)}
                        className="px-2.5 py-1 rounded-full text-[10px] font-bold transition-all"
                        style={{
                          backgroundColor: selectedDeck === deck.id ? deck.color : deck.color + '18',
                          color: selectedDeck === deck.id ? '#fff' : deck.color,
                        }}
                      >
                        {deck.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Industry filter */}
                <div>
                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1.5">Industry</p>
                  <div className="flex flex-wrap gap-1.5">
                    {industries.map(ind => (
                      <button
                        key={ind}
                        onClick={() => setSelectedIndustry(selectedIndustry === ind ? null : ind)}
                        className="px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all"
                        style={{
                          backgroundColor: selectedIndustry === ind ? '#6366f1' : 'rgba(255,255,255,0.07)',
                          color: selectedIndustry === ind ? '#fff' : '#57534e',
                        }}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear filters */}
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => { setSelectedDeck(null); setSelectedIndustry(null); }}
                    className="text-[10px] font-bold text-slate-300 underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results */}
      <div className="max-w-2xl mx-auto px-4 pt-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen size={32} className="mx-auto text-slate-400 mb-3" />
            <p className="text-sm font-semibold text-slate-300">No case studies match your filters</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedDeck(null); setSelectedIndustry(null); }}
              className="mt-2 text-[11px] font-bold text-slate-300 underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map(cs => (
              <CaseStudyCard
                key={cs.cardId}
                cs={cs}
                onClick={() => navigate(`/card/${cs.cardId}`)}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

    </div>
  );
}
