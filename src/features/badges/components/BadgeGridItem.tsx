import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, View } from "react-native";

import { useTheme } from "@/src/theme";

import type { Badge } from "../types/badges.types";
import {
  fallbackIconNameForType,
  formatBadgeXp,
  getStreakProgress,
  resolveBadgeIconUrl,
} from "../utils/badgeUi";

type Props = {
  badge: Badge;
  currentStreak: number;
};

const SUCCESS = "#22c55e";

export function BadgeGridItem({ badge, currentStreak }: Props) {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const earned = badge.isEarned;
  const uri = resolveBadgeIconUrl(badge.iconUrl);
  const fallName = fallbackIconNameForType(badge.type);
  const streakProg = getStreakProgress(badge, currentStreak);
  const fillPct =
    streakProg != null && streakProg.target > 0
      ? (streakProg.current / streakProg.target) * 100
      : 0;

  const descColor = earned ? palette.muted : palette.chevron;
  const xpPillBg = earned ? `${palette.primary}16` : palette.radioOff;
  const xpPillFg = earned ? palette.primary : palette.muted;

  return (
    <View
      className="mb-1 rounded-3xl p-3"
      style={{
        minHeight: 200,
        backgroundColor: palette.card,
        shadowColor: palette.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: palette.cardShadowOpacity,
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
            color={SUCCESS}
            style={{ position: "absolute", right: 0, top: 0, zIndex: 2 }}
          />
        ) : (
          <MaterialIcons
            name="lock"
            size={20}
            color={palette.muted}
            style={{ position: "absolute", right: 0, top: 0, zIndex: 2 }}
          />
        )}
        <View
          className="h-[72px] w-[72px] items-center justify-center self-center overflow-hidden rounded-full"
          style={{
            backgroundColor: earned ? `${palette.primary}12` : palette.radioOff,
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
              name={fallName as any}
              size={40}
              color={earned ? palette.primary : palette.muted}
            />
          )}
        </View>
      </View>

      <Text
        className="text-sm font-extrabold"
        numberOfLines={2}
        style={{ color: earned ? palette.foreground : palette.muted }}
      >
        {t(`badge.${badge.type}`)}
      </Text>
      <Text
        className="mt-1 text-[11px] font-medium leading-4"
        numberOfLines={3}
        style={{ color: descColor }}
      >
        {t(`badge.${badge.type}_description`)}
      </Text>

      {streakProg && !earned ? (
        <View className="mt-2">
          <View className="mb-0.5 flex-row justify-between">
            <Text
              className="text-[10px] font-semibold"
              style={{ color: palette.muted }}
            >
              {streakProg.current} / {streakProg.target} {t("days")}
            </Text>
          </View>
          <View
            className="h-1.5 overflow-hidden rounded-full"
            style={{ backgroundColor: palette.divider }}
          >
            <View
              className="h-full rounded-full"
              style={{
                width: `${Math.min(100, fillPct)}%`,
                backgroundColor: palette.primary,
              }}
            />
          </View>
        </View>
      ) : null}

      <View
        className="mt-2 self-start rounded-full px-2 py-1"
        style={{ backgroundColor: xpPillBg }}
      >
        <Text
          className="text-[10px] font-extrabold"
          style={{ color: xpPillFg }}
        >
          +{formatBadgeXp(badge.xpReward)} XP
        </Text>
      </View>
    </View>
  );
}
