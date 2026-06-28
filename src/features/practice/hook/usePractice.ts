import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getExamResult,
  getTicketsHistory,
  startTicketExam,
} from "../api/practice.api";
import { submitAnswerWithOfflineSupport } from "@/src/services/practice/submitAnswer.service";
import type {
  StartTicketExamPayload,
  TicketHistory,
} from "../types/practice.types";

export const useGetTicketsHistory = () => {
  return useQuery({
    queryKey: ["practice", "tickets-history"],
    queryFn: () => getTicketsHistory(),
    retry: false,
    gcTime: 0,
    staleTime: 0,
    select: (data): TicketHistory[] =>
      Array.isArray(data) ? data : ((data as any)?.data ?? []),
  });
};

export const useStartTicket = () => {
  return useMutation({
    mutationFn: (payload: StartTicketExamPayload) => startTicketExam(payload),
  });
};

export const useSubmitAnswer = () => {
  return useMutation({
    mutationFn: (params: {
      testId: string;
      questionId: string;
      answerId: string;
      timeSpentSeconds: number;
      responseId: string;
      questionOrder: number;
      testStatus: import("../types/practice.types").SubmitAnswerResult["testStatus"];
    }) => submitAnswerWithOfflineSupport(params),
    retry: false,
  });
};

export const useExamResult = (attemptId: string, isEnabled: boolean = true) => {
  return useQuery({
    queryKey: ["examResult", attemptId],
    queryFn: () => getExamResult(attemptId),
    enabled: !!attemptId && isEnabled,
    retry: false,
    gcTime: 0,
    staleTime: 0,
  });
};
