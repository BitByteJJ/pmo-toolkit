// GlossaryPage.tsx
// Two modes: Browse (A–Z, search, filter) and Checker (interactive quiz)
// Design: "Clarity Cards" — warm white, category colour wayfinding, Sora headings

import { useState, useMemo, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, BookMarked, ChevronRight, CheckCircle2, XCircle,
  Trophy, RotateCcw, Zap, Brain, BookOpen,
} from 'lucide-react';
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
import { useTheme } from '@/contexts/ThemeContext';

// ─── Term Card (Browse mode) ──────────────────────────────────────────────────

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
      className="bg-card rounded-2xl overflow-hidden"
      style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)' }}
    >
      <div className="flex">
        <div className="w-1 shrink-0 rounded-l-2xl" style={{ backgroundColor: colors.border }} />
        <div className="flex-1 p-4">
          <button className="w-full text-left" onClick={() => setExpanded(v => !v)}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-[14px] font-bold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
                    {term.term}
                  </h3>
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: colors.bg, color: colors.text }}
                  >
                    {CATEGORY_LABELS[term.category]}
                  </span>
                </div>
                <p className={`text-[12px] text-foreground leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
                  {term.definition}
                </p>
              </div>
              <ChevronRight
                size={14}
                className="text-muted-foreground shrink-0 mt-0.5 transition-transform"
                style={{ transform: expanded ? 'rotate(90deg)' : 'none' }}
              />
            </div>
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
                <div className="pt-3 space-y-2">
                  {term.relatedCards.length > 0 && (
                    <div>
                      <p className="text-[9px] font-bold text-foreground uppercase tracking-widest mb-1.5">Related Cards</p>
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
                                backgroundColor: deck ? deck.color + '18' : 'rgba(255,255,255,0.06)',
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
                  {term.seeAlso && term.seeAlso.length > 0 && (
                    <div>
                      <p className="text-[9px] font-bold text-foreground uppercase tracking-widest mb-1.5">See Also</p>
                      <div className="flex flex-wrap gap-1.5">
                        {term.seeAlso.map(id => {
                          const related = GLOSSARY_TERMS.find(t => t.id === id);
                          if (!related) return null;
                          return (
                            <span
                              key={id}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: '#78716c' }}
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

// ─── Glossary Checker ─────────────────────────────────────────────────────────

type CheckerState = 'idle' | 'playing' | 'answered' | 'finished';

interface CheckerQuestion {
  term: GlossaryTerm;
  options: string[]; // 4 option terms
  correctIndex: number;
}

function buildQuestions(count = 10): CheckerQuestion[] {
  // Shuffle and pick `count` terms
  const shuffled = [...GLOSSARY_TERMS].sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map(term => {
    // Pick 3 wrong options from remaining terms
    const others = GLOSSARY_TERMS.filter(t => t.id !== term.id);
    const wrongs = others.sort(() => Math.random() - 0.5).slice(0, 3).map(t => t.term);
    const options = [...wrongs, term.term].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(term.term);
    return { term, options, correctIndex };
  });
}

function GlossaryChecker() {
  const [state, setState] = useState<CheckerState>('idle');
  const [questions, setQuestions] = useState<CheckerQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [wrongTerms, setWrongTerms] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(10);

  const current = questions[currentIdx];

  const startGame = useCallback(() => {
    const qs = buildQuestions(questionCount);
    setQuestions(qs);
    setCurrentIdx(0);
    setSelectedIdx(null);
    setScore(0);
    setWrongTerms([]);
    setState('playing');
  }, [questionCount]);

  function handleAnswer(idx: number) {
    if (state !== 'playing') return;
    setSelectedIdx(idx);
    const correct = idx === current.correctIndex;
    if (correct) setScore(s => s + 1);
    else setWrongTerms(w => [...w, current.term.term]);
    setState('answered');
  }

  function handleNext() {
    if (currentIdx + 1 >= questions.length) {
      setState('finished');
    } else {
      setCurrentIdx(i => i + 1);
      setSelectedIdx(null);
      setState('playing');
    }
  }

  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  // ── Idle screen ──
  if (state === 'idle') {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl p-6 text-center"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)' }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
          >
            <Brain size={28} className="text-white" />
          </div>
          <h2 className="text-[20px] font-black text-slate-100 mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
            Glossary Checker
          </h2>
          <p className="text-[13px] text-foreground leading-relaxed mb-6">
            Read the definition — pick the correct PM term. Tests your vocabulary across all {GLOSSARY_TERMS.length} terms.
          </p>

          {/* Question count selector */}
          <div className="mb-6">
            <p className="text-[10px] font-bold text-foreground uppercase tracking-widest mb-2">Number of Questions</p>
            <div className="flex gap-2 justify-center">
              {[5, 10, 15, 20].map(n => (
                <button
                  key={n}
                  onClick={() => setQuestionCount(n)}
                  className="w-12 h-10 rounded-xl text-[13px] font-bold transition-all"
                  style={{
                    backgroundColor: questionCount === n ? '#7c3aed' : '#7c3aed14',
                    color: questionCount === n ? '#fff' : '#7c3aed',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full py-3.5 rounded-2xl text-[14px] font-bold text-white transition-all active:scale-98"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 4px 16px rgba(124,58,237,0.35)' }}
          >
            Start Quiz
          </button>

          {/* How it works */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { icon: BookOpen, label: 'Read the definition' },
              { icon: Zap, label: 'Pick the right term' },
              { icon: Trophy, label: 'Track your score' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                <Icon size={16} className="mx-auto mb-1.5 text-foreground" />
                <p className="text-[10px] font-semibold text-foreground leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Finished screen ──
  if (state === 'finished') {
    const grade = pct >= 90 ? 'Excellent' : pct >= 70 ? 'Good' : pct >= 50 ? 'Keep Practising' : 'Needs Work';
    const gradeColor = pct >= 90 ? '#059669' : pct >= 70 ? '#0284c7' : pct >= 50 ? '#d97706' : '#e11d48';

    return (
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-3xl p-6"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)' }}
        >
          <div className="text-center mb-6">
            <Trophy size={40} className="mx-auto mb-3" style={{ color: gradeColor }} />
            <h2 className="text-[22px] font-black text-slate-100 mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
              {grade}
            </h2>
            <p className="text-[13px] text-foreground">
              You scored <span className="font-bold" style={{ color: gradeColor }}>{score} / {questions.length}</span> ({pct}%)
            </p>
          </div>

          {/* Score ring */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke={gradeColor} strokeWidth="10"
                  strokeDasharray={`${pct * 2.51} 251`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[18px] font-black text-slate-100">{pct}%</span>
              </div>
            </div>
          </div>

          {/* Wrong terms */}
          {wrongTerms.length > 0 && (
            <div className="mb-5">
              <p className="text-[10px] font-bold text-foreground uppercase tracking-widest mb-2">
                Review These Terms ({wrongTerms.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {wrongTerms.map(t => (
                  <span
                    key={t}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: 'rgba(225,29,72,0.18)', color: '#fda4af' }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={startGame}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[13px] font-bold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
            >
              <RotateCcw size={14} />
              Try Again
            </button>
            <button
              onClick={() => setState('idle')}
              className="flex-1 py-3 rounded-2xl text-[13px] font-bold transition-all"
              style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: '#57534e' }}
            >
              Change Settings
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Playing / Answered ──
  const progress = ((currentIdx + (state === 'answered' ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 pt-4 pb-8">
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-foreground">
            Question {currentIdx + 1} of {questions.length}
          </span>
          <span className="text-[11px] font-bold" style={{ color: '#7c3aed' }}>
            {score} correct
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#7c3aed18' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: '#7c3aed' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="bg-card rounded-3xl p-5 mb-4"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)' }}
        >
          {/* Category badge */}
          <div className="mb-3">
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: CATEGORY_COLORS[current.term.category].bg,
                color: CATEGORY_COLORS[current.term.category].text,
              }}
            >
              {CATEGORY_LABELS[current.term.category]}
            </span>
          </div>

          <p className="text-[11px] font-bold text-foreground uppercase tracking-widest mb-2">
            What PM term is this?
          </p>
          <p className="text-[15px] text-foreground leading-relaxed font-medium">
            {current.term.definition}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Options */}
      <div className="space-y-2.5">
        {current.options.map((option, idx) => {
          const isSelected = selectedIdx === idx;
          const isCorrect = idx === current.correctIndex;
          const revealed = state === 'answered';

          let bg = 'rgba(255,255,255,0.06)';
          let border = 'rgba(255,255,255,0.12)';
          let textColor = '#e2e8f0';
          let icon = null;

          if (revealed) {
            if (isCorrect) {
              bg = 'rgba(34,197,94,0.15)'; border = '#22c55e'; textColor = '#4ade80';
              icon = <CheckCircle2 size={16} className="shrink-0" style={{ color: '#22c55e' }} />;
            } else if (isSelected && !isCorrect) {
              bg = 'rgba(248,113,113,0.15)'; border = '#f87171'; textColor = '#fca5a5';
              icon = <XCircle size={16} className="shrink-0" style={{ color: '#f87171' }} />;
            } else {
              bg = 'rgba(255,255,255,0.03)'; border = 'rgba(255,255,255,0.06)'; textColor = '#64748b';
            }
          }

          return (
            <motion.button
              key={option}
              whileTap={!revealed ? { scale: 0.98 } : {}}
              onClick={() => handleAnswer(idx)}
              disabled={revealed}
              className="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl text-left transition-all"
              style={{
                backgroundColor: bg,
                border: `1.5px solid ${border}`,
                color: textColor,
                boxShadow: revealed && isCorrect ? '0 2px 12px rgba(34,197,94,0.18)' : '0 1px 4px rgba(0,0,0,0.04)',
              }}
            >
              <span className="text-[13px] font-semibold">{option}</span>
              {icon}
            </motion.button>
          );
        })}
      </div>

      {/* Next button */}
      {state === 'answered' && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleNext}
          className="w-full mt-4 py-3.5 rounded-2xl text-[14px] font-bold text-white transition-all"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 4px 16px rgba(124,58,237,0.3)' }}
        >
          {currentIdx + 1 >= questions.length ? 'See Results' : 'Next Question →'}
        </motion.button>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function GlossaryPage() {
  const [, navigate] = useLocation();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'browse' | 'checker'>('browse');
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
    <div className="min-h-screen pt-12 pb-24" style={{ background: isDark ? '#0a1628' : '#f1f5f9' }}>
      {/* Sticky header */}
      <div
        className="sticky top-12 z-30 border-b"
        style={{
          background: isDark ? 'rgba(8,14,32,0.94)' : 'rgba(248,250,252,0.94)',
          backdropFilter: 'blur(20px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
          borderColor: 'rgba(0,0,0,0.06)',
        }}
      >
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1
                className="text-[20px] font-black text-slate-100 leading-tight"
                style={{ fontFamily: 'Sora, sans-serif', letterSpacing: '-0.02em' }}
              >
                Glossary
              </h1>
              <p className="text-[11px] text-foreground font-semibold mt-0.5">
                {GLOSSARY_TERMS.length} PM terms · plain English
              </p>
            </div>

            {/* Tab toggle */}
            <div
              className="flex rounded-xl overflow-hidden"
              style={{ backgroundColor: 'rgba(255,255,255,0.06)', padding: '2px' }}
            >
              {(['browse', 'checker'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                  style={{
                    backgroundColor: activeTab === tab ? (tab === 'checker' ? '#7c3aed' : '#6366f1') : 'transparent',
                    color: activeTab === tab ? '#fff' : '#78716c',
                  }}
                >
                  {tab === 'browse' ? 'Browse' : '⚡ Checker'}
                </button>
              ))}
            </div>
          </div>

          {/* Browse-only controls */}
          {activeTab === 'browse' && (
            <>
              <div className="relative mb-3">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground" />
                <input
                  type="text"
                  placeholder="Search terms and definitions…"
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setActiveLetter(null); }}
                  className="w-full pl-8 pr-8 py-2.5 rounded-xl bg-card text-[12px] text-foreground placeholder-slate-500 outline-none"
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05)' }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all"
                  style={{
                    backgroundColor: !selectedCategory ? '#6366f1' : 'rgba(255,255,255,0.07)',
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
            </>
          )}
        </div>

        {/* A–Z index bar (browse only) */}
        {activeTab === 'browse' && !searchQuery && !selectedCategory && (
          <div className="max-w-2xl mx-auto px-4 pb-2">
            <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {GLOSSARY_LETTERS.map(letter => (
                <button
                  key={letter}
                  onClick={() => scrollToLetter(letter)}
                  className="shrink-0 w-7 h-7 rounded-lg text-[11px] font-black transition-all"
                  style={{
                    backgroundColor: activeLetter === letter ? '#6366f1' : 'rgba(255,255,255,0.06)',
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
      <AnimatePresence mode="wait">
        {activeTab === 'checker' ? (
          <motion.div key="checker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GlossaryChecker />
          </motion.div>
        ) : (
          <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="max-w-2xl mx-auto px-4 pt-4">
              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <BookMarked size={32} className="mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm font-semibold text-foreground">No terms match your search</p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory(null); setActiveLetter(null); }}
                    className="mt-2 text-[11px] font-bold text-foreground underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : searchQuery.trim() || selectedCategory ? (
                <div className="space-y-2.5">
                  <p className="text-[10px] font-semibold text-foreground mb-3">
                    {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                  </p>
                  <AnimatePresence mode="popLayout">
                    {filtered.map(term => (
                      <TermCard key={term.id} term={term} onCardClick={id => navigate(`/card/${id}`)} />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="space-y-6 pb-4">
                  {Object.entries(grouped ?? {}).sort(([a], [b]) => a.localeCompare(b)).map(([letter, terms]) => (
                    <div key={letter} ref={el => { letterRefs.current[letter] = el; }}>
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-[14px] font-black"
                          style={{ backgroundColor: 'rgba(255,255,255,0.07)', color: '#e2e8f0' }}
                        >
                          {letter}
                        </div>
                        <div className="flex-1 h-px bg-white/15" />
                        <span className="text-[10px] text-foreground font-semibold">{terms.length}</span>
                      </div>
                      <div className="space-y-2">
                        {terms.map(term => (
                          <TermCard key={term.id} term={term} onCardClick={id => navigate(`/card/${id}`)} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
