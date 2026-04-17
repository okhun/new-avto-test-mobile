import { api } from "@/services/api";
import type {
  ExamHistoryEntry,
  StartTicketExamPayload,
  SubmitAnswerResult,
  TestAttempt,
  TicketHistory,
} from "../types/practice.types";

export const getTicketsHistory = () =>
  api.get<TicketHistory[]>("/tests/tickets/history").then((res) => res.data);

export const startTicketExam = (payload: StartTicketExamPayload) =>
  api.post<TestAttempt>("/tests/start", payload).then((res) => res.data);

export const submitAnswer = async (
  testId: string,
  dto: { questionId: string; answerId: string; timeSpentSeconds: number }
) => {
  const { questionId, answerId, timeSpentSeconds } = dto;
  const { data } = await api.post<SubmitAnswerResult>(
    `/tests/${testId}/answer`,
    {
      questionId,
      answerId,
      timeSpentSeconds,
    }
  );
  return data;
};

export const getExamResult = async (
  attemptId: string
): Promise<ExamHistoryEntry> => {
  const { data } = await api.get<ExamHistoryEntry>(`/tests/${attemptId}`);
  return data;
};
