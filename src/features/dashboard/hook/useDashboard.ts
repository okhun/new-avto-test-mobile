import { useQuery } from "@tanstack/react-query";
import { getExamHistory, getGemificationSummary } from "../api/dashboard.api";
import type {
  ExamHistoryResponse,
  GetExamHistoryParams,
  UserProgressResponse,
} from "../types/dashboard.types";

function normalizeSummary(raw: UserProgressResponse): UserProgressResponse {
  return {
    ...raw,
    streak: raw.streak ?? {
      id: "",
      createdAt: "",
      updatedAt: "",
      userId: raw.progress?.userId ?? "",
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: "",
      streakStartDate: "",
      isProtected: false,
      freezeCount: 0,
    },
    badges: Array.isArray(raw.badges) ? raw.badges : [],
    categoryStats: Array.isArray(raw.categoryStats) ? raw.categoryStats : [],
    weakTopics: Array.isArray(raw.weakTopics) ? raw.weakTopics : [],
  };
}

export const useGemificationSummary = () => {
  return useQuery({
    queryKey: ["gemificationSummary"],
    queryFn: async () => {
      const d = await getGemificationSummary();
      if (!d?.progress) {
        throw new Error("Yutuqlar ma'lumoti topilmadi");
      }
      return normalizeSummary(d);
    },
    retry: 1,
    gcTime: 0,
    staleTime: 60_000,
  });
};

export const useExamHistory = (params?: GetExamHistoryParams) => {
  return useQuery({
    queryKey: ["examHistory", "dashboard", params],
    queryFn: async () => {
      const raw = await getExamHistory(params);
      return normalizeExamHistory(raw);
    },
    retry: 1,
    gcTime: 0,
    staleTime: 30_000,
  });
};

function normalizeExamHistory(
  res: ExamHistoryResponse | null | undefined
): ExamHistoryResponse {
  if (!res) return { tests: [], total: 0 };
  return {
    tests: Array.isArray(res.tests) ? res.tests : [],
    total: typeof res.total === "number" ? res.total : 0,
  };
}
