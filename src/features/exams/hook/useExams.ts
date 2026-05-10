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
      const itemCount = lastPage.tests?.length ?? 0;
      if (itemCount === 0) return undefined;

      const totalLoaded = allPages.reduce(
        (sum, page) => sum + (page.tests?.length ?? 0),
        0
      );

      if (
        typeof lastPage.total === "number" &&
        lastPage.total > 0 &&
        totalLoaded >= lastPage.total
      ) {
        return undefined;
      }

      // Short page ⇒ server has no further rows (given a correct limit).
      if (itemCount < PAGE_SIZE) return undefined;

      return allPages.length + 1;
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
