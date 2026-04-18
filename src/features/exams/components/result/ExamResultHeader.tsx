import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Pressable, Text, View } from "react-native";

const PRIMARY = "#137fec";
const TEXT_DARK = "#0f172a";
const SUCCESS = "#22c55e";
const ERROR = "#ef4444";

type Props = {
  titleLabel: string;
  incorrectCount: number;
  totalQuestions: number;
  /** Reviewed = all questions in result view */
  reviewedCount: number;
  progressPercent: number;
  isPassed?: boolean;
  scoreLabel?: string;
  onBack: () => void;
};

export function ExamResultHeader({
  titleLabel,
  incorrectCount,
  totalQuestions,
  reviewedCount,
  progressPercent,
  isPassed,
  scoreLabel,
  onBack,
}: Props) {
  return (
    <View
      className="border-b border-slate-200 bg-white px-4 pb-4 pt-2"
      style={{ elevation: 2 }}
    >
      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={onBack}
          className="h-10 w-10 items-center justify-center rounded-full active:bg-slate-100"
          hitSlop={8}
        >
          <MaterialIcons name="arrow-back" size={24} color={TEXT_DARK} />
        </Pressable>
        <View className="min-w-0 flex-1">
          <Text
            className="text-lg font-bold leading-tight"
            style={{ color: TEXT_DARK }}
            numberOfLines={1}
          >
            {titleLabel}
          </Text>
          <Text className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Natija
          </Text>
        </View>
        {isPassed !== undefined && (
          <View
            className="rounded-full px-3 py-1"
            style={{
              backgroundColor: isPassed ? `${SUCCESS}22` : `${ERROR}22`,
            }}
          >
            <Text
              className="text-xs font-bold"
              style={{ color: isPassed ? SUCCESS : ERROR }}
            >
              {isPassed ? "O&apos;tgan" : "O&apos;tmagan"}
            </Text>
          </View>
        )}
      </View>

      {scoreLabel ? (
        <Text className="mt-3 text-center text-sm text-slate-600">
          {scoreLabel}
        </Text>
      ) : null}

      <View className="mt-4 flex-row flex-wrap items-center justify-between gap-2">
        <View className="min-w-[45%] flex-1 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
          <Text className="text-[10px] font-bold uppercase text-slate-400">
            Noto toʻgʻri
          </Text>
          <Text className="text-lg font-bold" style={{ color: ERROR }}>
            {incorrectCount}
          </Text>
        </View>
        <View className="min-w-[45%] flex-1 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
          <Text className="text-[10px] font-bold uppercase text-slate-400">
            Jami savollar
          </Text>
          <Text className="text-lg font-bold" style={{ color: PRIMARY }}>
            {totalQuestions}
          </Text>
        </View>
      </View>

      <View className="mt-3">
        <View className="mb-1 flex-row justify-between">
          <Text className="text-xs font-semibold" style={{ color: PRIMARY }}>
            Ko'rilgan: {reviewedCount}/{totalQuestions}
          </Text>
          <Text className="text-xs font-medium text-slate-500">
            {progressPercent}%
          </Text>
        </View>
        <View className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <View
            className="h-full rounded-full"
            style={{
              width: `${Math.min(100, Math.max(0, progressPercent))}%`,
              backgroundColor: PRIMARY,
            }}
          />
        </View>
      </View>
    </View>
  );
}
