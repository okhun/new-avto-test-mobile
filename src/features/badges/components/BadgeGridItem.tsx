import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Image, Text, View } from "react-native";
import type { Badge } from "../types/badges.types";
import {
  BADGES_PRIMARY,
  fallbackIconNameForType,
  formatBadgeXp,
  getStreakProgress,
  resolveBadgeIconUrl,
} from "../utils/badgeUi";

type Props = {
  badge: Badge;
  currentStreak: number;
};

export function BadgeGridItem({ badge, currentStreak }: Props) {
  const earned = badge.isEarned;
  const uri = resolveBadgeIconUrl(badge.iconUrl);
  const fallName = fallbackIconNameForType(badge.type);
  const streakProg = getStreakProgress(badge, currentStreak);
  const fillPct =
    streakProg != null && streakProg.target > 0
      ? (streakProg.current / streakProg.target) * 100
      : 0;

  return (
    <View
      className="mb-1 rounded-3xl bg-white p-3"
      style={{
        minHeight: 200,
        shadowColor: "#0f172a",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
        opacity: earned ? 1 : 0.92,
      }}
    >
      <View className="relative mb-2 w-full min-h-[72px]">
        {earned ? (
          <MaterialIcons
            name="check-circle"
            size={22}
            color="#22c55e"
            style={{ position: "absolute", right: 0, top: 0, zIndex: 2 }}
          />
        ) : (
          <MaterialIcons
            name="lock"
            size={20}
            color="#94a3b8"
            style={{ position: "absolute", right: 0, top: 0, zIndex: 2 }}
          />
        )}
        <View
          className="h-[72px] w-[72px] items-center justify-center self-center overflow-hidden rounded-full"
          style={{
            backgroundColor: earned ? `${BADGES_PRIMARY}12` : "#e2e8f0",
          }}
        >
          {uri ? (
            <Image
              source={{ uri }}
              className="h-14 w-14"
              resizeMode="contain"
              style={!earned ? { opacity: 0.45 } : undefined}
            />
          ) : (
            <MaterialCommunityIcons
              name={fallName}
              size={40}
              color={earned ? BADGES_PRIMARY : "#94a3b8"}
            />
          )}
        </View>
      </View>

      <Text
        className="text-sm font-extrabold text-slate-900"
        numberOfLines={2}
        style={!earned ? { color: "#64748b" } : undefined}
      >
        {badge.name}
      </Text>
      <Text
        className="mt-1 text-[11px] font-medium leading-4"
        numberOfLines={3}
        style={{ color: earned ? "#64748b" : "#94a3b8" }}
      >
        {badge.description}
      </Text>

      {streakProg && !earned ? (
        <View className="mt-2">
          <View className="mb-0.5 flex-row justify-between">
            <Text className="text-[10px] font-semibold text-slate-500">
              {streakProg.current} / {streakProg.target} kun
            </Text>
          </View>
          <View className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <View
              className="h-full rounded-full"
              style={{
                width: `${Math.min(100, fillPct)}%`,
                backgroundColor: BADGES_PRIMARY,
              }}
            />
          </View>
        </View>
      ) : null}

      <View
        className="mt-2 self-start rounded-full px-2 py-1"
        style={{
          backgroundColor: earned ? `${BADGES_PRIMARY}16` : "#e2e8f0",
        }}
      >
        <Text
          className="text-[10px] font-extrabold"
          style={{ color: earned ? BADGES_PRIMARY : "#64748b" }}
        >
          +{formatBadgeXp(badge.xpReward)} XP
        </Text>
      </View>
    </View>
  );
}
