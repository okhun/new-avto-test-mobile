import { useQuery } from "@tanstack/react-query";
import {
  CACHE_KEYS,
  CACHE_TTL,
  getCache,
  setCache,
} from "@/src/services/cache/cache.service";
import { isNetworkOrOfflineError } from "@/src/utils/network/errors";
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

async function withCacheFallback<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>
): Promise<T> {
  try {
    const data = await fetcher();
    await setCache(key, data, ttl);
    return data;
  } catch (error) {
    if (isNetworkOrOfflineError(error)) {
      const cached = await getCache<T>(key);
      if (cached) return cached;
    }
    throw error;
  }
}

export const useGemificationSummary = () => {
  return useQuery({
    queryKey: ["gemificationSummary"],
    queryFn: async () => {
      const d = await withCacheFallback(
        CACHE_KEYS.gamificationSummary,
        CACHE_TTL.medium,
        getGemificationSummary
      );
      if (!d?.progress) {
        throw new Error("Yutuqlar ma'lumoti topilmadi");
      }
      return normalizeSummary(d);
    },
    retry: 1,
    gcTime: CACHE_TTL.medium,
    staleTime: 60_000,
    placeholderData: (previous) => previous,
  });
};

export const useExamHistory = (params?: GetExamHistoryParams) => {
  return useQuery({
    queryKey: ["examHistory", "dashboard", params],
    queryFn: async () => {
      const raw = await withCacheFallback(
        `${CACHE_KEYS.examHistory}:${JSON.stringify(params ?? {})}`,
        CACHE_TTL.medium,
        () => getExamHistory(params)
      );
      return normalizeExamHistory(raw);
    },
    retry: 1,
    gcTime: CACHE_TTL.medium,
    staleTime: 30_000,
    placeholderData: (previous) => previous,
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
