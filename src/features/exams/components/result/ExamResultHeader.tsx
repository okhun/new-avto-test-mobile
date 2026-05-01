import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

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
  const { t } = useTranslation();
  const { palette } = useTheme();

  return (
    <View
      className="px-4 pb-4 pt-2"
      style={{
        backgroundColor: palette.card,
        borderBottomColor: palette.divider,
        borderBottomWidth: 1,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={onBack}
          className="h-10 w-10 items-center justify-center rounded-full"
          hitSlop={8}
          style={({ pressed }) =>
            pressed ? { backgroundColor: palette.surfacePressed } : undefined
          }
        >
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={palette.foreground}
          />
        </Pressable>
        <View className="min-w-0 flex-1">
          <Text
            className="text-lg font-bold leading-tight"
            style={{ color: palette.foreground }}
            numberOfLines={1}
          >
            {titleLabel}
          </Text>
          <Text
            className="mt-0.5 text-xs font-semibold uppercase tracking-wider"
            style={{ color: palette.chevron }}
          >
            {t("result")}
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
              {isPassed ? t("passed") : t("failed")}
            </Text>
          </View>
        )}
      </View>

      {scoreLabel ? (
        <Text
          className="mt-3 text-center text-sm"
          style={{ color: palette.muted }}
        >
          {scoreLabel}
        </Text>
      ) : null}

      <View className="mt-4 flex-row flex-wrap items-center justify-between gap-2">
        <View
          className="min-w-[45%] flex-1 rounded-xl border px-3 py-2"
          style={{
            borderColor: palette.border,
            backgroundColor: palette.iconSurface,
          }}
        >
          <Text
            className="text-[10px] font-bold uppercase"
            style={{ color: palette.chevron }}
          >
            {t("incorrect")}
          </Text>
          <Text className="text-lg font-bold" style={{ color: ERROR }}>
            {incorrectCount}
          </Text>
        </View>
        <View
          className="min-w-[45%] flex-1 rounded-xl border px-3 py-2"
          style={{
            borderColor: palette.border,
            backgroundColor: palette.iconSurface,
          }}
        >
          <Text
            className="text-[10px] font-bold uppercase"
            style={{ color: palette.chevron }}
          >
            {t("total_questions_label")}
          </Text>
          <Text
            className="text-lg font-bold"
            style={{ color: palette.primary }}
          >
            {totalQuestions}
          </Text>
        </View>
      </View>

      <View className="mt-3">
        <View className="mb-1 flex-row justify-between">
          <Text
            className="text-xs font-semibold"
            style={{ color: palette.primary }}
          >
            {t("reviewed")}: {reviewedCount}/{totalQuestions}
          </Text>
          <Text
            className="text-xs font-medium"
            style={{ color: palette.muted }}
          >
            {progressPercent}%
          </Text>
        </View>
        <View
          className="h-2 w-full overflow-hidden rounded-full"
          style={{ backgroundColor: palette.divider }}
        >
          <View
            className="h-full rounded-full"
            style={{
              width: `${Math.min(100, Math.max(0, progressPercent))}%`,
              backgroundColor: palette.primary,
            }}
          />
        </View>
      </View>
    </View>
  );
}
