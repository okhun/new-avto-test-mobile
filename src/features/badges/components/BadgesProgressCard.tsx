import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { useTheme } from "@/src/theme";

import { formatBadgeXp } from "../utils/badgeUi";

type Props = {
  totalXp: number;
  currentStreak: number;
  earnedCount: number;
  totalCount: number;
  progress: number; // 0..1
};

export function BadgesProgressCard({
  totalXp,
  currentStreak,
  earnedCount,
  totalCount,
  progress,
}: Props) {
  const { t } = useTranslation();
  const { palette, isDark } = useTheme();
  const pct = Math.min(100, Math.max(0, Math.round(progress * 100)));

  const streakBg = isDark ? "rgba(234, 88, 12, 0.2)" : "#ffedd5";
  const streakText = isDark ? "#fdba74" : "#9a3412";
  const streakIcon = isDark ? "#fb923c" : "#ea580c";

  return (
    <View
      className="mx-4 mb-3 rounded-3xl p-4"
      style={{
        backgroundColor: palette.card,
        shadowColor: palette.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: palette.cardShadowOpacity,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      <View className="flex-row items-start justify-between">
        <View className="min-w-0 flex-1 pr-2">
          <Text
            className="text-2xl font-extrabold"
            style={{ color: palette.primary }}
            numberOfLines={1}
          >
            {t("total_xp")}: {formatBadgeXp(totalXp)}
          </Text>
        </View>
        <View
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: `${palette.primary}18` }}
        >
          <MaterialIcons name="show-chart" size={22} color={palette.primary} />
        </View>
      </View>

      <View className="mt-3 flex-row flex-wrap gap-2">
        <View
          className="flex-row items-center gap-1 rounded-full px-3 py-1.5"
          style={{ backgroundColor: streakBg }}
        >
          <MaterialIcons
            name="local-fire-department"
            size={16}
            color={streakIcon}
          />
          <Text className="text-xs font-bold" style={{ color: streakText }}>
            {t("days_streak", { count: currentStreak })}
          </Text>
        </View>
        <View
          className="flex-row items-center gap-1 rounded-full px-3 py-1.5"
          style={{ backgroundColor: `${palette.primary}16` }}
        >
          <MaterialIcons name="star" size={16} color={palette.primary} />
          <Text
            className="text-xs font-bold"
            style={{ color: palette.primary }}
          >
            {earnedCount} / {totalCount} {t("badges")}
          </Text>
        </View>
      </View>

      <View className="mt-4">
        <View
          className="h-2.5 overflow-hidden rounded-full"
          style={{ backgroundColor: palette.divider }}
        >
          <View
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              backgroundColor: palette.primary,
            }}
          />
        </View>
      </View>
    </View>
  );
}
