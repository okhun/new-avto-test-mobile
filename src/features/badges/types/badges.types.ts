export interface Badge {
  id: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date;

  type: BadgeType;
  name: string;
  description: string;

  iconUrl: string | null;

  xpReward: number;
  requirementValue: number | null;

  isActive: boolean;
  isEarned: boolean;
}

export enum BadgeType {
  FIRST_TEST = "first_test",
  PERFECT_SCORE = "perfect_score",
  STREAK_7 = "streak_7",
  STREAK_30 = "streak_30",
  CATEGORY_MASTER = "category_master",
  SPEED_DEMON = "speed_demon",
  CONSISTENT_LEARNER = "consistent_learner",
  TOP_10 = "top_10",
  TOP_3 = "top_3",
  CHAMPION = "champion",
}
