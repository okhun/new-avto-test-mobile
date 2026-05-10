import { useTheme } from "@/src/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import type { Progress, Streak } from "../types/dashboard.types";
import { formatPercentString } from "../utils/dashboardFormat";

type Props = {
  progress: Progress;
  streak: Streak;
};

export function HomeQuickStats({ progress, streak }: Props) {
  const { t } = useTranslation();
  const { palette, isDark } = useTheme();
  const acc = formatPercentString(progress.overallAccuracy);
  const tests = progress.totalTestsTaken ?? 0;
  const passed = progress.totalTestsPassed ?? 0;

  const items = [
    {
      icon: "fire" as const,
      color: "#f97316",
      bg: isDark ? "rgba(249,115,22,0.22)" : "#fff7ed",
      label: t("streak"),
      // value: `${streak.currentStreak} ${t("days")}`,
      value: t("days_streak", { count: streak.currentStreak }),
    },
    {
      icon: "bullseye-arrow" as const,
      color: "#22c55e",
      bg: isDark ? "rgba(34,197,94,0.18)" : "#f0fdf4",
      label: t("accuracy"),
      value: acc,
    },
    {
      icon: "school" as const,
      color: palette.primary,
      bg: isDark ? "rgba(96,165,250,0.18)" : "#eff6ff",
      label: t("exams"),
      value: `${passed}/${tests} ${t("passed")}`,
    },
  ];

  return (
    <View className="flex-row flex-wrap gap-3 px-5">
      {items.map((it) => (
        <View
          key={it.label}
          className="min-w-[30%] flex-1 rounded-2xl border p-4"
          style={{
            backgroundColor: palette.card,
            borderColor: palette.border,
            shadowColor: palette.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: palette.cardShadowOpacity,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View
            className="mb-2 h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: it.bg }}
          >
            <MaterialCommunityIcons name={it.icon} size={22} color={it.color} />
          </View>
          <Text
            className="text-[10px] font-bold uppercase tracking-wide"
            style={{ color: palette.muted }}
          >
            {it.label}
          </Text>
          <Text
            className="mt-1 text-base font-extrabold"
            style={{ color: palette.foreground }}
            numberOfLines={2}
          >
            {it.value}
          </Text>
        </View>
      ))}
    </View>
  );
}
