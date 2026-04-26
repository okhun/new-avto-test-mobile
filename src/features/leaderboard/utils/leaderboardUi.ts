import {
  LeaderboardType,
  type MyRankResponse,
} from "../types/leaderboard.types";

export function formatLeaderboardXp(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("uz-UZ", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function getMyRankForType(
  r: MyRankResponse | undefined,
  type: LeaderboardType
): number | null {
  if (!r) return null;
  const n =
    type === LeaderboardType.WEEKLY
      ? r.weekly
      : type === LeaderboardType.MONTHLY
        ? r.monthly
        : r.allTime;
  if (n == null || !Number.isFinite(n)) return null;
  if (n <= 0) return null;
  return Math.round(n);
}

export function formatRankDisplay(rank: number | null | undefined): string {
  if (rank == null || !Number.isFinite(rank) || rank <= 0) return "—";
  return `#${Math.round(rank)}`;
}

export function getLeaderboardLevelSubtitle(level: number): string {
  return `${level}-daraja`;
}
