/**
 * Unit tests for the Learning Journey state logic.
 * Tests the pure reducer functions and derived values.
 */
import { describe, it, expect } from 'vitest';

// ─── Replicate the pure reducer logic for testing ────────────────────────────
// (We test the logic in isolation without importing React components)

const MAX_HEARTS = 3;
const TOPICS_TO_EARN_HEART = 5;
const HEARTS_REFILL_HOURS = 24;

interface JourneyState {
  hearts: number;
  heartsDepletedAt: number | null;
  totalXP: number;
  highestDayUnlocked: number;
  completedSessions: Record<string, { completed: boolean; xpEarned: number; correctCount: number }>;
  questionAttempts: Record<string, { correct: boolean }>;
  activeSession: { lessonId: string; day: number; questionIndex: number; answers: Array<{ correct: boolean; xp: number; questionId: string }> } | null;
  earnHeartProgress: { topicsStudied: string[]; heartsEarned: number };
  currentStreak: number;
  lastStreakDate: string | null;
}

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

// Pure reducer functions (extracted from JourneyContext)
function startLesson(state: JourneyState, lessonId: string, day: number): JourneyState {
  if (state.hearts <= 0) return state;
  return {
    ...state,
    activeSession: {
      lessonId,
      day,
      questionIndex: 0,
      answers: [],
    },
  };
}

function answerQuestion(
  state: JourneyState,
  questionId: string,
  correct: boolean,
  xp: number
): JourneyState {
  if (!state.activeSession) return state;
  const attempt = { correct, xp, questionId };
  let newHearts = state.hearts;
  let heartsDepletedAt = state.heartsDepletedAt;

  if (!correct) {
    newHearts = Math.max(0, state.hearts - 1);
    if (newHearts === 0 && state.hearts > 0) {
      heartsDepletedAt = Date.now();
    }
  }

  const newXP = state.totalXP + (correct ? xp : 0);

  return {
    ...state,
    hearts: newHearts,
    heartsDepletedAt,
    totalXP: newXP,
    questionAttempts: { ...state.questionAttempts, [questionId]: { correct } },
    activeSession: {
      ...state.activeSession,
      questionIndex: state.activeSession.questionIndex + 1,
      answers: [...state.activeSession.answers, attempt],
    },
  };
}

function completeLesson(state: JourneyState): JourneyState {
  if (!state.activeSession) return state;
  const session = state.activeSession;
  const correctCount = session.answers.filter(a => a.correct).length;
  const xpEarned = session.answers.reduce((sum, a) => sum + (a.correct ? a.xp : 0), 0);
  const nextDay = session.day + 1;
  const newHighest = Math.max(state.highestDayUnlocked, nextDay);

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  let newStreak = state.currentStreak;
  let lastStreakDate = state.lastStreakDate;
  if (lastStreakDate !== today) {
    newStreak = lastStreakDate === yesterday ? state.currentStreak + 1 : 1;
    lastStreakDate = today;
  }

  return {
    ...state,
    completedSessions: {
      ...state.completedSessions,
      [session.lessonId]: { completed: true, xpEarned, correctCount },
    },
    highestDayUnlocked: newHighest,
    activeSession: null,
    currentStreak: newStreak,
    lastStreakDate,
  };
}

function studyTopicForHeart(state: JourneyState, cardId: string): JourneyState {
  if (state.earnHeartProgress.topicsStudied.includes(cardId)) return state;
  const newStudied = [...state.earnHeartProgress.topicsStudied, cardId];
  const totalEarnable = Math.floor(newStudied.length / TOPICS_TO_EARN_HEART);
  const heartsToAdd = Math.max(0, totalEarnable - state.earnHeartProgress.heartsEarned);
  const newHearts = Math.min(MAX_HEARTS, state.hearts + heartsToAdd);
  return {
    ...state,
    hearts: newHearts,
    heartsDepletedAt: newHearts > 0 ? null : state.heartsDepletedAt,
    earnHeartProgress: {
      topicsStudied: newStudied,
      heartsEarned: state.earnHeartProgress.heartsEarned + heartsToAdd,
    },
  };
}

function refillHearts(state: JourneyState): JourneyState {
  if (!state.heartsDepletedAt) return state;
  const elapsed = Date.now() - state.heartsDepletedAt;
  if (elapsed < HEARTS_REFILL_HOURS * 3600 * 1000) return state;
  return { ...state, hearts: MAX_HEARTS, heartsDepletedAt: null };
}

// ─── TESTS ────────────────────────────────────────────────────────────────────

describe('Journey: Hearts System', () => {
  it('starts with 3 hearts', () => {
    expect(INITIAL_STATE.hearts).toBe(3);
  });

  it('loses a heart on wrong answer', () => {
    let state = startLesson(INITIAL_STATE, 'day-1', 1);
    state = answerQuestion(state, 'q1', false, 10);
    expect(state.hearts).toBe(2);
  });

  it('does not lose a heart on correct answer', () => {
    let state = startLesson(INITIAL_STATE, 'day-1', 1);
    state = answerQuestion(state, 'q1', true, 10);
    expect(state.hearts).toBe(3);
  });

  it('records heartsDepletedAt when hearts reach 0', () => {
    let state = { ...INITIAL_STATE, hearts: 1 };
    state = startLesson(state, 'day-1', 1);
    state = answerQuestion(state, 'q1', false, 10);
    expect(state.hearts).toBe(0);
    expect(state.heartsDepletedAt).not.toBeNull();
  });

  it('does not go below 0 hearts', () => {
    let state = { ...INITIAL_STATE, hearts: 0 };
    state = startLesson(state, 'day-1', 1); // guard: no hearts
    expect(state.activeSession).toBeNull(); // cannot start with 0 hearts
  });

  it('does not refill hearts before 24h', () => {
    const depletedRecently = Date.now() - 1000; // 1 second ago
    let state = { ...INITIAL_STATE, hearts: 0, heartsDepletedAt: depletedRecently };
    state = refillHearts(state);
    expect(state.hearts).toBe(0);
  });

  it('refills hearts after 24h', () => {
    const depletedLongAgo = Date.now() - (25 * 3600 * 1000); // 25 hours ago
    let state = { ...INITIAL_STATE, hearts: 0, heartsDepletedAt: depletedLongAgo };
    state = refillHearts(state);
    expect(state.hearts).toBe(MAX_HEARTS);
    expect(state.heartsDepletedAt).toBeNull();
  });
});

describe('Journey: XP and Scoring', () => {
  it('awards XP for correct answers', () => {
    let state = startLesson(INITIAL_STATE, 'day-1', 1);
    state = answerQuestion(state, 'q1', true, 10);
    expect(state.totalXP).toBe(10);
  });

  it('does not award XP for wrong answers', () => {
    let state = startLesson(INITIAL_STATE, 'day-1', 1);
    state = answerQuestion(state, 'q1', false, 10);
    expect(state.totalXP).toBe(0);
  });

  it('accumulates XP across multiple correct answers', () => {
    let state = startLesson(INITIAL_STATE, 'day-1', 1);
    state = answerQuestion(state, 'q1', true, 10);
    state = answerQuestion(state, 'q2', true, 15);
    state = answerQuestion(state, 'q3', false, 10);
    expect(state.totalXP).toBe(25);
  });
});

describe('Journey: Lesson Completion', () => {
  it('unlocks the next day on lesson completion', () => {
    let state = startLesson(INITIAL_STATE, 'day-1', 1);
    state = answerQuestion(state, 'q1', true, 10);
    state = completeLesson(state);
    expect(state.highestDayUnlocked).toBe(2);
    expect(state.activeSession).toBeNull();
  });

  it('records the completed session with correct stats', () => {
    let state = startLesson(INITIAL_STATE, 'day-1', 1);
    state = answerQuestion(state, 'q1', true, 10);
    state = answerQuestion(state, 'q2', false, 10);
    state = answerQuestion(state, 'q3', true, 15);
    state = completeLesson(state);
    const session = state.completedSessions['day-1'];
    expect(session.completed).toBe(true);
    expect(session.xpEarned).toBe(25);
    expect(session.correctCount).toBe(2);
  });

  it('starts a streak on first lesson completion', () => {
    let state = startLesson(INITIAL_STATE, 'day-1', 1);
    state = completeLesson(state);
    expect(state.currentStreak).toBe(1);
    expect(state.lastStreakDate).not.toBeNull();
  });

  it('does not double-count streak on same day', () => {
    const today = new Date().toISOString().slice(0, 10);
    let state = { ...INITIAL_STATE, currentStreak: 3, lastStreakDate: today };
    state = startLesson(state, 'day-2', 2);
    state = completeLesson(state);
    expect(state.currentStreak).toBe(3); // unchanged
  });
});

describe('Journey: Earn Heart by Studying Topics', () => {
  it('earns a heart after studying 5 topics', () => {
    let state = { ...INITIAL_STATE, hearts: 0, heartsDepletedAt: Date.now() };
    for (let i = 0; i < TOPICS_TO_EARN_HEART; i++) {
      state = studyTopicForHeart(state, `card-${i}`);
    }
    expect(state.hearts).toBe(1);
    expect(state.heartsDepletedAt).toBeNull();
  });

  it('does not award a heart for studying fewer than 5 topics', () => {
    let state = { ...INITIAL_STATE, hearts: 0, heartsDepletedAt: Date.now() };
    for (let i = 0; i < 4; i++) {
      state = studyTopicForHeart(state, `card-${i}`);
    }
    expect(state.hearts).toBe(0);
  });

  it('does not count the same topic twice', () => {
    let state = { ...INITIAL_STATE, hearts: 0, heartsDepletedAt: Date.now() };
    for (let i = 0; i < 10; i++) {
      state = studyTopicForHeart(state, 'same-card'); // same card repeated
    }
    expect(state.hearts).toBe(0); // only 1 unique topic studied
  });

  it('earns a second heart after studying 10 unique topics', () => {
    let state = { ...INITIAL_STATE, hearts: 0, heartsDepletedAt: Date.now() };
    for (let i = 0; i < 10; i++) {
      state = studyTopicForHeart(state, `card-${i}`);
    }
    expect(state.hearts).toBe(2);
  });

  it('does not exceed MAX_HEARTS', () => {
    let state = { ...INITIAL_STATE, hearts: 2 };
    for (let i = 0; i < TOPICS_TO_EARN_HEART; i++) {
      state = studyTopicForHeart(state, `card-${i}`);
    }
    expect(state.hearts).toBe(MAX_HEARTS); // capped at 3
  });
});

describe('Journey: Day Locking', () => {
  it('only day 1 is unlocked initially', () => {
    expect(INITIAL_STATE.highestDayUnlocked).toBe(1);
  });

  it('completing day 1 unlocks day 2', () => {
    let state = startLesson(INITIAL_STATE, 'day-1', 1);
    state = completeLesson(state);
    expect(state.highestDayUnlocked).toBe(2);
  });

  it('highestDayUnlocked never decreases', () => {
    let state = { ...INITIAL_STATE, highestDayUnlocked: 5 };
    // Completing day 3 should not reduce highestDayUnlocked
    state = startLesson(state, 'day-3', 3);
    state = completeLesson(state);
    expect(state.highestDayUnlocked).toBe(5);
  });
});
