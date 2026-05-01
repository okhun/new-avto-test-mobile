import { ScalePressable } from "@/src/components/ui/ScalePressable";
import { useTheme } from "@/src/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import type { ExamHistoryEntry } from "../types/dashboard.types";
import {
  formatDateShort,
  parsePercentToNumber,
} from "../utils/dashboardFormat";

const SUCCESS = "#22c55e";
const ERROR = "#ef4444";

const MODE_UZ: Record<string, string> = {
  practice: "Amaliyot",
  exam: "Imtihon",
  ticket: "Bilet",
  weak_topics: "Zaif",
  marathon: "Marafon",
};

type Props = {
  tests: ExamHistoryEntry[];
  total: number;
  loading: boolean;
};

function statusVisual(entry: ExamHistoryEntry, neutralColor: string) {
  if (entry.isPassed) {
    return { color: SUCCESS, label: "passed", icon: "check-circle" as const };
  }
  if (
    entry.status === "failed" ||
    (entry.status === "completed" && !entry.isPassed)
  ) {
    return { color: ERROR, label: "failed", icon: "cancel" as const };
  }
  if (entry.status === "in_progress") {
    return {
      color: "#f59e0b",
      label: "in_progress",
      icon: "timelapse" as const,
    };
  }
  if (entry.status === "timed_out") {
    return {
      color: ERROR,
      label: "timed_out",
      icon: "hourglass-empty" as const,
    };
  }
  return {
    color: neutralColor,
    label: entry.status,
    icon: "help" as const,
  };
}

export function HomeRecentExamsSection({ tests, total, loading }: Props) {
  const router = useRouter();
  const { t } = useTranslation();
  const { palette } = useTheme();

  const onViewAll = useCallback(() => {
    router.push("/(tabs)/exams");
  }, [router]);

  const onOpen = useCallback(
    (id: string) => {
      router.push(`/exams/result/${id}`);
    },
    [router]
  );

  const primaryTint12 = `${palette.primary}20`;

  return (
    <View className="mt-6 px-5 pb-2">
      <View className="mb-3 flex-row items-center justify-between">
        <Text
          className="text-lg font-extrabold tracking-tight"
          style={{ color: palette.foreground }}
        >
          {t("recent_exams")}
        </Text>
        {total > 0 ? (
          <Pressable onPress={onViewAll} hitSlop={8}>
            <Text
              className="text-sm font-bold"
              style={{ color: palette.primary }}
            >
              {t("all")} ({total})
            </Text>
          </Pressable>
        ) : null}
      </View>

      {loading ? (
        <View className="items-center py-6">
          <ActivityIndicator size="small" color={palette.primary} />
          <Text className="mt-2 text-xs" style={{ color: palette.muted }}>
            {t("loading")}
          </Text>
        </View>
      ) : tests.length === 0 ? (
        <View
          className="rounded-2xl border border-dashed px-4 py-8"
          style={{
            borderColor: palette.border,
            backgroundColor: palette.card,
          }}
        >
          <Text
            className="text-center text-sm"
            style={{ color: palette.muted }}
          >
            {t("no_exam_history_yet")}
          </Text>
          <Pressable
            onPress={onViewAll}
            className="mt-4 self-center rounded-full px-4 py-2"
            style={{ backgroundColor: primaryTint12 }}
          >
            <Text
              className="text-sm font-bold"
              style={{ color: palette.primary }}
            >
              {t("go_to_exams")}
            </Text>
          </Pressable>
        </View>
      ) : (
        <View className="gap-3">
          {tests.map((e) => {
            const stRaw = statusVisual(e, palette.chevron);
            const stColor = stRaw.color;
            const mode = MODE_UZ[e.mode] ?? e.mode;
            const scoreN = parsePercentToNumber(e.score);
            const totalQ = e.totalQuestions ?? 0;
            const correct = e.correctAnswers ?? 0;
            const ratio = totalQ > 0 ? correct / totalQ : 0;
            return (
              <ScalePressable
                key={e.id}
                onPress={() => onOpen(e.id)}
                style={{
                  borderRadius: 18,
                  backgroundColor: palette.card,
                  borderWidth: 1,
                  borderColor: palette.border,
                  borderLeftWidth: 4,
                  borderLeftColor: stColor,
                  paddingVertical: 14,
                  paddingHorizontal: 14,
                  flexDirection: "row",
                  alignItems: "stretch",
                  gap: 12,
                  shadowColor: palette.shadow,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: palette.cardShadowOpacity,
                  shadowRadius: 4,
                  elevation: 1,
                }}
              >
                <View className="flex-row items-center justify-between w-full gap-2">
                  <View className="min-w-0 flex-1" style={{ paddingRight: 2 }}>
                    <View className="flex-row items-start justify-between gap-2">
                      <View
                        className="max-w-[58%] rounded-lg px-2.5 py-1"
                        style={{ backgroundColor: primaryTint12 }}
                      >
                        <Text
                          className="text-[12px] font-extrabold"
                          style={{ color: palette.primary }}
                          numberOfLines={1}
                        >
                          {mode}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-1">
                        <MaterialIcons
                          name="schedule"
                          size={13}
                          color={palette.chevron}
                        />
                        <Text
                          className="text-[11px] font-medium"
                          style={{ color: palette.muted }}
                        >
                          {formatDateShort(e.startedAt ?? e.createdAt)}
                        </Text>
                      </View>
                    </View>

                    <View className="mt-3">
                      <View className="mb-1.5 flex-row items-end justify-between">
                        <Text
                          className="text-xs font-semibold"
                          style={{ color: palette.muted }}
                        >
                          {t("correct_answers")}
                        </Text>
                        <Text
                          className="text-sm font-bold"
                          style={{ color: palette.foreground }}
                        >
                          {correct}
                          <Text style={{ color: palette.chevron }}> / </Text>
                          {totalQ > 0 ? totalQ : "—"}
                        </Text>
                      </View>
                      <View
                        className="h-2 overflow-hidden rounded-full"
                        style={{ backgroundColor: palette.divider }}
                      >
                        <View
                          style={{
                            width: `${Math.min(100, Math.round(ratio * 1000) / 10)}%`,
                            backgroundColor: stColor,
                            height: "100%",
                            borderRadius: 9999,
                          }}
                        />
                      </View>
                    </View>

                    <View className="mt-3 flex-row items-center justify-between">
                      <View
                        className="flex-row items-center gap-1.5 rounded-full px-2.5 py-1"
                        style={{ backgroundColor: `${stColor}22` }}
                      >
                        <MaterialIcons
                          name={stRaw.icon}
                          size={15}
                          color={stColor}
                        />
                        <Text
                          className="text-[11px] font-bold"
                          style={{ color: stColor }}
                        >
                          {t(`${stRaw.label}`)}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-0.5">
                        <Text
                          className="text-[11px] font-semibold"
                          style={{ color: palette.muted }}
                        >
                          {t("detailed")}
                        </Text>
                        <MaterialCommunityIcons
                          name="chevron-right"
                          size={18}
                          color={palette.chevron}
                        />
                      </View>
                    </View>
                  </View>

                  <View className="items-center justify-center self-center pl-0.5">
                    <View
                      className="h-[72px] w-[72px] items-center justify-center rounded-full"
                      style={{
                        backgroundColor: `${stColor}18`,
                        borderWidth: 2,
                        borderColor: `${stColor}44`,
                      }}
                    >
                      {scoreN != null ? (
                        <View className="items-center">
                          <View className="flex-row items-baseline">
                            <Text
                              className="text-[22px] font-black tabular-nums"
                              style={{ color: stColor, lineHeight: 26 }}
                            >
                              {Math.round(scoreN)}
                            </Text>
                            <Text
                              className="ml-0.5 text-sm font-extrabold"
                              style={{ color: stColor, opacity: 0.75 }}
                            >
                              %
                            </Text>
                          </View>
                          <Text
                            className="mt-0.5 text-[10px] font-semibold"
                            style={{ color: palette.muted }}
                          >
                            {t("score")}
                          </Text>
                        </View>
                      ) : (
                        <>
                          <Text
                            className="text-2xl font-bold"
                            style={{
                              color: palette.chevron,
                              lineHeight: 28,
                            }}
                          >
                            —
                          </Text>
                          <Text
                            className="mt-0.5 text-[10px] font-medium"
                            style={{ color: palette.muted }}
                          >
                            {t("score")}
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                </View>
              </ScalePressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
