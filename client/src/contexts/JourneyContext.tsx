import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import {
  JOURNEY_LESSONS,
  JOURNEY_UNITS,
  getLevelForXP,
  getNextLevel,
  type JourneyLesson,
  type JourneyQuestion,
} from '@/lib/journeyData';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
export const MAX_HEARTS = 3;
export const HEARTS_REFILL_HOURS = 24;
export const TOPICS_TO_EARN_HEART = 5;
const STORAGE_KEY = 'pmo-journey-v1';

// ─── STATE TYPES ──────────────────────────────────────────────────────────────

/** One completed question attempt */
export interface QuestionAttempt {
  questionId: string;
  correct: boolean;
  selectedIndex: number;
  timestamp: number;
}

/** One completed daily session */
export interface DailySession {
  day: number;
  lessonId: string;
  completedAt: number;
  xpEarned: number;
  correctCount: number;
  totalCount: number;
  /** Whether the lesson was completed (all questions answered) */
  completed: boolean;
}

/** Earn-a-heart progress: track how many topics studied since last heart earned */
export interface EarnHeartProgress {
  topicsStudied: string[]; // card IDs studied
  heartsEarned: number;    // hearts earned via this mechanism
}

export interface JourneyState {
  /** Current hearts (0–3) */
  hearts: number;
  /** Timestamp when hearts were last depleted to 0 (for 24h refill countdown) */
  heartsDepletedAt: number | null;
  /** Total XP accumulated */
  totalXP: number;
  /** Highest day unlocked (starts at 1) */
  highestDayUnlocked: number;
  /** Map of lessonId → DailySession */
  completedSessions: Record<string, DailySession>;
  /** Map of questionId → last attempt */
  questionAttempts: Record<string, QuestionAttempt>;
  /** Current active session (in-progress) */
  activeSession: {
    lessonId: string;
    day: number;
    questionIndex: number;
    answers: QuestionAttempt[];
    startedAt: number;
  } | null;
  /** Earn-heart progress */
  earnHeartProgress: EarnHeartProgress;
  /** Streak: consecutive days with at least one completed lesson */
  currentStreak: number;
  lastStreakDate: string | null; // ISO date string YYYY-MM-DD
}

// ─── ACTIONS ──────────────────────────────────────────────────────────────────
type Action =
  | { type: 'START_LESSON'; lessonId: string; day: number }
  | { type: 'ANSWER_QUESTION'; questionId: string; selectedIndex: number; correct: boolean; xp: number }
  | { type: 'COMPLETE_LESSON' }
  | { type: 'ABANDON_LESSON' }
  | { type: 'REFILL_HEARTS' }
  | { type: 'STUDY_TOPIC_FOR_HEART'; cardId: string }
  | { type: 'LOAD_STATE'; state: JourneyState };

// ─── INITIAL STATE ────────────────────────────────────────────────────────────
const INITIAL_STATE: JourneyState = {
  hearts: MAX_HEARTS,
  heartsDepletedAt: null,
  totalXP: 0,
  highestDayUnlocked: 1,
  completedSessions: {},
  questionAttempts: {},
  activeSession: null,
  earnHeartProgress: { topicsStudied: [], heartsEarned: 0 },
  currentStreak: 0,
  lastStreakDate: null,
};

// ─── REDUCER ──────────────────────────────────────────────────────────────────
function reducer(state: JourneyState, action: Action): JourneyState {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.state;

    case 'START_LESSON': {
      if (state.hearts <= 0) return state; // guard: no hearts
      return {
        ...state,
        activeSession: {
          lessonId: action.lessonId,
          day: action.day,
          questionIndex: 0,
          answers: [],
          startedAt: Date.now(),
        },
      };
    }

    case 'ANSWER_QUESTION': {
      if (!state.activeSession) return state;
      const attempt: QuestionAttempt = {
        questionId: action.questionId,
        correct: action.correct,
        selectedIndex: action.selectedIndex,
        timestamp: Date.now(),
      };
      let newHearts = state.hearts;
      let heartsDepletedAt = state.heartsDepletedAt;

      if (!action.correct) {
        newHearts = Math.max(0, state.hearts - 1);
        if (newHearts === 0 && state.hearts > 0) {
          heartsDepletedAt = Date.now();
        }
      }

      const newXP = state.totalXP + (action.correct ? action.xp : 0);
      const lesson = JOURNEY_LESSONS.find(l => l.id === state.activeSession!.lessonId);
      const nextIndex = state.activeSession.questionIndex + 1;

      return {
        ...state,
        hearts: newHearts,
        heartsDepletedAt,
        totalXP: newXP,
        questionAttempts: {
          ...state.questionAttempts,
          [action.questionId]: attempt,
        },
        activeSession: {
          ...state.activeSession,
          questionIndex: nextIndex,
          answers: [...state.activeSession.answers, attempt],
        },
      };
    }

    case 'COMPLETE_LESSON': {
      if (!state.activeSession) return state;
      const session = state.activeSession;
      const lesson = JOURNEY_LESSONS.find(l => l.id === session.lessonId);
      if (!lesson) return state;

      const correctCount = session.answers.filter(a => a.correct).length;
      const xpEarned = session.answers.reduce((sum, a) => {
        if (!a.correct) return sum;
        const q = lesson.questions.find(q => q.id === a.questionId);
        return sum + (q?.xp ?? 0);
      }, 0);

      const dailySession: DailySession = {
        day: session.day,
        lessonId: session.lessonId,
        completedAt: Date.now(),
        xpEarned,
        correctCount,
        totalCount: lesson.questions.length,
        completed: true,
      };

      // Unlock next day
      const nextDay = session.day + 1;
      const newHighest = Math.max(state.highestDayUnlocked, nextDay);

      // Update streak
      const today = new Date().toISOString().slice(0, 10);
      let newStreak = state.currentStreak;
      let lastStreakDate = state.lastStreakDate;
      if (lastStreakDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        newStreak = lastStreakDate === yesterday ? state.currentStreak + 1 : 1;
        lastStreakDate = today;
      }

      return {
        ...state,
        completedSessions: {
          ...state.completedSessions,
          [session.lessonId]: dailySession,
        },
        highestDayUnlocked: newHighest,
        activeSession: null,
        currentStreak: newStreak,
        lastStreakDate,
      };
    }

    case 'ABANDON_LESSON': {
      return { ...state, activeSession: null };
    }

    case 'REFILL_HEARTS': {
      // Only refill if 24h have passed since depletion
      if (!state.heartsDepletedAt) return state;
      const elapsed = Date.now() - state.heartsDepletedAt;
      if (elapsed < HEARTS_REFILL_HOURS * 3600 * 1000) return state;
      return {
        ...state,
        hearts: MAX_HEARTS,
        heartsDepletedAt: null,
      };
    }

    case 'STUDY_TOPIC_FOR_HEART': {
      const { cardId } = action;
      const already = state.earnHeartProgress.topicsStudied.includes(cardId);
      if (already) return state;

      const newStudied = [...state.earnHeartProgress.topicsStudied, cardId];
      const newHeartsEarned = state.earnHeartProgress.heartsEarned;

      // Every TOPICS_TO_EARN_HEART topics studied = +1 heart (up to MAX_HEARTS)
      const totalEarnable = Math.floor(newStudied.length / TOPICS_TO_EARN_HEART);
      const heartsToAdd = Math.max(0, totalEarnable - newHeartsEarned);
      const newHearts = Math.min(MAX_HEARTS, state.hearts + heartsToAdd);

      return {
        ...state,
        hearts: newHearts,
        heartsDepletedAt: newHearts > 0 ? null : state.heartsDepletedAt,
        earnHeartProgress: {
          topicsStudied: newStudied,
          heartsEarned: newHeartsEarned + heartsToAdd,
        },
      };
    }

    default:
      return state;
  }
}

// ─── CONTEXT ──────────────────────────────────────────────────────────────────
interface JourneyContextValue {
  state: JourneyState;
  // Derived
  currentLesson: JourneyLesson | null;
  currentQuestion: JourneyQuestion | null;
  level: ReturnType<typeof getLevelForXP>;
  nextLevel: ReturnType<typeof getNextLevel>;
  xpToNextLevel: number;
  xpProgressPercent: number;
  heartsRefillsAt: Date | null;
  heartsRefillCountdown: string;
  topicsStudiedForHeart: number; // 0–TOPICS_TO_EARN_HEART
  canStartLesson: (day: number) => boolean;
  isDayCompleted: (day: number) => boolean;
  isDayLocked: (day: number) => boolean;
  // Actions
  startLesson: (lessonId: string, day: number) => void;
  answerQuestion: (questionId: string, selectedIndex: number, correct: boolean, xp: number) => void;
  completeLesson: () => void;
  abandonLesson: () => void;
  studyTopicForHeart: (cardId: string) => void;
  checkAndRefillHearts: () => void;
}

const JourneyContext = createContext<JourneyContextValue | null>(null);

// ─── PROVIDER ─────────────────────────────────────────────────────────────────
export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as JourneyState;
        dispatch({ type: 'LOAD_STATE', state: saved });
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist to localStorage on every state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage errors
    }
  }, [state]);

  // Auto-check heart refill on mount and every minute
  useEffect(() => {
    dispatch({ type: 'REFILL_HEARTS' });
    const interval = setInterval(() => {
      dispatch({ type: 'REFILL_HEARTS' });
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  // ── Derived values ──────────────────────────────────────────────────────────
  const currentLesson = useMemo(
    () => (state.activeSession ? JOURNEY_LESSONS.find(l => l.id === state.activeSession!.lessonId) ?? null : null),
    [state.activeSession]
  );

  const currentQuestion = useMemo(() => {
    if (!currentLesson || !state.activeSession) return null;
    return currentLesson.questions[state.activeSession.questionIndex] ?? null;
  }, [currentLesson, state.activeSession]);

  const level = useMemo(() => getLevelForXP(state.totalXP), [state.totalXP]);
  const nextLevel = useMemo(() => getNextLevel(state.totalXP), [state.totalXP]);

  const xpToNextLevel = useMemo(() => {
    if (!nextLevel) return 0;
    return nextLevel.minXP - state.totalXP;
  }, [nextLevel, state.totalXP]);

  const xpProgressPercent = useMemo(() => {
    if (!nextLevel) return 100;
    const range = nextLevel.minXP - level.minXP;
    const progress = state.totalXP - level.minXP;
    return Math.min(100, Math.round((progress / range) * 100));
  }, [level, nextLevel, state.totalXP]);

  const heartsRefillsAt = useMemo(() => {
    if (!state.heartsDepletedAt) return null;
    return new Date(state.heartsDepletedAt + HEARTS_REFILL_HOURS * 3600 * 1000);
  }, [state.heartsDepletedAt]);

  const heartsRefillCountdown = useMemo(() => {
    if (!heartsRefillsAt) return '';
    const ms = heartsRefillsAt.getTime() - Date.now();
    if (ms <= 0) return 'Ready!';
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return `${h}h ${m}m`;
  }, [heartsRefillsAt]);

  const topicsStudiedForHeart = useMemo(() => {
    const total = state.earnHeartProgress.topicsStudied.length;
    return total % TOPICS_TO_EARN_HEART;
  }, [state.earnHeartProgress]);

  const canStartLesson = useCallback(
    (day: number) => state.hearts > 0 && day <= state.highestDayUnlocked,
    [state.hearts, state.highestDayUnlocked]
  );

  const isDayCompleted = useCallback(
    (day: number) => {
      const lesson = JOURNEY_LESSONS.find(l => l.day === day);
      if (!lesson) return false;
      return !!state.completedSessions[lesson.id]?.completed;
    },
    [state.completedSessions]
  );

  const isDayLocked = useCallback(
    (day: number) => day > state.highestDayUnlocked,
    [state.highestDayUnlocked]
  );

  // ── Actions ─────────────────────────────────────────────────────────────────
  const startLesson = useCallback((lessonId: string, day: number) => {
    dispatch({ type: 'START_LESSON', lessonId, day });
  }, []);

  const answerQuestion = useCallback(
    (questionId: string, selectedIndex: number, correct: boolean, xp: number) => {
      dispatch({ type: 'ANSWER_QUESTION', questionId, selectedIndex, correct, xp });
    },
    []
  );

  const completeLesson = useCallback(() => {
    dispatch({ type: 'COMPLETE_LESSON' });
  }, []);

  const abandonLesson = useCallback(() => {
    dispatch({ type: 'ABANDON_LESSON' });
  }, []);

  const studyTopicForHeart = useCallback((cardId: string) => {
    dispatch({ type: 'STUDY_TOPIC_FOR_HEART', cardId });
  }, []);

  const checkAndRefillHearts = useCallback(() => {
    dispatch({ type: 'REFILL_HEARTS' });
  }, []);

  const value: JourneyContextValue = {
    state,
    currentLesson,
    currentQuestion,
    level,
    nextLevel,
    xpToNextLevel,
    xpProgressPercent,
    heartsRefillsAt,
    heartsRefillCountdown,
    topicsStudiedForHeart,
    canStartLesson,
    isDayCompleted,
    isDayLocked,
    startLesson,
    answerQuestion,
    completeLesson,
    abandonLesson,
    studyTopicForHeart,
    checkAndRefillHearts,
  };

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

export function useJourney(): JourneyContextValue {
  const ctx = useContext(JourneyContext);
  if (!ctx) throw new Error('useJourney must be used within JourneyProvider');
  return ctx;
}
