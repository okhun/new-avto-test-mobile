import { ScalePressable } from "@/src/components/ui/ScalePressable";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Text, View } from "react-native";
import type { ExamHistoryEntry } from "../../practice/types/practice.types";

const PRIMARY = "#137fec";
const SUCCESS = "#22c55e";
const ERROR = "#ef4444";
const WARNING = "#f59e0b";
const TEXT_DARK = "#0f172a";
const CARD_BG = "#ffffff";

type StatusKey = "passed" | "failed" | "in_progress" | "completed";

const STATUS_CONFIG: Record<
  StatusKey,
  {
    color: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    label: string;
  }
> = {
  passed: { color: SUCCESS, icon: "check-circle", label: "Passed" },
  failed: { color: ERROR, icon: "cancel", label: "Failed" },
  in_progress: { color: WARNING, icon: "timelapse", label: "In Progress" },
  completed: { color: PRIMARY, icon: "task-alt", label: "Completed" },
};

const MODE_LABELS: Record<string, string> = {
  practice: "Practice",
  exam: "Exam",
  ticket: "Ticket",
  weak_topics: "Weak Topics",
  marathon: "Marathon",
};

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
        backgroundColor: CARD_BG,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#f1f5f9",
      }}
    >
      {/* Top row: mode + status */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View
            className="rounded-lg px-2.5 py-1"
            style={{ backgroundColor: `${PRIMARY}12` }}
          >
            <Text style={{ color: PRIMARY, fontSize: 12, fontWeight: "700" }}>
              {modeLabel}
            </Text>
          </View>
          <Text className="text-xs text-slate-400">
            {formatDate(entry.startedAt)}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <MaterialIcons name={config.icon} size={16} color={config.color} />
          <Text
            style={{ color: config.color, fontSize: 13, fontWeight: "700" }}
          >
            {config.label}
          </Text>
        </View>
      </View>

      {/* Score row */}
      <View className="mt-3 flex-row items-end justify-between">
        <View className="flex-row items-baseline gap-1">
          <Text
            className="text-3xl font-bold leading-none"
            style={{ color: config.color }}
          >
            {scorePercent}%
          </Text>
        </View>
        <Text className="text-sm text-slate-500">
          <Text style={{ color: TEXT_DARK, fontWeight: "700" }}>
            {entry.correctAnswers}
          </Text>
          /{entry.totalQuestions} correct
        </Text>
      </View>

      {/* Progress bar */}
      <View className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <View
          className="h-full rounded-full"
          style={{
            width: `${Math.min(progressRatio * 100, 100)}%`,
            backgroundColor: config.color,
          }}
        />
      </View>

      {/* Bottom stats */}
      <View className="mt-3 flex-row items-center gap-4">
        <View className="flex-row items-center gap-1">
          <MaterialIcons name="schedule" size={14} color="#94a3b8" />
          <Text className="text-xs font-medium text-slate-400">
            {formatTime(entry.timeSpentSeconds)}
          </Text>
        </View>
        {entry.wrongAnswers > 0 && (
          <View className="flex-row items-center gap-1">
            <MaterialIcons name="close" size={14} color="#94a3b8" />
            <Text className="text-xs font-medium text-slate-400">
              {entry.wrongAnswers} wrong
            </Text>
          </View>
        )}
        {entry.skippedQuestions > 0 && (
          <View className="flex-row items-center gap-1">
            <MaterialIcons name="skip-next" size={14} color="#94a3b8" />
            <Text className="text-xs font-medium text-slate-400">
              {entry.skippedQuestions} skipped
            </Text>
          </View>
        )}
        {entry.xpEarned != null && entry.xpEarned > 0 && (
          <View className="ml-auto flex-row items-center gap-1">
            <MaterialIcons name="star" size={14} color="#f59e0b" />
            <Text className="text-xs font-bold" style={{ color: "#f59e0b" }}>
              +{entry.xpEarned} XP
            </Text>
          </View>
        )}
      </View>
    </ScalePressable>
  );
}
