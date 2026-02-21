// Certification Prep Mode — PMP, PRINCE2, APM exam practice
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, CheckCircle2, XCircle, BookOpen, Trophy, RotateCcw, Clock, Target, Brain, Award } from 'lucide-react';
import { CERT_EXAMS, CERT_QUESTIONS, getQuestionsByCert, getCertById, type CertType, type CertQuestion } from '@/lib/certPrepData';

const STORAGE_KEY = 'stratalign-cert-progress';

interface CertProgress {
  [certId: string]: {
    questionsAttempted: number;
    questionsCorrect: number;
    lastAttempted: number;
    domainScores: Record<string, { correct: number; total: number }>;
  };
}

function loadProgress(): CertProgress {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveProgress(p: CertProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

// ── Exam Selection Screen ──
function ExamSelector({ onSelect }: { onSelect: (cert: CertType) => void }) {
  const [, navigate] = useLocation();
  const progress = loadProgress();

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: '#F5F3EE' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-40 px-4 pt-safe"
        style={{
          background: 'rgba(245,243,238,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex items-center gap-3 py-3">
          <button
            onClick={() => navigate('/')}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft size={18} className="text-stone-600" />
          </button>
          <div>
            <h1 className="text-base font-black text-stone-900" style={{ fontFamily: 'Sora, sans-serif' }}>
              Certification Prep
            </h1>
            <p className="text-[10px] text-stone-400 font-medium">PMP · PRINCE2 · APM PMQ</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">
        {/* Intro banner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4"
          style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #0284C7 100%)', boxShadow: '0 4px 16px rgba(2,132,199,0.2)' }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎓</span>
            <div>
              <p className="text-sm font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>Exam Practice Mode</p>
              <p className="text-[11px] text-blue-100 mt-1 leading-relaxed">
                Practice with exam-style questions for PMP, PRINCE2, and APM PMQ. Each question includes a detailed explanation linked to the relevant card.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Exam cards */}
        <div className="space-y-3">
          {CERT_EXAMS.map((exam, i) => {
            const prog = progress[exam.id];
            const pct = prog ? Math.round((prog.questionsCorrect / Math.max(prog.questionsAttempted, 1)) * 100) : 0;
            const totalQ = getQuestionsByCert(exam.id).length;

            return (
              <motion.button
                key={exam.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => onSelect(exam.id)}
                className="w-full text-left rounded-2xl overflow-hidden"
                style={{ boxShadow: `0 4px 16px ${exam.color}20, 0 1px 4px rgba(0,0,0,0.06)` }}
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
              >
                {/* Top accent */}
                <div className="h-1 w-full" style={{ backgroundColor: exam.color }} />
                <div className="p-4" style={{ backgroundColor: exam.bgColor }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="text-2xl shrink-0">{exam.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md text-white"
                            style={{ backgroundColor: exam.color }}
                          >
                            {exam.name}
                          </span>
                          <span className="text-[9px] text-stone-400 font-medium">{totalQ} practice questions</span>
                        </div>
                        <h3
                          className="text-sm font-bold leading-tight mb-1"
                          style={{ fontFamily: 'Sora, sans-serif', color: exam.textColor }}
                        >
                          {exam.fullName}
                        </h3>
                        <p className="text-[10px] leading-relaxed line-clamp-2" style={{ color: exam.textColor, opacity: 0.65 }}>
                          {exam.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} style={{ color: exam.color }} className="shrink-0 mt-1" />
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-3 mt-3 pt-3" style={{ borderTop: `1px solid ${exam.color}20` }}>
                    <div className="flex items-center gap-1 text-[10px]" style={{ color: exam.textColor, opacity: 0.6 }}>
                      <Clock size={10} />
                      <span>{exam.timeMinutes} min exam</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px]" style={{ color: exam.textColor, opacity: 0.6 }}>
                      <Target size={10} />
                      <span>{exam.questionCount} real questions</span>
                    </div>
                    {prog && prog.questionsAttempted > 0 && (
                      <div className="ml-auto flex items-center gap-1 text-[10px] font-bold" style={{ color: exam.color }}>
                        <Award size={10} />
                        <span>{pct}% accuracy</span>
                      </div>
                    )}
                  </div>

                  {/* Progress bar if started */}
                  {prog && prog.questionsAttempted > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px]" style={{ color: exam.textColor, opacity: 0.5 }}>
                          {prog.questionsAttempted} questions attempted
                        </span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: exam.color + '25' }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((prog.questionsAttempted / totalQ) * 100, 100)}%`, backgroundColor: exam.color }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Tip */}
        <div className="rounded-2xl p-4 bg-white" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div className="flex items-start gap-3">
            <Brain size={16} className="text-violet-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-stone-700 mb-1">Study tip</p>
              <p className="text-[10px] text-stone-500 leading-relaxed">
                Each practice question is linked to a StratAlign card. After answering, tap the card reference to read the full explanation and deepen your understanding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Domain Selection Screen ──
function DomainSelector({
  cert,
  onSelectDomain,
  onBack,
}: {
  cert: CertType;
  onSelectDomain: (domain: string | null) => void;
  onBack: () => void;
}) {
  const exam = getCertById(cert)!;
  const progress = loadProgress();
  const prog = progress[cert];
  const allQuestions = getQuestionsByCert(cert);

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: '#F5F3EE' }}>
      <div
        className="sticky top-0 z-40 px-4 pt-safe"
        style={{
          background: 'rgba(245,243,238,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex items-center gap-3 py-3">
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-stone-100 transition-colors">
            <ArrowLeft size={18} className="text-stone-600" />
          </button>
          <div>
            <h1 className="text-base font-black text-stone-900" style={{ fontFamily: 'Sora, sans-serif' }}>
              {exam.name}
            </h1>
            <p className="text-[10px] text-stone-400 font-medium">{exam.fullName}</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-3">
        {/* Practice all */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onSelectDomain(null)}
          className="w-full text-left rounded-2xl p-4 flex items-center gap-4"
          style={{ background: `linear-gradient(135deg, ${exam.color} 0%, ${exam.color}CC 100%)`, boxShadow: `0 4px 16px ${exam.color}30` }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Trophy size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>All Domains</p>
            <p className="text-[10px] text-white/70 mt-0.5">{allQuestions.length} questions across all domains</p>
          </div>
          <ChevronRight size={16} className="text-white/70 shrink-0" />
        </motion.button>

        {/* Per domain */}
        <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.12em] px-1">By Domain</p>
        {exam.domains.map((domain, i) => {
          const domainQ = allQuestions.filter(q => q.domain === domain);
          const domainProg = prog?.domainScores?.[domain];
          const pct = domainProg ? Math.round((domainProg.correct / Math.max(domainProg.total, 1)) * 100) : null;

          return (
            <motion.button
              key={domain}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i + 1) * 0.06 }}
              onClick={() => onSelectDomain(domain)}
              className="w-full text-left rounded-2xl p-4 bg-white flex items-center gap-4"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white text-sm font-bold"
                style={{ backgroundColor: exam.color }}
              >
                {domain.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-stone-800" style={{ fontFamily: 'Sora, sans-serif' }}>{domain}</p>
                <p className="text-[10px] text-stone-400 mt-0.5">{domainQ.length} questions</p>
              </div>
              {pct !== null && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: exam.color + '15', color: exam.color }}>
                  {pct}%
                </span>
              )}
              <ChevronRight size={14} className="text-stone-300 shrink-0" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ── Quiz Screen ──
function QuizSession({
  cert,
  domain,
  onFinish,
  onBack,
}: {
  cert: CertType;
  domain: string | null;
  onFinish: (results: { correct: number; total: number; answers: Record<string, number> }) => void;
  onBack: () => void;
}) {
  const [, navigate] = useLocation();
  const exam = getCertById(cert)!;
  const allQ = domain
    ? CERT_QUESTIONS.filter(q => q.cert === cert && q.domain === domain)
    : getQuestionsByCert(cert);

  // Shuffle and take up to 10
  const [questions] = useState<CertQuestion[]>(() => {
    const shuffled = [...allQ].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(10, shuffled.length));
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [correctCount, setCorrectCount] = useState(0);

  const current = questions[currentIdx];
  const isCorrect = selectedAnswer === current.correctIndex;
  const isLast = currentIdx === questions.length - 1;

  function handleAnswer(idx: number) {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    const newAnswers = { ...answers, [current.id]: idx };
    setAnswers(newAnswers);
    if (idx === current.correctIndex) {
      setCorrectCount(c => c + 1);
    }
  }

  function handleNext() {
    if (isLast) {
      onFinish({ correct: correctCount + (selectedAnswer === current.correctIndex ? 0 : 0), total: questions.length, answers });
    } else {
      setCurrentIdx(i => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  }

  const progress = ((currentIdx) / questions.length) * 100;

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: '#F5F3EE' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-40 px-4 pt-safe"
        style={{
          background: 'rgba(245,243,238,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex items-center gap-3 py-3">
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-stone-100 transition-colors">
            <ArrowLeft size={18} className="text-stone-600" />
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold" style={{ color: exam.color }}>
                {exam.name} {domain ? `· ${domain}` : ''}
              </span>
              <span className="text-[10px] text-stone-400">{currentIdx + 1} / {questions.length}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden bg-stone-200">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: exam.color }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {/* Domain badge */}
            <div className="mb-3">
              <span
                className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md text-white"
                style={{ backgroundColor: exam.color }}
              >
                {current.domain}
              </span>
            </div>

            {/* Question */}
            <div className="rounded-2xl p-5 bg-white mb-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <p className="text-sm font-semibold text-stone-800 leading-relaxed" style={{ fontFamily: 'Sora, sans-serif' }}>
                {current.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2.5 mb-4">
              {current.options.map((option, idx) => {
                let bg = 'bg-white';
                let border = 'border-transparent';
                let textColor = 'text-stone-700';
                let icon = null;

                if (selectedAnswer !== null) {
                  if (idx === current.correctIndex) {
                    bg = 'bg-emerald-50';
                    border = 'border-emerald-400';
                    textColor = 'text-emerald-800';
                    icon = <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />;
                  } else if (idx === selectedAnswer && idx !== current.correctIndex) {
                    bg = 'bg-red-50';
                    border = 'border-red-400';
                    textColor = 'text-red-800';
                    icon = <XCircle size={16} className="text-red-400 shrink-0" />;
                  }
                }

                return (
                  <motion.button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full text-left rounded-xl p-4 border-2 flex items-start gap-3 transition-all ${bg} ${border}`}
                    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                    whileHover={selectedAnswer === null ? { scale: 1.01 } : {}}
                    whileTap={selectedAnswer === null ? { scale: 0.99 } : {}}
                  >
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                      style={{
                        backgroundColor: selectedAnswer === null ? exam.color + '15' : (idx === current.correctIndex ? '#10B981' : idx === selectedAnswer ? '#EF4444' : '#E5E7EB'),
                        color: selectedAnswer === null ? exam.color : (idx === current.correctIndex ? '#fff' : idx === selectedAnswer ? '#fff' : '#9CA3AF'),
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className={`text-[12px] leading-relaxed flex-1 ${textColor}`}>{option}</span>
                    {icon}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4 mb-4"
                  style={{
                    backgroundColor: isCorrect ? '#ECFDF5' : '#FFF1F2',
                    border: `1.5px solid ${isCorrect ? '#6EE7B7' : '#FECDD3'}`,
                  }}
                >
                  <div className="flex items-start gap-2 mb-2">
                    {isCorrect
                      ? <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      : <XCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                    }
                    <p className={`text-[11px] font-bold ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                      {isCorrect ? 'Correct!' : 'Not quite'}
                    </p>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">{current.explanation}</p>
                  {current.cardRef && (
                    <button
                      onClick={() => navigate(`/card/${current.cardRef}`)}
                      className="mt-2 flex items-center gap-1 text-[10px] font-bold"
                      style={{ color: exam.color }}
                    >
                      <BookOpen size={10} />
                      Read the card →
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next button */}
            {showExplanation && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleNext}
                className="w-full rounded-2xl py-4 text-sm font-bold text-white flex items-center justify-center gap-2"
                style={{ backgroundColor: exam.color }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {isLast ? 'See Results' : 'Next Question'}
                <ChevronRight size={16} />
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Results Screen ──
function ResultsScreen({
  cert,
  domain,
  correct,
  total,
  onRetry,
  onBack,
}: {
  cert: CertType;
  domain: string | null;
  correct: number;
  total: number;
  onRetry: () => void;
  onBack: () => void;
}) {
  const exam = getCertById(cert)!;
  const pct = Math.round((correct / total) * 100);
  const passed = pct >= 70;

  return (
    <div className="min-h-screen pb-28 flex flex-col" style={{ backgroundColor: '#F5F3EE' }}>
      <div
        className="sticky top-0 z-40 px-4 pt-safe"
        style={{
          background: 'rgba(245,243,238,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex items-center gap-3 py-3">
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-stone-100 transition-colors">
            <ArrowLeft size={18} className="text-stone-600" />
          </button>
          <h1 className="text-base font-black text-stone-900" style={{ fontFamily: 'Sora, sans-serif' }}>Results</h1>
        </div>
      </div>

      <div className="px-4 pt-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: passed ? '#ECFDF5' : '#FFF1F2' }}
        >
          {passed
            ? <Trophy size={40} className="text-emerald-500" />
            : <RotateCcw size={40} className="text-red-400" />
          }
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <p className="text-4xl font-black mb-1" style={{ fontFamily: 'Sora, sans-serif', color: passed ? '#059669' : '#DC2626' }}>
            {pct}%
          </p>
          <p className="text-sm font-bold text-stone-700 mb-1">{correct} / {total} correct</p>
          <p className="text-[11px] text-stone-400">
            {exam.name} {domain ? `· ${domain}` : '· All Domains'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-6 rounded-2xl p-4 w-full text-left"
          style={{
            backgroundColor: passed ? '#ECFDF5' : '#FFF7ED',
            border: `1.5px solid ${passed ? '#6EE7B7' : '#FED7AA'}`,
          }}
        >
          <p className="text-[11px] font-bold mb-1" style={{ color: passed ? '#065F46' : '#92400E' }}>
            {passed ? '🎉 Great work!' : '💪 Keep practising'}
          </p>
          <p className="text-[11px] leading-relaxed" style={{ color: passed ? '#047857' : '#B45309' }}>
            {passed
              ? `You scored ${pct}% — above the typical 70% pass mark. Review the explanations for any questions you missed to reinforce your understanding.`
              : `You scored ${pct}%. Focus on the questions you got wrong and read the linked cards for deeper understanding. Aim for 70%+ to be exam-ready.`
            }
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-4 w-full space-y-3"
        >
          <button
            onClick={onRetry}
            className="w-full rounded-2xl py-4 text-sm font-bold text-white flex items-center justify-center gap-2"
            style={{ backgroundColor: exam.color }}
          >
            <RotateCcw size={16} />
            Try Again
          </button>
          <button
            onClick={onBack}
            className="w-full rounded-2xl py-4 text-sm font-bold text-stone-600 bg-white flex items-center justify-center gap-2"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
          >
            Choose Another Exam
          </button>
        </motion.div>
      </div>
    </div>
  );
}

// ── Main Page ──
type Screen = 'select' | 'domain' | 'quiz' | 'results';

export default function CertPrepPage() {
  const [screen, setScreen] = useState<Screen>('select');
  const [selectedCert, setSelectedCert] = useState<CertType | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [quizResults, setQuizResults] = useState<{ correct: number; total: number; answers: Record<string, number> } | null>(null);

  function handleSelectCert(cert: CertType) {
    setSelectedCert(cert);
    setScreen('domain');
  }

  function handleSelectDomain(domain: string | null) {
    setSelectedDomain(domain);
    setScreen('quiz');
  }

  function handleFinish(results: { correct: number; total: number; answers: Record<string, number> }) {
    setQuizResults(results);
    // Save progress
    if (selectedCert) {
      const progress = loadProgress();
      const existing = progress[selectedCert] || { questionsAttempted: 0, questionsCorrect: 0, lastAttempted: 0, domainScores: {} };
      existing.questionsAttempted += results.total;
      existing.questionsCorrect += results.correct;
      existing.lastAttempted = Date.now();
      if (selectedDomain) {
        const ds = existing.domainScores[selectedDomain] || { correct: 0, total: 0 };
        ds.total += results.total;
        ds.correct += results.correct;
        existing.domainScores[selectedDomain] = ds;
      }
      progress[selectedCert] = existing;
      saveProgress(progress);
    }
    setScreen('results');
  }

  if (screen === 'select') {
    return <ExamSelector onSelect={handleSelectCert} />;
  }

  if (screen === 'domain' && selectedCert) {
    return (
      <DomainSelector
        cert={selectedCert}
        onSelectDomain={handleSelectDomain}
        onBack={() => setScreen('select')}
      />
    );
  }

  if (screen === 'quiz' && selectedCert) {
    return (
      <QuizSession
        cert={selectedCert}
        domain={selectedDomain}
        onFinish={handleFinish}
        onBack={() => setScreen('domain')}
      />
    );
  }

  if (screen === 'results' && selectedCert && quizResults) {
    return (
      <ResultsScreen
        cert={selectedCert}
        domain={selectedDomain}
        correct={quizResults.correct}
        total={quizResults.total}
        onRetry={() => setScreen('quiz')}
        onBack={() => setScreen('select')}
      />
    );
  }

  return null;
}
