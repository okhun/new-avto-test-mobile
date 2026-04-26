import { api } from "@/services/api";
import {
  GetLeaderboardParams,
  LeaderboardResponse,
  MyRankResponse,
} from "../types/leaderboard.types";

export const getLeaderboards = async (
  params?: GetLeaderboardParams
): Promise<LeaderboardResponse> => {
  const { data } = await api.get("/leaderboard", { params });
  return data;
};

export const getMyRank = async (): Promise<MyRankResponse> => {
  const { data } = await api.get("/leaderboard/my-rank");
  return data;
};
