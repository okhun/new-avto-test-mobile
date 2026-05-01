import { API_CONFIG } from "@/src/utils/constants";
import { BadgeType, type Badge } from "../types/badges.types";

export function resolveBadgeIconUrl(
  iconUrl: string | null | undefined
): string | undefined {
  if (!iconUrl?.trim()) return undefined;
  const u = iconUrl.trim();
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  const base = API_CONFIG.API_URL.replace(/\/$/, "");
  return u.startsWith("/") ? `${base}${u}` : `${base}/${u}`;
}

export function formatBadgeXp(n: number): string {
  return new Intl.NumberFormat("uz-UZ", { maximumFractionDigits: 0 }).format(n);
}

export function isStreakBadgeType(type: string): boolean {
  return type === BadgeType.STREAK_7 || type === BadgeType.STREAK_30;
}

/** Current / target for streak-style locked badges, or null if not applicable. */
export function getStreakProgress(
  badge: Badge,
  currentStreak: number
): { current: number; target: number } | null {
  if (badge.isEarned || !isStreakBadgeType(badge.type)) return null;
  const t = badge.requirementValue;
  if (t == null || t <= 0) return null;
  return { current: Math.min(Math.max(0, currentStreak), t), target: t };
}

export function fallbackIconNameForType(type: string): string {
  switch (type) {
    case BadgeType.FIRST_TEST:
      return "rocket-launch";
    case BadgeType.PERFECT_SCORE:
      return "check-decagram";
    case BadgeType.STREAK_7:
    case BadgeType.STREAK_30:
      return "fire";
    case BadgeType.CATEGORY_MASTER:
      return "school";
    case BadgeType.SPEED_DEMON:
      return "speedometer";
    case BadgeType.CONSISTENT_LEARNER:
      return "school";
    case BadgeType.TOP_10:
    case BadgeType.TOP_3:
    case BadgeType.CHAMPION:
      return "trophy";
    default:
      return "medal";
  }
}
