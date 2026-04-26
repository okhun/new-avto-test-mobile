export enum LeaderboardType {
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  ALL_TIME = "all_time",
}

export interface GetLeaderboardParams {
  page?: number;
  limit?: number;
  type?: LeaderboardType;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  score: string; // comes as string from DB (numeric/decimal)
  testsCompleted: number;
  testsPassed: number;
  averageScore: string; // same here
  totalXp: number;
  level: number;
}

export interface LeaderboardResponse {
  type: LeaderboardType;
  periodKey: string;
  entries: LeaderboardEntry[];
  totalEntries: number;
  currentUserRank?: number;
}

export interface MyRankResponse {
  allTime: number;
  monthly: number;
  weekly: number;
}
