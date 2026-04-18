import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getExamHistory, getExamResult } from "../api/exams.api";
import type { GetExamHistoryParams } from "../types/exams.types";

const PAGE_SIZE = 10;

export const useExamHistory = (params?: GetExamHistoryParams) => {
  return useQuery({
    queryKey: ["examHistory", params],
    queryFn: () => getExamHistory(params),
    retry: false,
    gcTime: 0,
    staleTime: 0,
  });
};

export const useExamHistoryInfinite = (
  params?: Omit<GetExamHistoryParams, "page" | "limit">
) => {
  return useInfiniteQuery({
    queryKey: ["examHistory", "infinite", params],
    queryFn: ({ pageParam }) =>
      getExamHistory({ ...params, page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.length * PAGE_SIZE;
      return loaded < lastPage.total ? allPages.length + 1 : undefined;
    },
    retry: false,
    staleTime: 0,
  });
};

export const useExamResult = (
  attemptId: string | undefined,
  isEnabled: boolean = true
) => {
  return useQuery({
    queryKey: ["examResult", attemptId],
    queryFn: () => getExamResult(attemptId ?? ""),
    enabled: !!attemptId && isEnabled,
    retry: false,
    gcTime: 0,
    staleTime: 0,
  });
};
