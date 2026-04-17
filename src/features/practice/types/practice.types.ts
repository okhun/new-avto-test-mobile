export type TicketStatus = "unattempted" | "passed" | "failed" | "in_progress";

export interface TicketHistory {
  allQuestionsAnswered: boolean;
  answeredQuestions: number;
  status: TicketStatus;
  ticketId: string;
  ticketNumber: number;
  totalQuestions: number;
}
