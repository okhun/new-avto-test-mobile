import { ScalePressable } from "@/src/components/ui/ScalePressable";
import { useTheme } from "@/src/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import type { Progress } from "../types/dashboard.types";
import {
  formatPassRateString,
  formatPercentString,
  xpBarWidth,
} from "../utils/dashboardFormat";

type Props = {
  progress: Progress;
  onContinue: () => void;
};

export function HomeProgressHero({ progress, onContinue }: Props) {
  const { t } = useTranslation();
  const { palette, isDark } = useTheme();
  const accuracy = formatPercentString(progress.overallAccuracy);
  const passRate = formatPassRateString(progress.examPassRate);
  const barW = xpBarWidth(progress.xpProgress ?? 0);
  const bestScore = progress.bestExamScore?.trim() || "—";
  const shieldBg = isDark ? "rgba(96,165,250,0.18)" : "#eff6ff";

  return (
    <View className="px-5 py-4">
      <View
        className="rounded-3xl p-5"
        style={{
          backgroundColor: palette.card,
          shadowColor: isDark ? palette.shadow : palette.primary,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: isDark
            ? palette.cardShadowOpacity + 0.12
            : palette.cardShadowOpacity + 0.04,
          shadowRadius: 14,
          elevation: 3,
        }}
      >
        <View
          className="flex-row items-center justify-between pb-5"
          style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
        >
          <View className="flex-1 pr-3">
            <Text
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: palette.muted }}
            >
              {t("your_level")}
            </Text>
            <View className="mt-1 flex-row items-baseline gap-1.5">
              <Text
                className="text-4xl font-black"
                style={{ color: palette.foreground }}
              >
                {progress.level}
              </Text>
              <Text
                className="text-sm font-semibold"
                style={{ color: palette.muted }}
              >
                {t("level")}
              </Text>
            </View>
          </View>

          <View
            className="h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: shieldBg }}
          >
            <MaterialCommunityIcons
              name="shield-check"
              size={32}
              color={palette.primary}
            />
          </View>
        </View>

        <View className="py-4">
          <View className="flex-row justify-between">
            <Text
              className="text-xs font-semibold"
              style={{ color: palette.muted }}
            >
              {t("xp_progress")}
            </Text>
            <Text
              className="text-xs font-bold"
              style={{ color: palette.primary }}
            >
              {Math.round(progress.totalXp)} /{" "}
              {Math.round(progress.xpToNextLevel)} XP
            </Text>
          </View>
          <View
            className="mt-2 h-2.5 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: palette.divider }}
          >
            <View
              className="h-full rounded-full"
              style={{
                width: barW as unknown as number,
                backgroundColor: palette.primary,
              }}
            />
          </View>
        </View>

        <View className="mt-1 flex-row flex-wrap gap-y-3">
          <View className="w-1/2 pr-2">
            <View
              className="rounded-2xl p-3.5"
              style={{ backgroundColor: palette.iconSurface }}
            >
              <Text
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: palette.muted }}
              >
                {t("gamification.stat_accuracy")}
              </Text>
              <Text
                className="mt-1 text-base font-extrabold"
                style={{ color: palette.foreground }}
              >
                {accuracy}
              </Text>
            </View>
          </View>

          <View className="w-1/2 pl-2">
            <View
              className="rounded-2xl p-3.5"
              style={{ backgroundColor: palette.iconSurface }}
            >
              <Text
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: palette.muted }}
              >
                {t("passing_rate")}
              </Text>
              <Text
                className="mt-1 text-base font-extrabold"
                style={{ color: palette.foreground }}
              >
                {passRate}
              </Text>
            </View>
          </View>

          <View className="w-1/2 pr-2">
            <View
              className="rounded-2xl p-3.5"
              style={{ backgroundColor: palette.iconSurface }}
            >
              <Text
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: palette.muted }}
              >
                {t("gamification.stat_best_score")}
              </Text>
              <Text
                className="mt-1 text-base font-extrabold"
                style={{ color: palette.foreground }}
              >
                {bestScore}
              </Text>
            </View>
          </View>

          <View className="w-1/2 pl-2">
            <View
              className="rounded-2xl p-3.5"
              style={{ backgroundColor: palette.iconSurface }}
            >
              <Text
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: palette.muted }}
              >
                {t("answers")}
              </Text>
              <Text
                className="mt-1 text-base font-extrabold"
                style={{ color: palette.foreground }}
              >
                {progress.totalCorrectAnswers} /{" "}
                {progress.totalQuestionsAnswered}
              </Text>
            </View>
          </View>
        </View>

        <ScalePressable
          onPress={onContinue}
          style={{
            marginTop: 20,
            borderRadius: 18,
            backgroundColor: palette.primary,
            paddingVertical: 16,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: palette.shadow,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: palette.cardShadowOpacity + 0.12,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <Text
            className="text-center text-sm font-black uppercase tracking-widest"
            style={{ color: palette.switchThumb }}
          >
            {t("work_with_tickets")}
          </Text>
        </ScalePressable>
      </View>
    </View>
  );
}
