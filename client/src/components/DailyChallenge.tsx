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

export default function DailyChallenge() {
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
      // Missed a day — reset streak
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
  const bgColor = deck?.bgColor ?? '#f8fafc';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl overflow-hidden bg-white"
      style={{ boxShadow: `0 3px 12px ${color}20, 0 1px 4px rgba(0,0,0,0.06)`, border: `1.5px solid ${color}30` }}
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
            <p className="text-sm font-bold text-stone-800">Daily Challenge</p>
            <p className="text-[10px] text-stone-400">
              {alreadyDone ? "Completed today ✓" : "One question a day keeps the PM away"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {streak.count > 0 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FEF3C7' }}>
              <Flame size={11} className="text-amber-500" />
              <span className="text-[10px] font-bold text-amber-700">{streak.count}</span>
            </div>
          )}
          <ChevronRight
            size={14}
            className="text-stone-400 transition-transform"
            style={{ transform: collapsed ? 'rotate(90deg)' : 'rotate(270deg)' }}
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
                <span className="text-[9px] text-stone-400">
                  {question.type === 'truefalse' ? 'TRUE / FALSE' : question.type === 'scenario' ? 'SCENARIO' : 'MULTIPLE CHOICE'}
                </span>
              </div>

              {/* Question */}
              <p className="text-[13px] font-semibold text-stone-800 leading-relaxed" style={{ fontFamily: 'Sora, sans-serif' }}>
                {question.prompt}
              </p>

              {/* Options */}
              <div className="flex flex-col gap-2">
                {question.options.map((opt, i) => {
                  let style = 'border border-stone-200 text-stone-700';
                  if (answerState !== 'unanswered') {
                    if (i === question.correctIndex) style = 'border-2 border-emerald-500 bg-emerald-50 text-stone-700';
                    else if (i === selected && answerState === 'wrong') style = 'border-2 border-red-400 bg-red-50 text-stone-500';
                    else style = 'border border-stone-200 text-stone-400 opacity-50';
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      disabled={answerState !== 'unanswered' || alreadyDone}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all text-[12px] font-medium flex items-center gap-2 ${style} ${answerState === 'unanswered' && !alreadyDone ? 'hover:bg-stone-50 cursor-pointer' : ''}`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0"
                        style={{ borderColor: '#d6d3d1', color: '#78716c' }}
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
                    className={`rounded-xl p-3 ${answerState === 'correct' ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}
                  >
                    <p className="text-[11px] text-stone-600 leading-relaxed">{question.explanation}</p>
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
                <div className="rounded-xl p-3 bg-stone-50 border border-stone-200 text-center">
                  <p className="text-[11px] text-stone-500">You've completed today's challenge. Come back tomorrow!</p>
                  {streak.count > 0 && (
                    <p className="text-[11px] font-bold text-amber-600 mt-1">
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
