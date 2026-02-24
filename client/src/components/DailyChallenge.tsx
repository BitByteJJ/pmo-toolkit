// DailyChallenge — shows one question per day from the quiz pool
// Deterministic seed based on date so everyone gets the same question each day.
// Tracks streak in localStorage.

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Flame, Star, ChevronRight } from 'lucide-react';
import { useLocation } from 'wouter';
import { getDailyChallenge, getDeckIdForQuestion } from '@/lib/quizData';
import { getDeckById } from '@/lib/pmoData';

const STREAK_KEY = 'pmo_daily_streak';
const LAST_COMPLETED_KEY = 'pmo_daily_last_completed';

interface StreakData {
  count: number;
  lastDate: string; // YYYY-MM-DD
}

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) return JSON.parse(raw) as StreakData;
  } catch { /* ignore */ }
  return { count: 0, lastDate: '' };
}

function saveStreak(data: StreakData) {
  try { localStorage.setItem(STREAK_KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

function wasCompletedToday(): boolean {
  try {
    return localStorage.getItem(LAST_COMPLETED_KEY) === getTodayStr();
  } catch { return false; }
}

function markCompletedToday() {
  try { localStorage.setItem(LAST_COMPLETED_KEY, getTodayStr()); } catch { /* ignore */ }
}

type AnswerState = 'unanswered' | 'correct' | 'wrong';

export default function DailyChallenge({ darkMode = false }: { darkMode?: boolean }) {
  const [, navigate] = useLocation();
  const question = getDailyChallenge();
  const deckId = getDeckIdForQuestion(question.id) ?? 'tools';
  const deck = getDeckById(deckId);

  const [selected, setSelected] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [streak, setStreak] = useState<StreakData>(loadStreak);
  const [alreadyDone, setAlreadyDone] = useState(wasCompletedToday);
  const [collapsed, setCollapsed] = useState(alreadyDone);

  // Check if streak should be reset (missed a day)
  useEffect(() => {
    const today = getTodayStr();
    const yesterday = (() => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    })();
    const s = loadStreak();
    if (s.lastDate && s.lastDate !== today && s.lastDate !== yesterday) {
      const reset = { count: 0, lastDate: s.lastDate };
      saveStreak(reset);
      setStreak(reset);
    }
  }, []);

  const handleSelect = (index: number) => {
    if (answerState !== 'unanswered' || alreadyDone) return;
    setSelected(index);
    const correct = index === question.correctIndex;
    setAnswerState(correct ? 'correct' : 'wrong');

    if (!alreadyDone) {
      markCompletedToday();
      setAlreadyDone(true);
      if (correct) {
        const today = getTodayStr();
        const s = loadStreak();
        const yesterday = (() => {
          const d = new Date();
          d.setDate(d.getDate() - 1);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        })();
        const newCount = (s.lastDate === yesterday || s.lastDate === today) ? s.count + 1 : 1;
        const updated = { count: newCount, lastDate: today };
        saveStreak(updated);
        setStreak(updated);
      }
    }
  };

  const color = deck?.color ?? '#475569';

  // Theme-aware colour helpers — proper contrast for both modes
  const cardBg = darkMode ? 'rgba(255,255,255,0.06)' : '#ffffff';
  const cardBorder = `1.5px solid ${color}30`;
  const cardShadow = darkMode
    ? `0 4px 20px ${color}30, 0 2px 8px rgba(0,0,0,0.3), 0 0 0 1px ${color}25`
    : `0 3px 12px ${color}20, 0 1px 4px rgba(0,0,0,0.06)`;

  // Text colours — dark mode uses light text, light mode uses dark text
  const titleColor = darkMode ? '#f1f5f9' : '#0f172a';
  const subtitleColor = darkMode ? 'rgba(148,163,184,0.7)' : '#64748b';
  const chevronColor = darkMode ? 'rgba(148,163,184,0.7)' : '#94a3b8';
  const questionColor = darkMode ? '#e2e8f0' : '#1e293b';
  const typeColor = darkMode ? 'rgba(148,163,184,0.6)' : '#64748b';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: cardBg,
        backdropFilter: darkMode ? 'blur(12px)' : undefined,
        boxShadow: cardShadow,
        border: cardBorder,
      }}
    >
      {/* Header */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
            <Star size={13} style={{ color }} />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold" style={{ color: titleColor }}>Daily Challenge</p>
            <p className="text-[10px]" style={{ color: subtitleColor }}>
              {alreadyDone ? "Completed today ✓" : "One question a day keeps the PM away"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {streak.count > 0 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: darkMode ? 'rgba(251,191,36,0.15)' : '#FEF3C7' }}>
              <Flame size={11} className="text-amber-500" />
              <span className="text-[10px] font-bold" style={{ color: darkMode ? '#FCD34D' : '#92400E' }}>{streak.count}</span>
            </div>
          )}
          <ChevronRight
            size={14}
            style={{ color: chevronColor, transform: collapsed ? 'rotate(90deg)' : 'rotate(270deg)', transition: 'transform 0.2s' }}
          />
        </div>
      </button>

      {/* Body */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {/* Deck badge */}
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: color }}
                >
                  {deck?.title ?? 'Quiz'}
                </span>
                <span className="text-[9px]" style={{ color: typeColor }}>
                  {question.type === 'truefalse' ? 'TRUE / FALSE' : question.type === 'scenario' ? 'SCENARIO' : 'MULTIPLE CHOICE'}
                </span>
              </div>

              {/* Question */}
              <p className="text-[13px] font-semibold leading-relaxed" style={{ fontFamily: 'Sora, sans-serif', color: questionColor }}>
                {question.prompt}
              </p>

              {/* Options */}
              <div className="flex flex-col gap-2">
                {question.options.map((opt, i) => {
                  let optBg: string;
                  let optBorder: string;
                  let optTextColor: string;
                  let optOpacity = 1;

                  if (answerState === 'unanswered') {
                    optBg = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
                    optBorder = darkMode ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(0,0,0,0.10)';
                    optTextColor = darkMode ? '#e2e8f0' : '#1e293b';
                  } else if (i === question.correctIndex) {
                    optBg = darkMode ? 'rgba(52,211,153,0.15)' : '#f0fdf4';
                    optBorder = '2px solid #10b981';
                    optTextColor = darkMode ? '#6ee7b7' : '#065f46';
                  } else if (i === selected && answerState === 'wrong') {
                    optBg = darkMode ? 'rgba(239,68,68,0.15)' : '#fef2f2';
                    optBorder = '2px solid #ef4444';
                    optTextColor = darkMode ? '#fca5a5' : '#991b1b';
                  } else {
                    optBg = darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)';
                    optBorder = darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.06)';
                    optTextColor = darkMode ? '#64748b' : '#94a3b8';
                    optOpacity = 0.5;
                  }

                  const hoverClass = answerState === 'unanswered' && !alreadyDone ? 'cursor-pointer' : '';

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      disabled={answerState !== 'unanswered' || alreadyDone}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all text-[12px] font-medium flex items-center gap-2 ${hoverClass}`}
                      style={{
                        background: optBg,
                        border: optBorder,
                        color: optTextColor,
                        opacity: optOpacity,
                      }}
                    >
                      <span
                        className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0"
                        style={{
                          borderColor: darkMode ? 'rgba(148,163,184,0.3)' : 'rgba(0,0,0,0.2)',
                          color: darkMode ? 'rgba(148,163,184,0.7)' : '#475569',
                        }}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {answerState !== 'unanswered' && i === question.correctIndex && (
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      )}
                      {answerState !== 'unanswered' && i === selected && answerState === 'wrong' && (
                        <XCircle size={14} className="text-red-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {answerState !== 'unanswered' && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl p-3"
                    style={{
                      background: answerState === 'correct'
                        ? (darkMode ? 'rgba(52,211,153,0.12)' : '#ecfdf5')
                        : (darkMode ? 'rgba(251,191,36,0.12)' : '#fffbeb'),
                      border: answerState === 'correct'
                        ? (darkMode ? '1px solid rgba(52,211,153,0.3)' : '1px solid #a7f3d0')
                        : (darkMode ? '1px solid rgba(251,191,36,0.3)' : '1px solid #fde68a'),
                    }}
                  >
                    <p className="text-[11px] leading-relaxed" style={{ color: darkMode ? 'rgba(203,213,225,0.85)' : '#374151' }}>
                      {question.explanation}
                    </p>
                    <button
                      onClick={() => navigate(`/deck/${deckId}`)}
                      className="mt-2 text-[10px] font-bold flex items-center gap-1"
                      style={{ color }}
                    >
                      Explore {deck?.title} deck <ChevronRight size={10} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Already done state */}
              {alreadyDone && answerState === 'unanswered' && (
                <div
                  className="rounded-xl p-3 text-center"
                  style={{
                    background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                  }}
                >
                  <p className="text-[11px]" style={{ color: darkMode ? 'rgba(148,163,184,0.7)' : '#475569' }}>
                    You've completed today's challenge. Come back tomorrow!
                  </p>
                  {streak.count > 0 && (
                    <p className="text-[11px] font-bold mt-1" style={{ color: darkMode ? '#FCD34D' : '#D97706' }}>
                      🔥 {streak.count}-day streak — keep it up!
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
