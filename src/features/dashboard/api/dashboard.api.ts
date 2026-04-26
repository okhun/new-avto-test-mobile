import { api } from "@/services/api";
import {
  ExamHistoryResponse,
  GetExamHistoryParams,
  UserProgressResponse,
} from "../types/dashboard.types";

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

export const getGemificationSummary =
  async (): Promise<UserProgressResponse> => {
    const { data } = await api.get<UserProgressResponse>(
      "/gamification/summary"
    );
    return data;
  };
