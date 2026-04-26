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

const PRIMARY = "#137fec";

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
    <View className="px-5 py-3">
      <View
        className="overflow-hidden rounded-[28px] bg-blue-600 p-5"
        style={{
          shadowColor: PRIMARY,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
          elevation: 6,
        }}
      >
        <View className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10" />
        <View className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-black/10" />

        <View className="flex-row items-start justify-between">
          <View className="min-w-0 flex-1 pr-3">
            <Text className="text-xs font-bold uppercase tracking-widest text-blue-100">
              Sizning darajangiz
            </Text>
            <View className="mt-1 flex-row items-baseline gap-1">
              <Text className="text-4xl font-black text-white">
                {progress.level}
              </Text>
              <Text className="text-base font-bold text-blue-200">daraja</Text>
            </View>
            <Text className="mt-1 text-sm font-medium text-blue-100">
              Jami: {Math.round(progress.totalXp)} XP · keyingi:{" "}
              {Math.round(progress.xpToNextLevel)} XP
            </Text>
            <View className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/20">
              <View
                className="h-full rounded-full bg-white"
                style={{ width: barW }}
              />
            </View>
            <Text className="mt-2 text-xs leading-relaxed text-blue-100">
              Aniqlik: {accuracy} · Imtihon o&apos;tish: {passRate} · Eng yaxshi
              ball: {bestScore}
            </Text>
            <Text className="mt-1 text-[11px] text-blue-200/90">
              Javoblar: {progress.totalCorrectAnswers} to&apos;g&apos;ri /{" "}
              {progress.totalQuestionsAnswered} jami
            </Text>
          </View>
          <View className="h-20 w-20 items-center justify-center rounded-full border-[4px] border-white/20">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-white">
              <MaterialCommunityIcons
                name="shield-check"
                size={32}
                color={PRIMARY}
              />
            </View>
          </View>
        </View>

        <ScalePressable
          onPress={onContinue}
          style={{
            marginTop: 16,
            borderRadius: 16,
            backgroundColor: "#ffffff",
            paddingVertical: 14,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            className="text-center text-base font-extrabold"
            style={{ color: PRIMARY }}
          >
            Biletlar bilan mashq qilish
          </Text>
        </ScalePressable>
      </View>
    </View>
  );
}
