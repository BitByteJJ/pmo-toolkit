// StratAlign — Quiz Mode Page
// A standalone 10-question quiz for any deck, no hearts consumed.
// Tracks score, shows explanations, and awards a mastery badge on 100%.

import { useState, useCallback, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, CheckCircle2, XCircle, ChevronRight, Trophy, RotateCcw, ArrowLeft, Star,
} from 'lucide-react';
import { getDeckById } from '@/lib/pmoData';
import { getQuizForDeck } from '@/lib/quizData';
import type { JourneyQuestion } from '@/lib/journeyData';
import { useMasteryBadges } from '@/hooks/useMasteryBadges';

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
function ProgressBar({ current, total, color }: { current: number; total: number; color: string }) {
  const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
  return (
    <div className="h-2 rounded-full bg-card/15 overflow-hidden flex-1">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  );
}

// ─── QUESTION CARD ────────────────────────────────────────────────────────────
type AnswerState = 'unanswered' | 'correct' | 'wrong';

function QuestionCard({
  question,
  questionNumber,
  total,
  color,
  onAnswer,
}: {
  question: JourneyQuestion;
  questionNumber: number;
  total: number;
  color: string;
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');

  const handleSelect = (index: number) => {
    if (answerState !== 'unanswered') return;
    setSelected(index);
    const correct = index === question.correctIndex;
    setAnswerState(correct ? 'correct' : 'wrong');
    onAnswer(correct);
  };

  const optionStyle = (index: number) => {
    if (answerState === 'unanswered') {
      return selected === index
        ? 'border-2 bg-card/10'
        : 'border border-white/10 hover:border-white/15 hover:bg-card/5 cursor-pointer';
    }
    if (index === question.correctIndex) return 'border-2 border-emerald-500 bg-emerald-50';
    if (index === selected && answerState === 'wrong') return 'border-2 border-red-400 bg-red-50';
    return 'border border-white/10 opacity-50';
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4"
    >
      {/* Question type badge */}
      <div className="flex items-center gap-2">
        <span
          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: color }}
        >
          {question.type === 'truefalse' ? 'TRUE / FALSE' : question.type === 'scenario' ? 'SCENARIO' : 'MULTIPLE CHOICE'}
        </span>
        <span className="text-[10px] text-slate-400 font-medium">
          Question {questionNumber} of {total}
        </span>
      </div>

      {/* Prompt */}
      <p className="text-[15px] font-semibold text-slate-100 leading-relaxed" style={{ fontFamily: 'Sora, sans-serif' }}>
        {question.prompt}
      </p>

      {/* Options */}
      <div className="flex flex-col gap-2.5">
        {question.options.map((opt, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: answerState === 'unanswered' ? 0.98 : 1 }}
            onClick={() => handleSelect(i)}
            className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-150 flex items-center gap-3 ${optionStyle(i)}`}
          >
            <span
              className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[11px] font-bold shrink-0"
              style={{
                borderColor: answerState !== 'unanswered' && i === question.correctIndex
                  ? '#10b981'
                  : answerState !== 'unanswered' && i === selected && answerState === 'wrong'
                  ? '#f87171'
                  : '#d6d3d1',
                backgroundColor: answerState !== 'unanswered' && i === question.correctIndex
                  ? '#10b981'
                  : answerState !== 'unanswered' && i === selected && answerState === 'wrong'
                  ? '#f87171'
                  : 'transparent',
                color: (answerState !== 'unanswered' && (i === question.correctIndex || (i === selected && answerState === 'wrong')))
                  ? '#fff'
                  : '#78716c',
              }}
            >
              {String.fromCharCode(65 + i)}
            </span>
            <span className="text-[13px] font-medium text-slate-300 leading-snug">{opt}</span>
            {answerState !== 'unanswered' && i === question.correctIndex && (
              <CheckCircle2 size={16} className="ml-auto text-emerald-500 shrink-0" />
            )}
            {answerState !== 'unanswered' && i === selected && answerState === 'wrong' && (
              <XCircle size={16} className="ml-auto text-red-400 shrink-0" />
            )}
          </motion.button>
        ))}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {answerState !== 'unanswered' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-4 ${answerState === 'correct' ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}
          >
            <div className="flex items-start gap-2">
              {answerState === 'correct'
                ? <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                : <XCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              }
              <p className="text-[12px] leading-relaxed text-slate-300">{question.explanation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── RESULTS SCREEN ───────────────────────────────────────────────────────────
function ResultsScreen({
  score,
  total,
  deck,
  onRetry,
  onExit,
  isPerfect,
}: {
  score: number;
  total: number;
  deck: ReturnType<typeof getDeckById>;
  onRetry: () => void;
  onExit: () => void;
  isPerfect: boolean;
}) {
  const pct = Math.round((score / total) * 100);
  const grade = pct === 100 ? 'Perfect!' : pct >= 80 ? 'Excellent' : pct >= 60 ? 'Good effort' : 'Keep practising';
  const gradeColor = pct === 100 ? '#f59e0b' : pct >= 80 ? '#10b981' : pct >= 60 ? '#3b82f6' : '#f87171';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center gap-6 py-8 px-4"
    >
      {isPerfect ? (
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8 }}
        >
          <Trophy size={56} style={{ color: '#f59e0b' }} />
        </motion.div>
      ) : (
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black"
          style={{ backgroundColor: gradeColor + '20', color: gradeColor, fontFamily: 'Sora, sans-serif' }}
        >
          {pct}%
        </div>
      )}

      <div>
        <p className="text-2xl font-black text-slate-100 mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>
          {grade}
        </p>
        <p className="text-sm text-slate-400">
          You scored <strong>{score} out of {total}</strong> on the {deck?.title} quiz
        </p>
      </div>

      {isPerfect && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-4 w-full"
          style={{ backgroundColor: '#FFFBEB', border: '1.5px solid #FDE68A' }}
        >
          <div className="flex items-center gap-3">
            <Star size={20} className="text-amber-500 fill-amber-400 shrink-0" />
            <div className="text-left">
              <p className="text-sm font-bold text-amber-800">Mastery Badge Earned!</p>
              <p className="text-[11px] text-amber-600 mt-0.5">
                You've mastered the {deck?.title} deck with a perfect score.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {pct < 100 && pct >= 60 && (
        <p className="text-[12px] text-slate-400 max-w-xs">
          Review the cards you got wrong and try again to earn the mastery badge.
        </p>
      )}
      {pct < 60 && (
        <p className="text-[12px] text-slate-400 max-w-xs">
          Study the {deck?.title} deck cards and come back when you're ready to try again.
        </p>
      )}

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-bold text-white text-sm"
          style={{ backgroundColor: deck?.color ?? '#475569' }}
        >
          <RotateCcw size={16} />
          Try Again
        </button>
        <button
          onClick={onExit}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-bold text-slate-300 text-sm bg-card/10"
        >
          <ArrowLeft size={16} />
          Back to Deck
        </button>
      </div>
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function QuizPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const [, navigate] = useLocation();
  const deck = getDeckById(deckId);
  const quiz = getQuizForDeck(deckId);
  const { awardBadge } = useMasteryBadges();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const [key, setKey] = useState(0); // force re-mount QuestionCard on next

  const questions = quiz?.questions ?? [];
  const currentQuestion = questions[currentIndex];

  const handleAnswer = useCallback((correct: boolean) => {
    if (correct) setScore(s => s + 1);
    setAnswered(true);
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex(i => i + 1);
      setAnswered(false);
      setKey(k => k + 1);
    }
  }, [currentIndex, questions.length]);

  // Award mastery badge on perfect score
  useEffect(() => {
    if (finished && score === questions.length && questions.length > 0) {
      awardBadge(deckId, 'quiz');
    }
  }, [finished, score, questions.length, deckId, awardBadge]);

  const handleRetry = () => {
    setCurrentIndex(0);
    setScore(0);
    setAnswered(false);
    setFinished(false);
    setKey(k => k + 1);
  };

  if (!deck || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">No quiz available for this deck yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 pb-8">
      {/* Header */}
      <div
        className="sticky top-12 z-40 px-4"
        style={{
          background: 'rgba(19,24,42,0.96)',
          backdropFilter: 'blur(20px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
          borderBottom: '1.5px solid rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex items-center gap-3 py-3">
          <button
            onClick={() => navigate(`/deck/${deckId}`)}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-card/10 transition-colors shrink-0"
          >
            <X size={18} className="text-slate-400" />
          </button>
          {!finished && (
            <>
              <ProgressBar current={currentIndex} total={questions.length} color={deck.color} />
              <span className="text-[11px] font-bold text-slate-400 shrink-0">
                {currentIndex}/{questions.length}
              </span>
            </>
          )}
          {finished && (
            <h1 className="text-base font-black text-slate-100 flex-1 text-center pr-8" style={{ fontFamily: 'Sora, sans-serif' }}>
              Quiz Results
            </h1>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-6 max-w-lg mx-auto">
        {!finished ? (
          <div className="flex flex-col gap-6">
            <AnimatePresence mode="wait">
              <QuestionCard
                key={key}
                question={currentQuestion}
                questionNumber={currentIndex + 1}
                total={questions.length}
                color={deck.color}
                onAnswer={handleAnswer}
              />
            </AnimatePresence>

            {/* Next button */}
            <AnimatePresence>
              {answered && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleNext}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-white text-sm"
                  style={{ backgroundColor: deck.color }}
                >
                  {currentIndex + 1 >= questions.length ? (
                    <>See Results <Trophy size={16} /></>
                  ) : (
                    <>Next Question <ChevronRight size={16} /></>
                  )}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <ResultsScreen
            score={score}
            total={questions.length}
            deck={deck}
            onRetry={handleRetry}
            onExit={() => navigate(`/deck/${deckId}`)}
            isPerfect={score === questions.length}
          />
        )}
      </div>
    </div>
  );
}
