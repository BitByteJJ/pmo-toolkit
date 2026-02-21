// PMO Toolkit Navigator — Daily Lesson Flow
// Design: Full-screen immersive question flow with progress bar, hearts, answer feedback

import { useEffect, useState, useCallback } from 'react';
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
} from 'lucide-react';
import { useJourney, MAX_HEARTS } from '@/contexts/JourneyContext';
import { JOURNEY_LESSONS, getLessonByDay } from '@/lib/journeyData';
import { CARDS, getCardById } from '@/lib/pmoData';

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
  return (
    <div className="h-2 rounded-full bg-stone-200 overflow-hidden flex-1">
      <motion.div
        className="h-full rounded-full bg-blue-500"
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
          animate={i === hearts ? { scale: [1, 1.4, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart
            size={18}
            className={i < hearts ? 'text-rose-500 fill-rose-500' : 'text-stone-300 fill-stone-100'}
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

  const handleSelect = (index: number) => {
    if (answerState !== 'unanswered') return;
    setSelected(index);
    const correct = index === question.correctIndex;
    setAnswerState(correct ? 'correct' : 'wrong');
    onAnswer(index, correct);
  };

  const optionStyle = (index: number) => {
    if (answerState === 'unanswered') {
      return selected === index
        ? 'border-blue-400 bg-blue-50'
        : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50';
    }
    if (index === question.correctIndex) {
      return 'border-emerald-400 bg-emerald-50';
    }
    if (index === selected && selected !== question.correctIndex) {
      return 'border-rose-400 bg-rose-50';
    }
    return 'border-stone-200 bg-white opacity-50';
  };

  const typeLabel: Record<string, string> = {
    mcq: 'Multiple Choice',
    scenario: 'Scenario',
    truefalse: 'True or False',
    matching: 'Matching',
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Question type badge */}
      <div className="flex items-center gap-2">
        <span
          className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8' }}
        >
          {typeLabel[question.type] ?? question.type}
        </span>
        <span className="text-[9px] font-semibold text-stone-400">+{question.xp} XP</span>
      </div>

      {/* Prompt */}
      <p
        className="text-[15px] font-semibold text-stone-800 leading-relaxed"
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
            className={`w-full text-left px-4 py-3 rounded-2xl border-2 transition-all duration-200 flex items-start gap-3 ${optionStyle(i)}`}
          >
            <span
              className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[11px] font-bold mt-0.5 ${
                answerState !== 'unanswered' && i === question.correctIndex
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : answerState !== 'unanswered' && i === selected && i !== question.correctIndex
                  ? 'border-rose-500 bg-rose-500 text-white'
                  : 'border-stone-300 text-stone-500'
              }`}
            >
              {String.fromCharCode(65 + i)}
            </span>
            <span className="text-sm text-stone-700 leading-relaxed">{option}</span>
          </motion.button>
        ))}
      </div>

      {/* Explanation (shown after answering) */}
      <AnimatePresence>
        {answerState !== 'unanswered' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-2xl p-4 ${
              answerState === 'correct'
                ? 'bg-emerald-50 border border-emerald-200'
                : 'bg-rose-50 border border-rose-200'
            }`}
          >
            <div className="flex items-start gap-2">
              {answerState === 'correct' ? (
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p
                  className={`text-[11px] font-bold mb-1 ${
                    answerState === 'correct' ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {answerState === 'correct' ? 'Correct! +' + question.xp + ' XP' : 'Not quite — here\'s why:'}
                </p>
                <p className="text-[11px] text-stone-600 leading-relaxed">{question.explanation}</p>
                {question.cardRefs && question.cardRefs.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {question.cardRefs.map(ref => (
                      <span
                        key={ref}
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-stone-200 text-stone-600"
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
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const isPerfect = correctCount === totalCount;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 pb-12"
      style={{ backgroundColor: isPerfect ? '#F0FDF4' : '#F5F3EE' }}
    >
      {/* Trophy / star animation */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
        style={{ backgroundColor: isPerfect ? '#DCFCE7' : '#FEF3C7' }}
      >
        {isPerfect ? (
          <Trophy size={44} className="text-emerald-500" />
        ) : (
          <Star size={44} className="text-amber-500 fill-amber-400" />
        )}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-black text-stone-900 text-center mb-1"
        style={{ fontFamily: 'Sora, sans-serif' }}
      >
        {isPerfect ? 'Perfect Score!' : 'Lesson Complete!'}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-stone-500 text-center mb-8"
      >
        Day {day} — {title}
      </motion.p>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="grid grid-cols-3 gap-3 w-full max-w-xs mb-8"
      >
        {[
          { icon: CheckCircle2, value: `${correctCount}/${totalCount}`, label: 'Correct', color: '#10B981', bg: '#ECFDF5' },
          { icon: Zap, value: `+${xpEarned}`, label: 'XP Earned', color: '#EAB308', bg: '#FEFCE8' },
          { icon: Star, value: `${accuracy}%`, label: 'Accuracy', color: '#3B82F6', bg: '#EFF6FF' },
        ].map(({ icon: Icon, value, label, color, bg }) => (
          <div key={label} className="rounded-2xl p-3 text-center" style={{ backgroundColor: bg }}>
            <Icon size={16} className="mx-auto mb-1" style={{ color }} />
            <div className="text-lg font-black" style={{ color, fontFamily: 'Sora, sans-serif' }}>{value}</div>
            <div className="text-[9px] font-semibold text-stone-500">{label}</div>
          </div>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        onClick={onContinue}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="w-full max-w-xs py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2"
        style={{ backgroundColor: isPerfect ? '#10B981' : '#3B82F6' }}
      >
        Continue
        <ArrowRight size={18} />
      </motion.button>
    </motion.div>
  );
}

// ─── NO HEARTS SCREEN ─────────────────────────────────────────────────────────
function NoHeartsScreen({ onEarnHeart, onGoBack }: { onEarnHeart: () => void; onGoBack: () => void }) {
  const { heartsRefillCountdown } = useJourney();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 pb-12"
      style={{ backgroundColor: '#FFF1F2' }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="w-24 h-24 rounded-full bg-rose-100 flex items-center justify-center mb-6"
      >
        <Heart size={44} className="text-rose-500 fill-rose-400" />
      </motion.div>

      <h2 className="text-2xl font-black text-rose-800 text-center mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
        Out of Hearts
      </h2>
      <p className="text-sm text-rose-600 text-center mb-2">
        You've used all 3 hearts for today.
      </p>
      <p className="text-sm font-bold text-rose-700 text-center mb-8">
        Hearts refill in: <span className="text-rose-900">{heartsRefillCountdown}</span>
      </p>

      <div className="w-full max-w-xs space-y-3">
        <button
          onClick={onEarnHeart}
          className="w-full py-4 rounded-2xl font-bold text-white text-base bg-rose-500 hover:bg-rose-600 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <BookOpen size={18} />
          Study 5 topics to earn a heart
        </button>
        <button
          onClick={onGoBack}
          className="w-full py-3 rounded-2xl font-semibold text-stone-600 text-sm bg-stone-100 hover:bg-stone-200 active:scale-95 transition-all"
        >
          Back to Journey Map
        </button>
      </div>
    </motion.div>
  );
}

// ─── MAIN LESSON PAGE ─────────────────────────────────────────────────────────
export default function LessonPage() {
  const params = useParams<{ day: string }>();
  const [, navigate] = useLocation();
  const day = parseInt(params.day ?? '1', 10);
  const lesson = getLessonByDay(day);

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

  // Start lesson on mount if not already active
  useEffect(() => {
    if (!lesson) return;
    if (isDayLocked(day)) {
      navigate('/journey');
      return;
    }
    // If no active session for this lesson, start one
    if (!state.activeSession || state.activeSession.lessonId !== lesson.id) {
      if (state.hearts > 0) {
        startLesson(lesson.id, day);
      }
    }
  }, [lesson, day]); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (!lesson || !state.activeSession) return;
    const nextIndex = state.activeSession.questionIndex;
    const isLastQuestion = nextIndex >= lesson.questions.length;

    setPendingContinue(false);
    setLastAnswerCorrect(null);

    if (isLastQuestion) {
      // Set showCompleteScreen FIRST so the complete screen guard fires
      // before the !currentQuestion guard on the next render.
      setShowCompleteScreen(true);
      completeLesson();
    }
  }, [lesson, state.activeSession, completeLesson]);

  const handleAbandon = useCallback(() => {
    abandonLesson();
    navigate('/journey');
  }, [abandonLesson, navigate]);

  const handleCompleteFinish = useCallback(() => {
    navigate('/journey');
  }, [navigate]);

  // ── Guard: lesson not found ──────────────────────────────────────────────
  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-500">Lesson not found</p>
      </div>
    );
  }

  // ── Complete screen — MUST be before the currentQuestion guard ─────────
  // After the last question is answered, questionIndex goes out of bounds
  // (currentQuestion becomes null) BEFORE completeLesson clears activeSession.
  // Checking showCompleteScreen first prevents the "Loading lesson..." flash.
  if (showCompleteScreen) {
    const session = state.completedSessions[lesson.id];
    return (
      <LessonCompleteScreen
        day={day}
        title={lesson.title}
        correctCount={session?.correctCount ?? 0}
        totalCount={lesson.questions.length}
        xpEarned={session?.xpEarned ?? 0}
        onContinue={handleCompleteFinish}
      />
    );
  }

  // ── Guard: no hearts ─────────────────────────────────────────────────────
  if (state.hearts <= 0 && !state.activeSession) {
    return (
      <NoHeartsScreen
        onEarnHeart={() => navigate('/journey/earn-heart')}
        onGoBack={() => navigate('/journey')}
      />
    );
  }

  // ── Active lesson ────────────────────────────────────────────────────────
  if (!state.activeSession || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-stone-500 mb-4">Loading lesson...</p>
        </div>
      </div>
    );
  }

  const questionIndex = state.activeSession.questionIndex;
  const totalQuestions = lesson.questions.length;
  // The current question to display is the one BEFORE the index advances
  // (index advances after answer, so we show index - 1 if pendingContinue)
  const displayIndex = pendingContinue ? questionIndex - 1 : questionIndex;
  const displayQuestion = lesson.questions[displayIndex];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F3EE' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-40 px-4 py-3"
        style={{
          background: 'rgba(245,243,238,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={handleAbandon}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-stone-200 transition-colors shrink-0"
          >
            <X size={18} className="text-stone-500" />
          </button>
          <ProgressBar current={displayIndex} total={totalQuestions} />
          <HeartsDisplay hearts={state.hearts} />
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-[10px] font-semibold text-stone-400">
            Day {day} — {lesson.title}
          </span>
          <span className="text-[10px] font-bold text-stone-500">
            {displayIndex + 1} / {totalQuestions}
          </span>
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 px-4 py-5 overflow-y-auto">
        <AnimatePresence mode="wait">
          {displayQuestion && (
            <motion.div
              key={displayQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="sticky bottom-0 px-4 pb-6 pt-3"
            style={{
              background: 'rgba(245,243,238,0.95)',
              backdropFilter: 'blur(8px)',
              borderTop: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            {/* Hearts lost warning */}
            {lastAnswerCorrect === false && state.hearts === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[11px] font-bold text-rose-600 text-center mb-2"
              >
                ❤️ Last heart lost! Complete this lesson or study topics to earn hearts back.
              </motion.p>
            )}
            <button
              onClick={handleContinue}
              className={`w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 active:scale-95 transition-all ${
                lastAnswerCorrect ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {questionIndex >= totalQuestions ? 'See Results' : 'Continue'}
              <ChevronRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
