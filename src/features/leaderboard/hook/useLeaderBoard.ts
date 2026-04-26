import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getLeaderboards, getMyRank } from "../api/leaderboard.api";
import { GetLeaderboardParams } from "../types/leaderboard.types";

export const useLeaderboard = (params?: GetLeaderboardParams) => {
  return useQuery({
    queryKey: ["leaderboard", params],
    queryFn: () => getLeaderboards(params),
    placeholderData: keepPreviousData,
    retry: false,
    gcTime: 0,
    staleTime: 0,
  });
};

export const useMyRank = () => {
  return useQuery({
    queryKey: ["myRank"],
    queryFn: () => getMyRank(),
    retry: false,
    gcTime: 0,
    staleTime: 0,
  });
};
