import {
  TestMode,
  TestResponse,
  TestStatus,
} from "../../practice/types/practice.types";

export interface GetExamHistoryParams {
  mode?: TestMode;
  status?: TestStatus;
  categoryId?: string;
  page?: number;
  limit?: number;
}

export interface ExamHistoryResponse {
  tests: ExamHistoryEntry[];
  total: number;
}

export interface ExamHistoryEntry {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  mode: string;
  status: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  score: string;
  timeSpentSeconds: number;
  timeLimitSeconds: number | null;
  startedAt: string;
  completedAt: string | null;
  isPassed: boolean;
  passingScore: string;
  xpEarned?: number;
  categoryId: string | null;
  ticketId: string | null;
  /** Present when fetching single attempt (e.g. result page). */
  responses?: TestResponse[];
}

export interface UserProgressResponse {
  progress: Progress;
  streak: Streak;
  badges: UserBadge[];
  categoryStats: CategoryStat[];
  weakTopics: WeakTopic[];
}

/* ================== PROGRESS ================== */
export interface Progress {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  totalXp: number;
  level: number;
  xpToNextLevel: number;
  totalTestsTaken: number;
  totalTestsPassed: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  overallAccuracy: string; // "62.50"
  examPassRate: string; // "0.00"
  bestExamScore: string; // "25.00"
  totalTimeSpentSeconds: number;
  avgTimePerQuestion: string; // "6.88"
  categoryStats: Record<string, any>;
  xpProgress: number;
}

/* ================== STREAK ================== */
export interface Streak {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string; // YYYY-MM-DD
  streakStartDate: string; // YYYY-MM-DD
  isProtected: boolean;
  freezeCount: number;
}

/* ================== BADGES ================== */
export interface UserBadge {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  badgeId: string;
  badge: Badge;
  earnedAt: string;
  isNew: boolean;
}
export interface Badge {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: string; // e.g. "first_test"
  name: string;
  description: string;
  iconUrl: string | null;
  xpReward: number;
  requirementValue: number | null;
  isActive: boolean;
}

/* ================== OPTIONAL ARRAYS ================== */
export interface CategoryStat {
  // define later when backend structure is ready
  [key: string]: any;
}

export interface WeakTopic {
  // define later when backend structure is ready
  [key: string]: any;
}
