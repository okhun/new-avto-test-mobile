export type TicketStatus = "unattempted" | "passed" | "failed" | "in_progress";
export type TestStatus = "in_progress" | "completed" | "failed" | "passed";
export enum TestMode {
  PRACTICE = "practice",
  EXAM = "exam",
  WEAK_TOPICS = "weak_topics",
  MARATHON = "marathon",
  TICKET = "ticket",
}
export interface TicketHistory {
  allQuestionsAnswered: boolean;
  answeredQuestions: number;
  status: TicketStatus;
  ticketId: string;
  ticketNumber: number;
  totalQuestions: number;
}

export interface StartTicketExamPayload {
  mode: TestMode;
  /** Required for ticket / practice flows; omit for official exam mode. */
  ticketId?: string;
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

export interface TestAttempt {
  id: string;
  startedAt: string; // ISO date
  completedAt: string | null;
  status: TestStatus;
  // Exam meta we care about
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  score: string;
  timeSpentSeconds: number;
  timeLimitSeconds: number | null;
  passingScore: string;

  responses: TestResponse[];
}

export interface TestResponse {
  id: string;
  questionOrder: number;
  selectedAnswerId: string | null;
  isCorrect: boolean | null;
  isSkipped: boolean;
  timeSpentSeconds: number;
  answeredAt: string | null;
  testAttemptId: string;
  questionId: string;
  question: Question;
}

export interface Question {
  id: string;
  text: string;
  imageUrl: string | null;
  explanation: string;
  timeLimitSeconds: number;
  answers: Answer[];
}

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
  displayOrder: number;
}

export interface SubmitAnswerResult {
  id: string;
  createdAt: string;
  updatedAt: string;
  testAttemptId: string;
  questionId: string;
  selectedAnswerId: string;
  isCorrect: boolean;
  isSkipped: boolean;
  timeSpentSeconds: number;
  questionOrder: number;
  answeredAt: string;
  testStatus: TestAttempt["status"];
  isExamFinished: boolean;
  failed: boolean;
}
