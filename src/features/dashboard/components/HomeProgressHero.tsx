import { ScalePressable } from "@/src/components/ui/ScalePressable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import type { Progress } from "../types/dashboard.types";
import {
  formatPassRateString,
  formatPercentString,
  xpBarWidth,
} from "../utils/dashboardFormat";

const PRIMARY = "#137fec"; // Emerald accent for success/growth

type Props = {
  progress: Progress;
  onContinue: () => void;
};

export function HomeProgressHero({ progress, onContinue }: Props) {
  const accuracy = formatPercentString(progress.overallAccuracy);
  const passRate = formatPassRateString(progress.examPassRate);
  const barW = xpBarWidth(progress.xpProgress ?? 0);
  const bestScore = progress.bestExamScore?.trim() || "—";

  return (
    <View className="px-5 py-4">
      {/* Container with soft, elevated background */}
      <View
        className="rounded-3xl bg-white p-5"
        style={{
          shadowColor: "#137fec",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.06,
          shadowRadius: 14,
          elevation: 3,
        }}
      >
        {/* Header Section with Level & Icon */}
        <View className="flex-row items-center justify-between border-b border-slate-100 pb-5">
          <View className="flex-1 pr-3">
            <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Sizning darajangiz
            </Text>
            <View className="mt-1 flex-row items-baseline gap-1.5">
              <Text className="text-4xl font-black text-slate-800">
                {progress.level}
              </Text>
              <Text className="text-sm font-semibold text-slate-500">
                daraja
              </Text>
            </View>
          </View>

          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
            <MaterialCommunityIcons
              name="shield-check"
              size={32}
              color={PRIMARY}
            />
          </View>
        </View>

        {/* XP Status & Progress Bar */}
        <View className="py-4">
          <View className="flex-row justify-between">
            <Text className="text-xs font-semibold text-slate-600">
              XP Progress
            </Text>
            <Text className="text-xs font-bold text-primary-600">
              {Math.round(progress.totalXp)} /{" "}
              {Math.round(progress.xpToNextLevel)} XP
            </Text>
          </View>
          <View className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <View
              className="h-full rounded-full bg-blue-500"
              style={{ width: barW as unknown as number }}
            />
          </View>
        </View>

        {/* Grid of Statistics (2x2) */}
        <View className="mt-1 flex-row flex-wrap gap-y-3">
          {/* Accuracy */}
          <View className="w-1/2 pr-2">
            <View className="rounded-2xl bg-slate-50 p-3.5">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Aniqlik
              </Text>
              <Text className="mt-1 text-base font-extrabold text-slate-800">
                {accuracy}
              </Text>
            </View>
          </View>

          {/* Pass Rate */}
          <View className="w-1/2 pl-2">
            <View className="rounded-2xl bg-slate-50 p-3.5">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                O&apos;tish darajasi
              </Text>
              <Text className="mt-1 text-base font-extrabold text-slate-800">
                {passRate}
              </Text>
            </View>
          </View>

          {/* Best Score */}
          <View className="w-1/2 pr-2">
            <View className="rounded-2xl bg-slate-50 p-3.5">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Eng yaxshi ball
              </Text>
              <Text className="mt-1 text-base font-extrabold text-slate-800">
                {bestScore}
              </Text>
            </View>
          </View>

          {/* Total Questions */}
          <View className="w-1/2 pl-2">
            <View className="rounded-2xl bg-slate-50 p-3.5">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Javoblar
              </Text>
              <Text className="mt-1 text-xs font-extrabold text-slate-800">
                {progress.totalCorrectAnswers} /{" "}
                {progress.totalQuestionsAnswered}
              </Text>
            </View>
          </View>
        </View>

        {/* Call to Action Button */}
        <ScalePressable
          onPress={onContinue}
          style={{
            marginTop: 20,
            borderRadius: 18,
            backgroundColor: PRIMARY,
            paddingVertical: 16,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: PRIMARY,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <Text className="text-center text-sm font-black uppercase tracking-widest text-white">
            Biletlar bilan ishlash
          </Text>
        </ScalePressable>
      </View>
    </View>
  );
}
