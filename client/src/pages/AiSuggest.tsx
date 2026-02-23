// PMO Toolkit Navigator — AI Suggest Page
// Design: "Clarity Cards" — warm white, category colour wayfinding
// Feature: Enter a problem statement → AI returns ranked PMO card recommendations

import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, RotateCcw, Lightbulb, Send, ChevronRight } from 'lucide-react';
import { DECKS, getCardById } from '@/lib/pmoData';
import BottomNav from '@/components/BottomNav';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Recommendation {
  cardId: string;
  code: string;
  title: string;
  tagline: string;
  reason: string;
}

interface SuggestResult {
  summary: string;
  recommendations: Recommendation[];
}

// ─── Example prompts ──────────────────────────────────────────────────────────

const EXAMPLE_PROMPTS = [
  'My team keeps missing deadlines and nobody knows who is responsible for what',
  'Stakeholders keep requesting changes mid-project and scope is growing out of control',
  'Our project has a tight budget and we need to forecast whether we\'ll finish on time',
  'Team morale is low and there\'s a lot of conflict between members',
  'We need to roll out a major change to the organisation but people are resisting it',
  'I\'m not sure which project management methodology to use for my new project',
];

// ─── Recommendation Card ──────────────────────────────────────────────────────

function RecommendationCard({ rec, index }: { rec: Recommendation; index: number }) {
  const [, navigate] = useLocation();
  const card = getCardById(rec.cardId);
  const deck = card ? DECKS.find(d => d.id === card.deckId) : null;
  const accentColor = deck?.color ?? '#475569';
  const bgColor = deck ? (deck.color + '18') : 'rgba(255,255,255,0.06)';

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => card && navigate(`/card/${rec.cardId}`)}
      className="w-full text-left rounded-2xl overflow-hidden bg-card relative"
      style={{ boxShadow: `0 2px 16px ${accentColor}20, 0 1px 4px rgba(0,0,0,0.06)` }}
      whileHover={{ scale: 1.015, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: accentColor }} />

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Rank badge */}
          <div
            className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black text-white"
            style={{ backgroundColor: accentColor }}
          >
            {index + 1}
          </div>

          <div className="flex-1 min-w-0">
            {/* Code + deck label */}
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md"
                style={{ backgroundColor: deck ? (accentColor + '20') : 'rgba(255,255,255,0.06)', color: accentColor }}
              >
                {rec.code}
              </span>
              {deck && (
                <span className="text-[10px] text-slate-400 font-medium truncate">
                  {deck.title}
                </span>
              )}
            </div>

            {/* Title */}
            <h3
              className="text-base font-bold leading-tight text-slate-100 mb-1"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              {rec.title}
            </h3>

            {/* Tagline */}
            <p className="text-xs text-slate-400 mb-2 leading-relaxed">
              {rec.tagline}
            </p>

            {/* AI reason */}
            <div
              className="rounded-xl p-3 text-xs leading-relaxed"
              style={{ backgroundColor: bgColor, color: deck?.textColor ?? '#94a3b8' }}
            >
              <span className="font-semibold" style={{ color: accentColor }}>Why this helps: </span>
              {rec.reason}
            </div>
          </div>

          {/* Arrow */}
          <ChevronRight size={16} className="shrink-0 text-slate-500 mt-1" />
        </div>
      </div>
    </motion.button>
  );
}

// ─── Loading State ────────────────────────────────────────────────────────────

const THINKING_MESSAGES = [
  'Reading your challenge…',
  'Scanning 198 PMO cards…',
  'Matching tools to your problem…',
  'Ranking recommendations…',
  'Almost there…',
];

function LoadingState({ problem }: { problem: string }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cycle through messages every 1.2s
    const msgTimer = setInterval(() => {
      setMsgIndex(i => Math.min(i + 1, THINKING_MESSAGES.length - 1));
    }, 1200);
    // Animate progress bar over ~6s (typical response time)
    const start = Date.now();
    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - start;
      // Ease toward 90% over 6s, never reach 100% until done
      const pct = Math.min(90, Math.round(100 * (1 - Math.exp(-elapsed / 5000))));
      setProgress(pct);
    }, 100);
    return () => { clearInterval(msgTimer); clearInterval(progressTimer); };
  }, []);

  return (
    <div>
      {/* Problem echo */}
      <div
        className="rounded-2xl p-4 mb-5 bg-card"
        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}
      >
        <p className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider mb-1">Your challenge</p>
        <p className="text-sm text-slate-300 leading-relaxed">{problem}</p>
      </div>

      {/* Animated thinking card */}
      <div
        className="rounded-2xl p-5 mb-5 bg-card"
        style={{ boxShadow: '0 2px 16px rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.12)' }}
      >
        {/* Pulsing icon */}
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles size={18} className="text-white" />
          </motion.div>
          <div>
            <p className="text-sm font-bold text-slate-200">AI is thinking…</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={msgIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
                className="text-xs text-slate-400"
              >
                {THINKING_MESSAGES[msgIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-card/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #6366F1, #8B5CF6)' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5 text-right">{progress}%</p>
      </div>

      {/* Skeleton cards */}
      <div className="space-y-3">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="rounded-2xl overflow-hidden bg-card" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div className="h-1 w-full bg-card/15 animate-pulse" />
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-card/15 animate-pulse shrink-0" style={{ animationDelay: `${i * 0.15}s` }} />
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <div className="h-4 w-10 rounded bg-card/15 animate-pulse" />
                    <div className="h-4 w-20 rounded bg-card/10 animate-pulse" />
                  </div>
                  <div className="h-5 w-3/4 rounded bg-card/15 animate-pulse" />
                  <div className="h-3 w-full rounded bg-card/10 animate-pulse" />
                  <div className="h-12 w-full rounded-xl bg-card/10 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AiSuggest() {
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SuggestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (text?: string) => {
    const query = (text ?? problem).trim();
    if (!query || loading) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch('/api/ai-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: query }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }

      const data: SuggestResult = await res.json();
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setProblem('');
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleExampleClick = (prompt: string) => {
    setProblem(prompt);
    handleSubmit(prompt);
  };

  return (
    <div className="min-h-screen pt-12 pb-32">
      {/* ── Header ── */}
      <div
        className="sticky top-12 z-40 px-4 pt-4 pb-4"
        style={{
          background: 'rgba(19,24,42,0.96)',
          backdropFilter: 'blur(20px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
          borderBottom: '1.5px solid rgba(0,0,0,0.06)',
        }}
      >
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}
            >
              <Sparkles size={16} className="text-white" />
            </div>
            <h1
              className="text-xl font-black text-slate-100"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              AI Tool Finder
            </h1>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Describe your project challenge and get personalised recommendations from 198 PMO tools, techniques, and frameworks.
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5">

        {/* ── Input area ── */}
        <AnimatePresence mode="wait">
          {!result && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Illustration */}
              <div className="flex justify-center mb-5">
                <img
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310419663029097403/wYAdBnNHDXPbyggk.png"
                  alt="AI Tool Finder"
                  className="w-48 h-auto"
                  style={{ mixBlendMode: 'screen', opacity: 0.4 }}
                />
              </div>

              {/* Text input */}
              <div
                className="rounded-2xl overflow-hidden bg-card mb-4"
                style={{ boxShadow: '0 2px 16px rgba(99,102,241,0.12), 0 1px 4px rgba(0,0,0,0.06)', border: '2px solid transparent', outline: 'none' }}
              >
                <textarea
                  ref={textareaRef}
                  value={problem}
                  onChange={e => setProblem(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder="Describe your project challenge…&#10;&#10;e.g. My team keeps missing deadlines and nobody knows who is responsible for what."
                  className="w-full px-4 pt-4 pb-2 text-sm text-slate-200 placeholder-slate-500 resize-none outline-none bg-transparent leading-relaxed"
                  rows={4}
                  autoFocus
                />
                <div className="flex items-center justify-between px-4 pb-3">
                  <span className="text-[10px] text-slate-400">⌘↵ to submit</span>
                  <button
                    onClick={() => handleSubmit()}
                    disabled={!problem.trim() || loading}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}
                  >
                    <Send size={14} />
                    Find tools
                  </button>
                </div>
              </div>

              {/* Example prompts */}
              <div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Lightbulb size={12} className="text-amber-500" />
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Try an example</span>
                </div>
                <div className="space-y-2">
                  {EXAMPLE_PROMPTS.map((prompt, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.05 }}
                      onClick={() => handleExampleClick(prompt)}
                      className="w-full text-left px-3.5 py-2.5 rounded-xl bg-card text-xs text-slate-400 hover:text-slate-100 transition-all flex items-center gap-2 group"
                      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)' }}
                    >
                      <ArrowRight size={12} className="shrink-0 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                      <span className="leading-relaxed">{prompt}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Loading state ── */}
        <AnimatePresence>
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingState problem={problem} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Error state ── */}
        <AnimatePresence>
          {error && !loading && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl p-4 mb-4 border"
              style={{ backgroundColor: 'rgba(244,63,94,0.12)', borderColor: 'rgba(244,63,94,0.3)' }}
            >
              <p className="text-sm font-semibold text-rose-300 mb-1">Something went wrong</p>
              <p className="text-xs text-rose-300 mb-3">{error}</p>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs font-semibold text-rose-300 hover:text-rose-100"
              >
                <RotateCcw size={12} />
                Try again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Results ── */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Problem echo */}
              <div
                className="rounded-2xl p-4 mb-4 bg-card"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}
              >
                <p className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider mb-1">Your challenge</p>
                <p className="text-sm text-slate-300 leading-relaxed">{problem}</p>
              </div>

              {/* AI summary */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="rounded-2xl p-4 mb-5"
                style={{
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.10) 100%)',
                  border: '1px solid rgba(99,102,241,0.15)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-indigo-500" />
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">AI Analysis</span>
                </div>
                <p className="text-sm text-indigo-900 leading-relaxed">{result.summary}</p>
              </motion.div>

              {/* Recommendation cards */}
              <div className="flex items-center gap-1.5 mb-3 px-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {result.recommendations.length} recommended tools
                </span>
              </div>

              <div className="space-y-3 mb-6">
                {result.recommendations.map((rec, i) => (
                  <RecommendationCard key={rec.cardId} rec={rec} index={i} />
                ))}
              </div>

              {/* Reset button */}
              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-slate-400 bg-card transition-all hover:bg-card/5"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.07)' }}
              >
                <RotateCcw size={14} />
                Try a different problem
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
}
