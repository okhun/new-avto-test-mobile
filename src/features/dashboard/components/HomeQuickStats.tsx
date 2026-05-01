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
  const acc = formatPercentString(progress.overallAccuracy);
  const tests = progress.totalTestsTaken ?? 0;
  const passed = progress.totalTestsPassed ?? 0;

  const items = [
    {
      icon: "fire" as const,
      color: "#f97316",
      bg: "#fff7ed",
      label: t("streak"),
      value: `${streak.currentStreak} ${t("days")}`,
    },
    {
      icon: "bullseye-arrow" as const,
      color: "#22c55e",
      bg: "#f0fdf4",
      label: t("accuracy"),
      value: acc,
    },
    {
      icon: "school" as const,
      color: "#137fec",
      bg: "#eff6ff",
      label: t("exams"),
      value: `${passed}/${tests} ${t("passed")}`,
    },
  ];

  return (
    <View className="flex-row flex-wrap gap-3 px-5">
      {items.map((it) => (
        <View
          key={it.label}
          className="min-w-[30%] flex-1 rounded-2xl border border-slate-100 bg-white p-4"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
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
          <Text className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            {it.label}
          </Text>
          <Text
            className="mt-1 text-base font-extrabold text-slate-900"
            numberOfLines={2}
          >
            {it.value}
          </Text>
        </View>
      ))}
    </View>
  );
}
