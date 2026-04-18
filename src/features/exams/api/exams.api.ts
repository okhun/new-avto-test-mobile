import { api } from "@/services/api";
import {
  StartTicketExamPayload,
  TestAttempt,
} from "../../practice/types/practice.types";
import {
  ExamHistoryResponse,
  GetExamHistoryParams,
} from "../types/exams.types";

export const startTicketExam = (payload: StartTicketExamPayload) =>
  api.post<TestAttempt>("/tests/start", payload).then((res) => res.data);

export const getExamHistory = async (
  params?: GetExamHistoryParams
): Promise<ExamHistoryResponse> => {
  const { data } = await api.get<ExamHistoryResponse>("/tests/history", {
    params: {
      mode: params?.mode,
      status: params?.status,
      categoryId: params?.categoryId,
      page: params?.page,
      limit: params?.limit,
    },
  });
  return data;
};
