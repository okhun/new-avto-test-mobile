import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { BADGES_PRIMARY, formatBadgeXp } from "../utils/badgeUi";

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
  const pct = Math.min(100, Math.max(0, Math.round(progress * 100)));

  return (
    <View
      className="mx-4 mb-3 rounded-3xl bg-white p-4"
      style={{
        shadowColor: "#0f172a",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      <View className="flex-row items-start justify-between">
        <View className="min-w-0 flex-1 pr-2">
          <Text
            className="text-2xl font-extrabold"
            style={{ color: BADGES_PRIMARY }}
            numberOfLines={1}
          >
            {t("total_xp")}: {formatBadgeXp(totalXp)}
          </Text>
        </View>
        <View
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: `${BADGES_PRIMARY}18` }}
        >
          <MaterialIcons name="show-chart" size={22} color={BADGES_PRIMARY} />
        </View>
      </View>

      <View className="mt-3 flex-row flex-wrap gap-2">
        <View className="flex-row items-center gap-1 rounded-full bg-orange-100 px-3 py-1.5">
          <MaterialIcons
            name="local-fire-department"
            size={16}
            color="#ea580c"
          />
          <Text className="text-xs font-bold text-orange-800">
            {t("days_streak", { count: currentStreak })}
          </Text>
        </View>
        <View
          className="flex-row items-center gap-1 rounded-full px-3 py-1.5"
          style={{ backgroundColor: `${BADGES_PRIMARY}16` }}
        >
          <MaterialIcons name="star" size={16} color={BADGES_PRIMARY} />
          <Text className="text-xs font-bold" style={{ color: BADGES_PRIMARY }}>
            {earnedCount} / {totalCount} {t("badges")}
          </Text>
        </View>
      </View>

      <View className="mt-4">
        <View className="h-2.5 overflow-hidden rounded-full bg-slate-100">
          <View
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              backgroundColor: BADGES_PRIMARY,
            }}
          />
        </View>
      </View>
    </View>
  );
}
