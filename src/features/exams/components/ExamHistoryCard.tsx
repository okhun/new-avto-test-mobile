import { ScalePressable } from "@/src/components/ui/ScalePressable";
import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import type { ExamHistoryEntry } from "../../practice/types/practice.types";

const SUCCESS = "#22c55e";
const ERROR = "#ef4444";
const WARNING = "#f59e0b";
const XP_ACCENT = "#f59e0b";

type StatusKey = "passed" | "failed" | "in_progress" | "completed";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface ExamHistoryCardProps {
  entry: ExamHistoryEntry;
  onPress?: () => void;
}

export function ExamHistoryCard({ entry, onPress }: ExamHistoryCardProps) {
  const { t } = useTranslation();
  const { palette } = useTheme();

  const STATUS_CONFIG: Record<
    StatusKey,
    {
      color: string;
      icon: keyof typeof MaterialIcons.glyphMap;
      label: string;
    }
  > = {
    passed: { color: SUCCESS, icon: "check-circle", label: t("passed") },
    failed: { color: ERROR, icon: "cancel", label: t("failed") },
    in_progress: { color: WARNING, icon: "timelapse", label: t("in_progress") },
    completed: {
      color: palette.primary,
      icon: "task-alt",
      label: t("completed"),
    },
  };
  const MODE_LABELS: Record<string, string> = {
    practice: t("practice"),
    exam: t("exam"),
    ticket: t("ticket"),
    weak_topics: t("weak_topics"),
    marathon: t("marathon"),
  };
  const statusKey = (entry.isPassed ? "passed" : entry.status) as StatusKey;
  const config = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.completed;
  const modeLabel = MODE_LABELS[entry.mode] ?? entry.mode;
  const scoreNum = parseFloat(entry.score);
  const scorePercent = isNaN(scoreNum) ? 0 : Math.round(scoreNum);
  const progressRatio =
    entry.totalQuestions > 0 ? entry.correctAnswers / entry.totalQuestions : 0;

  return (
    <ScalePressable
      onPress={onPress}
      style={{
        backgroundColor: palette.card,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: palette.border,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View
            className="rounded-lg px-2.5 py-1"
            style={{ backgroundColor: `${palette.primary}12` }}
          >
            <Text
              style={{
                color: palette.primary,
                fontSize: 12,
                fontWeight: "700",
              }}
            >
              {modeLabel}
            </Text>
          </View>
          <Text className="text-xs" style={{ color: palette.chevron }}>
            {formatDate(entry.startedAt)}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <MaterialIcons name={config.icon} size={16} color={config.color} />
          <Text
            style={{ color: config.color, fontSize: 13, fontWeight: "700" }}
            className="capitalize"
          >
            {config.label}
          </Text>
        </View>
      </View>

      <View className="mt-3 flex-row items-end justify-between">
        <View className="flex-row items-baseline gap-1">
          <Text
            className="text-3xl font-bold leading-none"
            style={{ color: config.color }}
          >
            {scorePercent}%
          </Text>
        </View>
        <Text className="text-sm" style={{ color: palette.muted }}>
          <Text style={{ color: palette.foreground, fontWeight: "700" }}>
            {entry.correctAnswers}
          </Text>
          /{entry.totalQuestions} {t("correct")}
        </Text>
      </View>

      <View
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: palette.divider }}
      >
        <View
          className="h-full rounded-full"
          style={{
            width: `${Math.min(progressRatio * 100, 100)}%`,
            backgroundColor: config.color,
          }}
        />
      </View>

      <View className="mt-3 flex-row items-center gap-4">
        <View className="flex-row items-center gap-1">
          <MaterialIcons name="schedule" size={14} color={palette.muted} />
          <Text
            className="text-xs font-medium"
            style={{ color: palette.muted }}
          >
            {formatTime(entry.timeSpentSeconds)}
          </Text>
        </View>
        {entry.wrongAnswers > 0 && (
          <View className="flex-row items-center gap-1">
            <MaterialIcons name="close" size={14} color={palette.muted} />
            <Text
              className="text-xs font-medium"
              style={{ color: palette.muted }}
            >
              {entry.wrongAnswers} {t("wrong")}
            </Text>
          </View>
        )}
        {entry.skippedQuestions > 0 && (
          <View className="flex-row items-center gap-1">
            <MaterialIcons name="skip-next" size={14} color={palette.muted} />
            <Text
              className="text-xs font-medium"
              style={{ color: palette.muted }}
            >
              {entry.skippedQuestions} {t("skipped")}
            </Text>
          </View>
        )}
        {entry.xpEarned != null && entry.xpEarned > 0 && (
          <View className="ml-auto flex-row items-center gap-1">
            <MaterialIcons name="star" size={14} color={XP_ACCENT} />
            <Text className="text-xs font-bold" style={{ color: XP_ACCENT }}>
              +{entry.xpEarned} XP
            </Text>
          </View>
        )}
      </View>
    </ScalePressable>
  );
}
