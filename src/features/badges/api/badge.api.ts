import { api } from "@/services/api/axios";
import { Badge } from "../types/badges.types";

export const getUserBadges = async (): Promise<Badge[]> => {
  const { data } = await api.get<Badge[]>("/gamification/badges");
  return data;
};
