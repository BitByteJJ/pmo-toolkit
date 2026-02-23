/**
 * PM Decision Helper
 *
 * A guided questionnaire that helps project managers navigate to the
 * most relevant tools, techniques, and frameworks from the 198-card library.
 *
 * Flow:
 *   Start → Question → Answer → (branch or results)
 *   Results show 3–6 recommended cards with deck colour, title, tagline,
 *   and a direct link to the full card detail.
 */

import { useState, useCallback } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw, Compass, ChevronRight, Sparkles } from 'lucide-react';
import {
  DECISION_QUESTIONS,
  getQuestionById,
  getResultMeta,
  type DecisionAnswer,
} from '@/lib/decisionData';
import { CARDS, DECKS, getCardById } from '@/lib/pmoData';
import { useTheme } from '@/contexts/ThemeContext';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface HistoryEntry {
  questionId: string;
  answerId: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Recommendation Card
// ─────────────────────────────────────────────────────────────────────────────

function RecommendedCard({ cardId, index }: { cardId: string; index: number }) {
  const [, navigate] = useLocation();
  const card = getCardById(cardId);
  if (!card) return null;

  const deck = DECKS.find(d => d.id === card.deckId);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => navigate(`/card/${card.id}`)}
      className="w-full text-left rounded-2xl overflow-hidden bg-card relative"
      style={{ boxShadow: `0 2px 12px ${deck?.color ?? '#ccc'}18, 0 1px 3px rgba(0,0,0,0.06)` }}
      whileHover={{ scale: 1.015, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: deck?.color ?? '#ccc' }} />

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Code badge */}
          <div
            className="shrink-0 px-2 py-1 rounded-lg text-[10px] font-mono font-bold mt-0.5"
            style={{ backgroundColor: (deck?.color ?? '#ccc') + '18', color: deck?.color ?? '#555' }}
          >
            {card.code}
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className="text-sm font-bold text-foreground leading-tight mb-0.5"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              {card.title}
            </h3>
            <p className="text-[11px] text-foreground leading-relaxed line-clamp-2">
              {card.tagline}
            </p>
          </div>

          <ChevronRight size={14} className="shrink-0 mt-1 text-muted-foreground" />
        </div>

        {/* Deck label */}
        <div className="mt-2 flex items-center gap-1.5">
          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: deck?.color }}>
            {deck?.title}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Results Screen
// ─────────────────────────────────────────────────────────────────────────────

function ResultsScreen({
  cardIds,
  history,
  onRestart,
  onBack,
}: {
  cardIds: string[];
  history: HistoryEntry[];
  onRestart: () => void;
  onBack: () => void;
}) {
  const [, navigate] = useLocation();
  const { isDark } = useTheme();
  const meta = getResultMeta(cardIds);

  // Build a readable answer trail
  const trail = history.map(h => {
    const q = getQuestionById(h.questionId);
    const a = q?.answers.find(ans => ans.id === h.answerId);
    return a?.label ?? '';
  }).filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-4"
    >
      {/* Header */}
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8e] p-5 text-white">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-card/20 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
            Your Recommendation
          </span>
        </div>
        <h2 className="text-lg font-black leading-tight mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
          {meta.headline}
        </h2>
        <p className="text-[12px] text-white/75 leading-relaxed">
          {meta.rationale}
        </p>
      </div>

      {/* Answer trail */}
      {trail.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {trail.map((label, i) => (
            <span
              key={i}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-card/10 text-foreground"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Recommended cards */}
      <div>
        <p className="text-[10px] font-black text-foreground uppercase tracking-[0.12em] mb-3">
          {cardIds.length} Recommended {cardIds.length === 1 ? 'Tool' : 'Tools'}
        </p>
        <div className="flex flex-col gap-3">
          {cardIds.map((id, i) => (
            <RecommendedCard key={id} cardId={id} index={i} />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-foreground bg-card/10"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <button
          onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-white"
          style={{ background: isDark ? 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)' : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' }}
        >
          <RotateCcw size={14} />
          Start Over
        </button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Question Screen
// ─────────────────────────────────────────────────────────────────────────────

function QuestionScreen({
  question,
  onAnswer,
  onBack,
  canGoBack,
  stepIndex,
  totalSteps,
}: {
  question: ReturnType<typeof getQuestionById>;
  onAnswer: (answer: DecisionAnswer) => void;
  onBack: () => void;
  canGoBack: boolean;
  stepIndex: number;
  totalSteps: number;
}) {
  const { isDark } = useTheme();
  if (!question) return null;

  const progress = totalSteps > 1 ? (stepIndex / (totalSteps - 1)) * 100 : 0;

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-5"
    >
      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">
            Step {stepIndex + 1}
          </span>
          <span className="text-[10px] font-semibold text-foreground">
            {Math.round(progress)}% complete
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-card/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: isDark ? 'linear-gradient(90deg, #1e3a5f 0%, #2d5a8e 100%)' : 'linear-gradient(90deg, #dbeafe 0%, #bfdbfe 100%)' }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(progress, 4)}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Question */}
      <div>
        <h2
          className="text-[19px] font-black text-slate-100 leading-tight mb-1"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          {question.question}
        </h2>
        {question.hint && (
          <p className="text-[12px] text-foreground font-medium">{question.hint}</p>
        )}
      </div>

      {/* Answer options */}
      <div className="flex flex-col gap-2.5">
        {question.answers.map((answer, i) => (
          <motion.button
            key={answer.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => onAnswer(answer)}
            className="w-full text-left rounded-2xl p-4 bg-card border-2 border-transparent transition-all"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            whileHover={{
              borderColor: '#1e3a5f',
              boxShadow: '0 4px 16px rgba(30,58,95,0.12)',
              scale: 1.01,
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full border-2 border-white/10 flex items-center justify-center shrink-0 text-[11px] font-bold text-foreground"
              >
                {String.fromCharCode(65 + i)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground leading-tight">
                  {answer.label}
                </p>
                {answer.description && (
                  <p className="text-[11px] text-foreground mt-0.5 leading-relaxed">
                    {answer.description}
                  </p>
                )}
              </div>
              <ArrowRight size={14} className="shrink-0 text-muted-foreground" />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Back button */}
      {canGoBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[12px] font-semibold text-foreground mt-1 self-start"
        >
          <ArrowLeft size={13} />
          Previous question
        </button>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Start Screen
// ─────────────────────────────────────────────────────────────────────────────

function StartScreen({ onStart }: { onStart: () => void }) {
  const { isDark } = useTheme();
  const totalCards = CARDS.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-6"
    >
      {/* Hero */}
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8e] p-6 text-white">
        <div className="w-12 h-12 rounded-2xl bg-card/20 flex items-center justify-center mb-4">
          <Compass size={24} className="text-white" />
        </div>
        <h1
          className="text-[22px] font-black leading-tight mb-2"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          PM Decision Helper
        </h1>
        <p className="text-[13px] text-white/80 leading-relaxed">
          Answer 2–3 questions about your current challenge and get a personalised
          shortlist of tools and frameworks from the {totalCards}-card library.
        </p>
      </div>

      {/* How it works */}
      <div className="rounded-2xl bg-card p-5" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <h2 className="text-[11px] font-black text-foreground uppercase tracking-[0.12em] mb-4">
          How it works
        </h2>
        <div className="flex flex-col gap-4">
          {[
            { step: '1', title: 'Choose your challenge', desc: 'Select the area where you need support today — planning, people, risk, delivery, and more.' },
            { step: '2', title: 'Narrow it down', desc: 'Answer one or two follow-up questions to pinpoint the specific situation.' },
            { step: '3', title: 'Get your toolkit', desc: 'Receive a curated shortlist of 3–6 tools with direct links to the full card details and templates.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-black text-white mt-0.5"
                style={{ background: isDark ? 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)' : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' }}
              >
                {step}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{title}</p>
                <p className="text-[11px] text-foreground leading-relaxed mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.button
        onClick={onStart}
        className="w-full rounded-2xl py-4 text-sm font-black text-white flex items-center justify-center gap-2"
        style={{ background: isDark ? 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)' : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', boxShadow: '0 4px 16px rgba(30,58,95,0.25)' }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        <Compass size={16} />
        Find My Tools
      </motion.button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

type Screen = 'start' | 'question' | 'results';

export default function DecisionHelper() {
  const [, navigate] = useLocation();
  const { isDark } = useTheme();
  const [screen, setScreen] = useState<Screen>('start');
  const [currentQuestionId, setCurrentQuestionId] = useState('q-start');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // Estimate total depth for progress bar (most paths are 2 questions deep)
  const ESTIMATED_DEPTH = 2;

  const currentQuestion = getQuestionById(currentQuestionId);

  const handleStart = useCallback(() => {
    setScreen('question');
    setCurrentQuestionId('q-start');
    setHistory([]);
    setRecommendations([]);
  }, []);

  const handleAnswer = useCallback((answer: DecisionAnswer) => {
    const newHistory: HistoryEntry[] = [...history, { questionId: currentQuestionId, answerId: answer.id }];
    setHistory(newHistory);

    if (answer.recommendations) {
      setRecommendations(answer.recommendations);
      setScreen('results');
    } else if (answer.nextQuestionId) {
      setCurrentQuestionId(answer.nextQuestionId);
    }
  }, [history, currentQuestionId]);

  const handleBack = useCallback(() => {
    if (history.length === 0) {
      setScreen('start');
      return;
    }
    const prev = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    setCurrentQuestionId(prev.questionId);
    setScreen('question');
  }, [history]);

  const handleRestart = useCallback(() => {
    setScreen('start');
    setHistory([]);
    setRecommendations([]);
    setCurrentQuestionId('q-start');
  }, []);

  return (
    <div className="min-h-screen pt-12 pb-32" style={{ background: isDark ? '#0a1628' : '#f1f5f9' }}>
      {/* Header */}
      <div className="sticky top-12 z-20 border-b" style={{ background: isDark ? 'rgba(8,14,32,0.94)' : 'rgba(241,245,249,0.96)', backdropFilter: 'blur(20px) saturate(1.4)', WebkitBackdropFilter: 'blur(20px) saturate(1.4)', borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)' }}>
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-8 h-8 rounded-xl bg-card flex items-center justify-center"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
          >
            <ArrowLeft size={15} className="text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <Compass size={16} style={{ color: '#1e3a5f' }} />
            <h1
              className="text-[15px] font-black text-slate-100"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Decision Helper
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pt-2">
        <AnimatePresence mode="wait">
          {screen === 'start' && (
            <motion.div key="start">
              <StartScreen onStart={handleStart} />
            </motion.div>
          )}

          {screen === 'question' && currentQuestion && (
            <motion.div key={currentQuestionId}>
              <QuestionScreen
                question={currentQuestion}
                onAnswer={handleAnswer}
                onBack={handleBack}
                canGoBack={history.length > 0 || screen === 'question'}
                stepIndex={history.length}
                totalSteps={history.length + 1 + ESTIMATED_DEPTH}
              />
            </motion.div>
          )}

          {screen === 'results' && (
            <motion.div key="results">
              <ResultsScreen
                cardIds={recommendations}
                history={history}
                onRestart={handleRestart}
                onBack={handleBack}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
