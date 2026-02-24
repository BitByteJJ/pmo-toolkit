// PMO Toolkit Navigator — Daily Lesson Flow
// Design: Full-screen immersive question flow with progress bar, hearts, answer feedback

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useLocation, useParams } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  X,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Star,
  Zap,
  BookOpen,
  ArrowRight,
  Trophy,
  Sparkles,
} from 'lucide-react';
import { useJourney, MAX_HEARTS } from '@/contexts/JourneyContext';
import { JOURNEY_LESSONS, getLessonByDay } from '@/lib/journeyData';
import { CARDS, getCardById } from '@/lib/pmoData';
import { useTheme } from '@/contexts/ThemeContext';
import PageFooter from '@/components/PageFooter';

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
  const { isDark } = useTheme();
  return (
    <div className="h-2 rounded-full overflow-hidden flex-1" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: 'linear-gradient(90deg, #6366f1, #3b82f6)' }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  );
}

// ─── HEARTS DISPLAY ───────────────────────────────────────────────────────────
function HeartsDisplay({ hearts }: { hearts: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: MAX_HEARTS }).map((_, i) => (
        <motion.div
          key={i}
          animate={i === hearts ? { scale: [1, 1.5, 1] } : {}}
          transition={{ duration: 0.35 }}
        >
          <Heart
            size={18}
            className={i < hearts ? 'text-rose-400 fill-rose-400' : 'text-slate-600 fill-slate-700'}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ─── QUESTION CARD ────────────────────────────────────────────────────────────
type AnswerState = 'unanswered' | 'correct' | 'wrong';

function QuestionCard({
  question,
  onAnswer,
}: {
  question: NonNullable<ReturnType<typeof getLessonByDay>>['questions'][0];
  onAnswer: (selectedIndex: number, correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const { isDark } = useTheme();

  const handleSelect = (index: number) => {
    if (answerState !== 'unanswered') return;
    setSelected(index);
    const correct = index === question.correctIndex;
    setAnswerState(correct ? 'correct' : 'wrong');
    onAnswer(index, correct);
  };

  const optionBg = (index: number) => {
    if (answerState === 'unanswered') {
      return selected === index
        ? { background: 'rgba(99,102,241,0.2)', border: '2px solid rgba(99,102,241,0.6)' }
        : { background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', border: isDark ? '2px solid rgba(255,255,255,0.08)' : '2px solid rgba(0,0,0,0.1)' };
    }
    if (index === question.correctIndex) {
      return { background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.5)' };
    }
    if (index === selected && selected !== question.correctIndex) {
      return { background: 'rgba(239,68,68,0.12)', border: '2px solid rgba(239,68,68,0.4)' };
    }
    return { background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', border: isDark ? '2px solid rgba(255,255,255,0.05)' : '2px solid rgba(0,0,0,0.06)', opacity: 0.45 };
  };

  const typeLabel: Record<string, string> = {
    mcq: 'Multiple Choice',
    scenario: 'Scenario',
    truefalse: 'True or False',
    matching: 'Matching',
  };

  const typeColor: Record<string, string> = {
    mcq: '#6366f1',
    scenario: '#0ea5e9',
    truefalse: '#f59e0b',
    matching: '#10b981',
  };

  const qColor = typeColor[question.type] ?? '#6366f1';

  return (
    <div className="flex flex-col gap-4">
      {/* Question type badge + XP */}
      <div className="flex items-center gap-2">
        <span
          className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ background: `${qColor}18`, color: qColor, border: `1px solid ${qColor}30` }}
        >
          {typeLabel[question.type] ?? question.type}
        </span>
        <span
          className="text-[9px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(234,179,8,0.12)', color: '#fbbf24', border: '1px solid rgba(234,179,8,0.2)' }}
        >
          +{question.xp} XP
        </span>
      </div>

      {/* Prompt */}
      <p
        className="text-[16px] font-bold text-slate-100 leading-relaxed"
        style={{ fontFamily: 'Sora, sans-serif' }}
      >
        {question.prompt}
      </p>

      {/* Options */}
      <div className="space-y-2.5">
        {question.options.map((option, i) => (
          <motion.button
            key={i}
            onClick={() => handleSelect(i)}
            whileTap={answerState === 'unanswered' ? { scale: 0.98 } : {}}
            className="w-full text-left px-4 py-3.5 rounded-2xl transition-all duration-200 flex items-center gap-3"
            style={optionBg(i) as React.CSSProperties}
          >
            <span
              className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
              style={{
                background: answerState !== 'unanswered' && i === question.correctIndex
                  ? '#10b981'
                  : answerState !== 'unanswered' && i === selected && i !== question.correctIndex
                  ? '#ef4444'
                  : answerState === 'unanswered' && selected === i
                  ? '#6366f1'
                  : 'rgba(255,255,255,0.08)',
                color: 'white',
                border: answerState === 'unanswered' && selected !== i ? '1.5px solid rgba(255,255,255,0.12)' : 'none',
              }}
            >
              {String.fromCharCode(65 + i)}
            </span>
            <span className="text-[13px] text-foreground leading-relaxed font-medium">{option}</span>
            {answerState !== 'unanswered' && i === question.correctIndex && (
              <CheckCircle2 size={16} className="text-emerald-400 ml-auto shrink-0" />
            )}
            {answerState !== 'unanswered' && i === selected && i !== question.correctIndex && (
              <XCircle size={16} className="text-rose-400 ml-auto shrink-0" />
            )}
          </motion.button>
        ))}
      </div>

      {/* Explanation (shown after answering) */}
      <AnimatePresence>
        {answerState !== 'unanswered' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl p-4"
            style={
              answerState === 'correct'
                ? { background: 'rgba(16,185,129,0.1)', border: '1.5px solid rgba(16,185,129,0.3)' }
                : { background: 'rgba(239,68,68,0.1)', border: '1.5px solid rgba(239,68,68,0.3)' }
            }
          >
            <div className="flex items-start gap-2.5">
              {answerState === 'correct' ? (
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p
                  className="text-[11px] font-bold mb-1"
                  style={{ color: answerState === 'correct' ? '#34d399' : '#f87171' }}
                >
                  {answerState === 'correct' ? `Correct! +${question.xp} XP` : "Not quite — here's why:"}
                </p>
                <p className="text-[12px] text-foreground leading-relaxed">{question.explanation}</p>
                {question.cardRefs && question.cardRefs.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {question.cardRefs.map(ref => (
                      <span
                        key={ref}
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                        style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)', color: isDark ? '#94a3b8' : '#475569' }}
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── LESSON COMPLETE SCREEN ───────────────────────────────────────────────────
function LessonCompleteScreen({
  day,
  title,
  correctCount,
  totalCount,
  xpEarned,
  onContinue,
}: {
  day: number;
  title: string;
  correctCount: number;
  totalCount: number;
  xpEarned: number;
  onContinue: () => void;
}) {
  const { isDark } = useTheme();
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const isPerfect = correctCount === totalCount;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 pb-12"
      style={{ background: isDark ? 'radial-gradient(ellipse at top, rgba(99,102,241,0.12) 0%, #0a1628 60%)' : 'radial-gradient(ellipse at top, rgba(99,102,241,0.08) 0%, #f1f5f9 60%)' }}
    >
      {/* Floating particles */}
      {isPerfect && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#38bdf8'][i % 5],
                left: `${10 + i * 11}%`,
                top: `${20 + (i % 3) * 15}%`,
              }}
              animate={{ y: [-20, -60, -20], opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      )}

      {/* Trophy / star animation */}
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.1 }}
        className="w-28 h-28 rounded-full flex items-center justify-center mb-6 relative"
        style={{
          background: isPerfect
            ? 'radial-gradient(circle, rgba(16,185,129,0.2), rgba(16,185,129,0.05))'
            : 'radial-gradient(circle, rgba(234,179,8,0.2), rgba(234,179,8,0.05))',
          border: isPerfect ? '2px solid rgba(16,185,129,0.3)' : '2px solid rgba(234,179,8,0.3)',
          boxShadow: isPerfect ? '0 0 40px rgba(16,185,129,0.2)' : '0 0 40px rgba(234,179,8,0.2)',
        }}
      >
        {isPerfect ? (
          <Trophy size={48} className="text-emerald-400" />
        ) : (
          <Star size={48} className="text-amber-400 fill-amber-400" />
        )}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-black text-foreground text-center mb-1"
        style={{ fontFamily: 'Sora, sans-serif' }}
      >
        {isPerfect ? '🎉 Perfect Score!' : 'Lesson Complete!'}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-muted-foreground text-center mb-8"
      >
        Day {day} — {title}
      </motion.p>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="grid grid-cols-3 gap-3 w-full max-w-xs mb-8"
      >
        {[
          { icon: CheckCircle2, value: `${correctCount}/${totalCount}`, label: 'Correct', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)' },
          { icon: Zap, value: `+${xpEarned}`, label: 'XP Earned', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
          { icon: Star, value: `${accuracy}%`, label: 'Accuracy', color: '#6366f1', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)' },
        ].map(({ icon: Icon, value, label, color, bg, border }) => (
          <div
            key={label}
            className="rounded-2xl p-3 text-center"
            style={{ background: bg, border: `1.5px solid ${border}` }}
          >
            <Icon size={16} className="mx-auto mb-1" style={{ color }} />
            <div
              className="text-lg font-black"
              style={{ color, fontFamily: 'Sora, sans-serif' }}
            >
              {value}
            </div>
            <div className="text-[9px] font-semibold text-muted-foreground">{label}</div>
          </div>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        onClick={onContinue}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="w-full max-w-xs py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2"
        style={{
          background: isPerfect
            ? 'linear-gradient(135deg, #059669, #10b981)'
            : 'linear-gradient(135deg, #4f46e5, #6366f1)',
          boxShadow: isPerfect
            ? '0 4px 20px rgba(16,185,129,0.35)'
            : '0 4px 20px rgba(99,102,241,0.35)',
        }}
      >
        Continue
        <ArrowRight size={18} />
      </motion.button>
    </motion.div>
  );
}

// ─── NO HEARTS SCREEN ─────────────────────────────────────────────────────────
function NoHeartsScreen({ onEarnHeart, onGoBack }: { onEarnHeart: () => void; onGoBack: () => void }) {
  const { isDark } = useTheme();
  const { heartsRefillCountdown } = useJourney();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 pb-12"
      style={{ background: isDark ? 'radial-gradient(ellipse at top, rgba(220,38,38,0.1) 0%, #0a1628 60%)' : 'radial-gradient(ellipse at top, rgba(220,38,38,0.06) 0%, #f1f5f9 60%)' }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 20 }}
        className="w-28 h-28 rounded-full flex items-center justify-center mb-6"
        style={{
          background: 'radial-gradient(circle, rgba(220,38,38,0.18), rgba(220,38,38,0.05))',
          border: '2px solid rgba(220,38,38,0.3)',
          boxShadow: '0 0 40px rgba(220,38,38,0.15)',
        }}
      >
        <Heart size={48} className="text-rose-400 fill-rose-400" />
      </motion.div>

      <h2
        className="text-2xl font-black text-rose-500 dark:text-rose-300 text-center mb-2"
        style={{ fontFamily: 'Sora, sans-serif' }}
      >
        Out of Hearts
      </h2>
      <p className="text-sm text-muted-foreground text-center mb-1">
        You've used all 3 hearts for today.
      </p>
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-2xl mb-8"
        style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)' }}
      >
        <span className="text-sm text-foreground">Hearts refill in:</span>
        <span className="text-sm font-bold text-rose-500 dark:text-rose-300">{heartsRefillCountdown}</span>
      </div>

      <div className="w-full max-w-xs space-y-3">
        <button
          onClick={onEarnHeart}
          className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 active:scale-95 transition-all"
          style={{
            background: 'linear-gradient(135deg, #be123c, #e11d48)',
            boxShadow: '0 4px 20px rgba(225,29,72,0.35)',
          }}
        >
          <BookOpen size={18} />
          Study 5 topics to earn a heart
        </button>
        <button
          onClick={onGoBack}
          className="w-full py-3 rounded-2xl font-semibold text-foreground text-sm transition-all active:scale-95"
          style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)' }}
        >
          Back to Journey Map
        </button>
      </div>
    </motion.div>
  );
}

// ─── MAIN LESSON PAGE ─────────────────────────────────────────────────────────
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const QUESTIONS_PER_SESSION = 5;

export default function LessonPage() {
  const params = useParams<{ day: string }>();
  const [, navigate] = useLocation();
  const { isDark } = useTheme();
  const day = parseInt(params.day ?? '1', 10);
  const lesson = getLessonByDay(day);

  const sessionSeedRef = useRef(Date.now());
  const sessionQuestions = useMemo(() => {
    if (!lesson) return [];
    const pool = lesson.questions;
    if (pool.length <= QUESTIONS_PER_SESSION) return shuffleArray(pool);
    return shuffleArray(pool).slice(0, QUESTIONS_PER_SESSION);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id, sessionSeedRef.current]);

  const lessonWithRandomQ = useMemo(
    () => lesson ? { ...lesson, questions: sessionQuestions } : null,
    [lesson, sessionQuestions]
  );

  const {
    state,
    currentLesson,
    currentQuestion,
    startLesson,
    answerQuestion,
    completeLesson,
    abandonLesson,
    isDayCompleted,
    isDayLocked,
    canStartLesson,
  } = useJourney();

  const [showCompleteScreen, setShowCompleteScreen] = useState(false);
  const [pendingContinue, setPendingContinue] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (!lessonWithRandomQ) return;
    if (isDayLocked(day)) {
      navigate('/journey');
      return;
    }

    if (
      state.activeSession &&
      state.activeSession.lessonId === lessonWithRandomQ.id &&
      state.activeSession.questionIndex >= lessonWithRandomQ.questions.length
    ) {
      setShowCompleteScreen(true);
      completeLesson();
      return;
    }

    if (!state.activeSession || state.activeSession.lessonId !== lessonWithRandomQ.id) {
      if (state.hearts > 0) {
        startLesson(lessonWithRandomQ.id, day);
      } else {
        if (state.activeSession) {
          abandonLesson();
        }
      }
    }
  }, [lessonWithRandomQ, day]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = useCallback(
    (selectedIndex: number, correct: boolean) => {
      if (!currentQuestion) return;
      setLastAnswerCorrect(correct);
      answerQuestion(currentQuestion.id, selectedIndex, correct, currentQuestion.xp);
      setPendingContinue(true);
    },
    [currentQuestion, answerQuestion]
  );

  const handleContinue = useCallback(() => {
    if (!lessonWithRandomQ || !state.activeSession) return;
    const nextIndex = state.activeSession.questionIndex;
    const isLastQuestion = nextIndex >= lessonWithRandomQ.questions.length;

    setPendingContinue(false);
    setLastAnswerCorrect(null);

    if (isLastQuestion) {
      setShowCompleteScreen(true);
      completeLesson();
    }
  }, [lessonWithRandomQ, state.activeSession, completeLesson]);

  const handleAbandon = useCallback(() => {
    abandonLesson();
    navigate('/journey');
  }, [abandonLesson, navigate]);

  const handleCompleteFinish = useCallback(() => {
    navigate('/journey');
  }, [navigate]);

  if (!lessonWithRandomQ) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: isDark ? '#0a1628' : '#f1f5f9' }}>
        <p className="text-muted-foreground">Lesson not found</p>
      </div>
    );
  }

  if (showCompleteScreen) {
    const session = state.completedSessions[lessonWithRandomQ.id];
    return (
      <LessonCompleteScreen
        day={day}
        title={lessonWithRandomQ.title}
        correctCount={session?.correctCount ?? 0}
        totalCount={lessonWithRandomQ.questions.length}
        xpEarned={session?.xpEarned ?? 0}
        onContinue={handleCompleteFinish}
      />
    );
  }

  if (state.hearts <= 0 && !state.activeSession) {
    return (
      <NoHeartsScreen
        onEarnHeart={() => navigate('/journey/earn-heart')}
        onGoBack={() => navigate('/journey')}
      />
    );
  }

  if (!state.activeSession || (!currentQuestion && !pendingContinue)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: isDark ? '#0a1628' : '#f1f5f9' }}>
        <div className="text-center px-6">
          <p className="text-muted-foreground mb-4">Loading lesson...</p>
        </div>
      </div>
    );
  }

  const questionIndex = state.activeSession.questionIndex;
  const totalQuestions = lessonWithRandomQ.questions.length;
  const displayIndex = pendingContinue ? questionIndex - 1 : questionIndex;
  const displayQuestion = lessonWithRandomQ.questions[displayIndex];

  return (
    <>
    <div className="min-h-screen pt-11 flex flex-col" style={{ background: isDark ? '#0a1628' : '#f1f5f9' }}>
      {/* Header */}
      <div
        className="sticky top-11 z-40 px-4 py-3"
        style={{
          background: isDark ? 'rgba(10,22,40,0.97)' : 'rgba(241,245,249,0.97)',
          backdropFilter: 'blur(24px) saturate(1.6)',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={handleAbandon}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors shrink-0"
          >
            <X size={18} className="text-muted-foreground" />
          </button>
          <ProgressBar current={displayIndex} total={totalQuestions} />
          <HeartsDisplay hearts={state.hearts} />
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-[10px] font-semibold text-muted-foreground">
            Day {day} — {lessonWithRandomQ.title}
          </span>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}
          >
            {displayIndex + 1} / {totalQuestions}
          </span>
        </div>
      </div>

      {/* Question area — pb-32 ensures content isn't hidden behind the sticky Continue bar + BottomNav */}
      <div className="flex-1 px-4 py-6 pb-32 overflow-y-auto">
        <AnimatePresence mode="wait">
          {displayQuestion && (
            <motion.div
              key={displayQuestion.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22 }}
            >
              <QuestionCard
                question={displayQuestion}
                onAnswer={handleAnswer}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Continue button (shown after answering) */}
      <AnimatePresence>
        {pendingContinue && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="sticky bottom-0 px-4 pt-3"
            style={{
              paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px) + 64px)',
              background: isDark ? 'rgba(10,22,40,0.97)' : 'rgba(241,245,249,0.97)',
              backdropFilter: 'blur(12px)',
              borderTop: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.08)',
            }}
          >
            {/* Hearts lost warning */}
            {lastAnswerCorrect === false && state.hearts === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[11px] font-bold text-rose-400 text-center mb-2"
              >
                ❤️ Last heart lost! Complete this lesson or study topics to earn hearts back.
              </motion.p>
            )}
            <button
              onClick={handleContinue}
              className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 active:scale-95 transition-all"
              style={{
                background: lastAnswerCorrect
                  ? 'linear-gradient(135deg, #059669, #10b981)'
                  : 'linear-gradient(135deg, #4f46e5, #6366f1)',
                boxShadow: lastAnswerCorrect
                  ? '0 4px 20px rgba(16,185,129,0.3)'
                  : '0 4px 20px rgba(99,102,241,0.3)',
              }}
            >
              {questionIndex >= totalQuestions ? 'See Results' : 'Continue'}
              <ChevronRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <PageFooter />
    </div>
    </>
  );
}
