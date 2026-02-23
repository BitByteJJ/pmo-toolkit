// PMO Toolkit Navigator — Template Library
// Landing page: AI question flow → template recommendations → browse all templates
import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Sparkles, Search, ChevronRight, X, ArrowLeft,
  LayoutGrid, Filter, CheckCircle2, Layers,
} from 'lucide-react';
import { CARDS, DECKS } from '@/lib/pmoData';
import { DECK_THEME } from '@/lib/templateFieldSchema';
import { ALL_TEMPLATES, CardTemplate } from '@/lib/templateData';

// ─── AI Question Flow ────────────────────────────────────────────────────────
interface Question {
  id: string;
  text: string;
  options: { label: string; value: string; icon?: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'goal',
    text: 'What are you trying to do right now?',
    options: [
      { label: 'Plan or kick off a project', value: 'planning', icon: '🗺️' },
      { label: 'Track progress or report status', value: 'tracking', icon: '📊' },
      { label: 'Manage risks or issues', value: 'risk', icon: '⚠️' },
      { label: 'Work with my team or stakeholders', value: 'people', icon: '🤝' },
      { label: 'Close or review a project', value: 'closure', icon: '✅' },
      { label: 'Improve a process or quality', value: 'process', icon: '🔄' },
      { label: 'Estimate costs or schedule', value: 'estimation', icon: '💰' },
      { label: 'Just browse all templates', value: 'browse', icon: '📚' },
    ],
  },
  {
    id: 'context',
    text: 'What best describes your project context?',
    options: [
      { label: 'Traditional / Waterfall project', value: 'waterfall', icon: '🏗️' },
      { label: 'Agile / Scrum / Kanban project', value: 'agile', icon: '🔁' },
      { label: 'Hybrid approach', value: 'hybrid', icon: '⚖️' },
      { label: 'Not sure — show me everything', value: 'any', icon: '🌐' },
    ],
  },
];

// Maps answers to recommended card IDs
const RECOMMENDATION_MAP: Record<string, Record<string, string[]>> = {
  planning: {
    waterfall: ['phase-setup', 'T3', 'T5', 'T16', 'T6', 'T14', 'PR01'],
    agile:     ['phase-setup', 'T1', 'T2', 'T3', 'T5', 'T16', 'A86'],
    hybrid:    ['phase-setup', 'T3', 'T5', 'T16', 'T6', 'M4', 'T14'],
    any:       ['phase-setup', 'T3', 'T5', 'T16', 'T6', 'T14', 'T1'],
  },
  tracking: {
    waterfall: ['phase-execution', 'T9', 'T10', 'T11', 'T12', 'PR04', 'A65'],
    agile:     ['phase-execution', 'T1', 'T2', 'T22', 'T23', 'A86', 'T10'],
    hybrid:    ['phase-execution', 'T9', 'T10', 'T11', 'T12', 'T22', 'T23'],
    any:       ['phase-execution', 'T9', 'T10', 'T11', 'T12', 'T22', 'T23'],
  },
  risk: {
    waterfall: ['T6', 'T7', 'A47', 'A48', 'PR06', 'A64', 'T8'],
    agile:     ['T6', 'T7', 'A47', 'A48', 'A86', 'T8'],
    hybrid:    ['T6', 'T7', 'A47', 'A48', 'PR06', 'T8'],
    any:       ['T6', 'T7', 'A47', 'A48', 'PR06', 'T8', 'A64'],
  },
  people: {
    waterfall: ['T5', 'T16', 'people-1', 'people-2', 'people-3', 'people-8', 'people-9'],
    agile:     ['T5', 'people-1', 'people-2', 'people-4', 'people-6', 'people-14', 'people-18'],
    hybrid:    ['T5', 'T16', 'people-1', 'people-2', 'people-3', 'people-9', 'people-14'],
    any:       ['T5', 'T16', 'people-1', 'people-2', 'people-3', 'people-6', 'people-9'],
  },
  closure: {
    waterfall: ['phase-closure', 'PR16', 'A58', 'T13', 'business-5'],
    agile:     ['phase-closure', 'A86', 'A58', 'T13'],
    hybrid:    ['phase-closure', 'PR16', 'A58', 'T13', 'business-5'],
    any:       ['phase-closure', 'PR16', 'A58', 'T13', 'business-5'],
  },
  process: {
    waterfall: ['PR07', 'A7', 'A65', 'T8', 'A66', 'business-1', 'T15'],
    agile:     ['A7', 'A86', 'T8', 'A66', 'T15'],
    hybrid:    ['PR07', 'A7', 'A65', 'T8', 'A66', 'T15'],
    any:       ['PR07', 'A7', 'A65', 'T8', 'A66', 'T15', 'business-1'],
  },
  estimation: {
    waterfall: ['T17', 'T18', 'T19', 'T20', 'T33', 'T34', 'T35', 'A93'],
    agile:     ['T17', 'T22', 'T23', 'T33', 'T34', 'A93'],
    hybrid:    ['T17', 'T18', 'T19', 'T20', 'T33', 'T34', 'T35', 'A93'],
    any:       ['T17', 'T18', 'T19', 'T20', 'T33', 'T34', 'T35', 'A93'],
  },
  browse: {
    any: [],
  },
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function TemplateLibrary() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<'intro' | 'q1' | 'q2' | 'results' | 'browse'>('intro');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDeck, setActiveDeck] = useState<string>('all');

  const allTemplates = useMemo(() => ALL_TEMPLATES, []);

  // Build card lookup map
  const cardMap = useMemo(() => {
    const m: Record<string, typeof CARDS[0]> = {};
    CARDS.forEach(c => { m[c.id] = c; });
    return m;
  }, []);

  // Get recommended card IDs from answers
  const recommendedIds = useMemo(() => {
    if (step !== 'results') return [];
    const goal = answers.goal || 'browse';
    const context = answers.context || 'any';
    if (goal === 'browse') return [];
    const byGoal = RECOMMENDATION_MAP[goal] || {};
    return byGoal[context] || byGoal['any'] || [];
  }, [answers, step]);

  // Filter templates for browse view
  const filteredTemplates = useMemo(() => {
    return allTemplates.filter((t: CardTemplate) => {
      const card = cardMap[t.cardId];
      if (!card) return false;
      if (activeDeck !== 'all' && card.deckId !== activeDeck) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          card.title.toLowerCase().includes(q) ||
          (card.tags || []).some((tag: string) => tag.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [allTemplates, cardMap, activeDeck, searchQuery]);

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    if (questionId === 'goal') {
      if (value === 'browse') {
        setStep('browse');
      } else {
        setStep('q2');
      }
    } else if (questionId === 'context') {
      setStep('results');
    }
  };

  const reset = () => {
    setAnswers({});
    setStep('intro');
  };

  return (
    <div className="min-h-screen pb-28" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f2040 100%)' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 px-4 py-3 flex items-center gap-3"
        style={{ background: 'rgba(10,22,40,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <button onClick={() => navigate('/')} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
          <ArrowLeft size={18} className="text-slate-300" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0284C7, #0ea5e9)' }}>
            <FileText size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>Template Library</h1>
            <p className="text-[10px] text-slate-400">{allTemplates.length} fillable templates</p>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          {step !== 'intro' && (
            <button onClick={reset} className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/10">
              <X size={12} /> Reset
            </button>
          )}
          <button
            onClick={() => setStep('browse')}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#94a3b8' }}
          >
            <LayoutGrid size={12} /> Browse All
          </button>
        </div>
      </div>

      <div className="px-4 pt-4">
        <AnimatePresence mode="wait">

          {/* ── INTRO ── */}
          {step === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {/* Hero */}
              <div className="rounded-2xl p-6 mb-5 text-center relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0284C7 0%, #0ea5e9 50%, #38bdf8 100%)' }}>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, #fff 0%, transparent 60%)' }} />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                    <FileText size={32} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                    Ready-to-Use PM Templates
                  </h2>
                  <p className="text-blue-100 text-sm leading-relaxed max-w-xs mx-auto">
                    Fill in online, then download as a professionally formatted PDF or Word document — branded with your tool's colour and copyright.
                  </p>
                </div>
              </div>

              {/* Feature tiles */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { icon: '🎯', label: 'AI-guided', sub: 'Finds the right template for your situation' },
                  { icon: '✏️', label: 'Fillable', sub: 'Rich fields, dynamic rows, date pickers' },
                  { icon: '⬇️', label: 'Download', sub: 'PDF or Word with branding & copyright' },
                ].map(f => (
                  <div key={f.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="text-2xl mb-1">{f.icon}</div>
                    <div className="text-xs font-bold text-white mb-0.5">{f.label}</div>
                    <div className="text-[10px] text-slate-400 leading-tight">{f.sub}</div>
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep('q1')}
                  className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #0284C7, #0ea5e9)', boxShadow: '0 4px 20px rgba(2,132,199,0.4)' }}
                >
                  <Sparkles size={18} />
                  Find My Template
                  <ChevronRight size={16} />
                </motion.button>
                <button
                  onClick={() => setStep('browse')}
                  className="w-full py-3 rounded-2xl font-semibold text-slate-300 flex items-center justify-center gap-2"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
                >
                  <LayoutGrid size={16} />
                  Browse All {allTemplates.length} Templates
                </button>
              </div>

              {/* Deck quick-links */}
              <div className="mt-5">
                <p className="text-xs text-slate-500 mb-3 font-semibold uppercase tracking-wider">Browse by Deck</p>
                <div className="grid grid-cols-2 gap-2">
                  {DECKS.map(deck => {
                    const theme = DECK_THEME[deck.id];
                    const count = allTemplates.filter((t: CardTemplate) => cardMap[t.cardId]?.deckId === deck.id).length;
                    return (
                      <motion.button
                        key={deck.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { setActiveDeck(deck.id); setStep('browse'); }}
                        className="flex items-center gap-2 p-3 rounded-xl text-left"
                        style={{ background: theme.bg + '22', border: `1px solid ${theme.color}33` }}
                      >
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: theme.color + '22' }}>
                          <Layers size={14} style={{ color: theme.color }} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate" style={{ color: theme.color }}>{deck.title}</div>
                          <div className="text-[10px] text-slate-500">{count} templates</div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── QUESTION 1 ── */}
          {step === 'q1' && (
            <motion.div key="q1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <QuestionCard
                question={QUESTIONS[0]}
                stepLabel="Step 1 of 2"
                onAnswer={v => handleAnswer('goal', v)}
                onBack={() => setStep('intro')}
              />
            </motion.div>
          )}

          {/* ── QUESTION 2 ── */}
          {step === 'q2' && (
            <motion.div key="q2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <QuestionCard
                question={QUESTIONS[1]}
                stepLabel="Step 2 of 2"
                onAnswer={v => handleAnswer('context', v)}
                onBack={() => setStep('q1')}
              />
            </motion.div>
          )}

          {/* ── RESULTS ── */}
          {step === 'results' && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 size={20} className="text-emerald-400" />
                <div>
                  <h2 className="text-base font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>Recommended Templates</h2>
                  <p className="text-xs text-slate-400">{recommendedIds.length} templates matched your situation</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 mb-5">
                {recommendedIds.map((id, idx) => {
                  const card = cardMap[id];
                  const template = allTemplates.find(t => t.cardId === id);
                  if (!card || !template) return null;
                  const theme = DECK_THEME[card.deckId] || DECK_THEME.tools;
                  return (
                    <TemplateCard
                      key={id}
                      card={card}
                      template={template}
                      theme={theme}
                      rank={idx + 1}
                      onOpen={() => navigate(`/templates/${id}`)}
                    />
                  );
                })}
              </div>
              <button
                onClick={() => setStep('browse')}
                className="w-full py-3 rounded-xl text-sm font-semibold text-slate-300 flex items-center justify-center gap-2"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}
              >
                <LayoutGrid size={14} /> Browse All Templates
              </button>
            </motion.div>
          )}

          {/* ── BROWSE ALL ── */}
          {step === 'browse' && (
            <motion.div key="browse" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {/* Search */}
              <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search templates…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X size={14} className="text-slate-500" />
                  </button>
                )}
              </div>

              {/* Deck filter pills */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                <button
                  onClick={() => setActiveDeck('all')}
                  className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                  style={activeDeck === 'all'
                    ? { background: '#0284C7', color: '#fff' }
                    : { background: 'rgba(255,255,255,0.07)', color: '#94a3b8' }}
                >
                  All ({allTemplates.length})
                </button>
                {DECKS.map(deck => {
                  const count = allTemplates.filter((t: CardTemplate) => cardMap[t.cardId]?.deckId === deck.id).length;
                  const theme = DECK_THEME[deck.id];
                  return (
                    <button
                      key={deck.id}
                      onClick={() => setActiveDeck(deck.id)}
                      className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                      style={activeDeck === deck.id
                        ? { background: theme.color, color: '#fff' }
                        : { background: 'rgba(255,255,255,0.07)', color: '#94a3b8' }}
                    >
                      {deck.title} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Results count */}
              <p className="text-xs text-slate-500 mb-3">
                {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
                {activeDeck !== 'all' ? ` in ${DECKS.find(d => d.id === activeDeck)?.title}` : ''}
                {searchQuery ? ` matching "${searchQuery}"` : ''}
              </p>

              {/* Template grid */}
              <div className="flex flex-col gap-3">
                {filteredTemplates.map(template => {
                  const card = cardMap[template.cardId];
                  if (!card) return null;
                  const theme = DECK_THEME[card.deckId] || DECK_THEME.tools;
                  return (
                    <TemplateCard
                      key={template.cardId}
                      card={card}
                      template={template}
                      theme={theme}
                      onOpen={() => navigate(`/templates/${template.cardId}`)}
                    />
                  );
                })}
                {filteredTemplates.length === 0 && (
                  <div className="text-center py-12">
                    <FileText size={32} className="text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">No templates found</p>
                    <button onClick={() => { setSearchQuery(''); setActiveDeck('all'); }} className="text-blue-400 text-xs mt-2 underline">Clear filters</button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function QuestionCard({
  question, stepLabel, onAnswer, onBack,
}: {
  question: Question;
  stepLabel: string;
  onAnswer: (value: string) => void;
  onBack: () => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
          <ArrowLeft size={16} className="text-slate-400" />
        </button>
        <span className="text-xs text-slate-500 font-semibold">{stepLabel}</span>
      </div>
      <div className="rounded-2xl p-5 mb-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={16} className="text-yellow-400" />
          <span className="text-xs text-yellow-400 font-semibold">AI Template Finder</span>
        </div>
        <h2 className="text-lg font-bold text-white leading-snug" style={{ fontFamily: 'Sora, sans-serif' }}>
          {question.text}
        </h2>
      </div>
      <div className="flex flex-col gap-2">
        {question.options.map(opt => (
          <motion.button
            key={opt.value}
            whileTap={{ scale: 0.97 }}
            onClick={() => onAnswer(opt.value)}
            className="flex items-center gap-3 p-4 rounded-xl text-left transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
          >
            {opt.icon && <span className="text-xl shrink-0">{opt.icon}</span>}
            <span className="text-sm font-semibold text-slate-200">{opt.label}</span>
            <ChevronRight size={14} className="text-slate-500 ml-auto shrink-0" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function TemplateCard({
  card, template, theme, rank, onOpen,
}: {
  card: typeof CARDS[0];
  template: CardTemplate;
  theme: { color: string; bg: string; text: string; title: string };
  rank?: number;
  onOpen: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onOpen}
      className="flex items-start gap-3 p-4 rounded-2xl text-left w-full"
      style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${theme.color}33` }}
    >
      {/* Rank badge */}
      {rank && (
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5"
          style={{ backgroundColor: theme.color }}>
          {rank}
        </div>
      )}
      {/* Deck colour dot */}
      {!rank && (
        <div className="w-3 h-3 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: theme.color }} />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{ backgroundColor: theme.color + '22', color: theme.color }}>
            {card.id}
          </span>
          <span className="text-[10px] text-slate-500">{theme.title}</span>
        </div>
        <h3 className="text-sm font-bold text-white leading-snug mb-0.5" style={{ fontFamily: 'Sora, sans-serif' }}>
          {template.title}
        </h3>
        <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{template.description}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-[10px] text-slate-500">{template.sections.length} sections</span>
          <span className="text-[10px] text-slate-500">•</span>
          <span className="text-[10px] text-slate-500">PDF + Word download</span>
        </div>
      </div>
      <ChevronRight size={16} className="text-slate-500 shrink-0 mt-1" />
    </motion.button>
  );
}
