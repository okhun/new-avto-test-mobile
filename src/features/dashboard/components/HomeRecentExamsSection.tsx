import { ScalePressable } from "@/src/components/ui/ScalePressable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import type { ExamHistoryEntry } from "../types/dashboard.types";
import {
  formatDateShort,
  parsePercentToNumber,
} from "../utils/dashboardFormat";

const PRIMARY = "#137fec";
const SUCCESS = "#22c55e";
const ERROR = "#ef4444";
const MUTED = "#64748b";

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

function statusVisual(entry: ExamHistoryEntry) {
  if (entry.isPassed) {
    return { color: SUCCESS, label: "O'tgan", icon: "check-circle" as const };
  }
  if (
    entry.status === "failed" ||
    (entry.status === "completed" && !entry.isPassed)
  ) {
    return { color: ERROR, label: "O'tmagan", icon: "cancel" as const };
  }
  if (entry.status === "in_progress") {
    return { color: "#f59e0b", label: "Jarayonda", icon: "timelapse" as const };
  }
  if (entry.status === "timed_out") {
    return {
      color: ERROR,
      label: "Vaqt tugagan",
      icon: "hourglass-empty" as const,
    };
  }
  return { color: MUTED, label: entry.status, icon: "help" as const };
}

export function HomeRecentExamsSection({ tests, total, loading }: Props) {
  const router = useRouter();

  const onViewAll = useCallback(() => {
    router.push("/(tabs)/exams");
  }, [router]);

  const onOpen = useCallback(
    (id: string) => {
      router.push(`/exams/result/${id}`);
    },
    [router]
  );

  return (
    <View className="mt-6 px-5 pb-2">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-lg font-extrabold tracking-tight text-slate-900">
          So&apos;nggi imtihonlar
        </Text>
        {total > 0 ? (
          <Pressable onPress={onViewAll} hitSlop={8}>
            <Text className="text-sm font-bold" style={{ color: PRIMARY }}>
              Barchasi ({total})
            </Text>
          </Pressable>
        ) : null}
      </View>

      {loading ? (
        <View className="items-center py-6">
          <ActivityIndicator size="small" color={PRIMARY} />
          <Text className="mt-2 text-xs text-slate-400">Yuklanmoqda…</Text>
        </View>
      ) : tests.length === 0 ? (
        <View className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-8">
          <Text className="text-center text-sm text-slate-500">
            Hozircha imtihon tarixi yo&apos;q. &quot;Imtihon&quot;
            bo&apos;limidan yangi urinish boshlang.
          </Text>
          <Pressable
            onPress={onViewAll}
            className="mt-4 self-center rounded-full px-4 py-2"
            style={{ backgroundColor: `${PRIMARY}18` }}
          >
            <Text className="text-sm font-bold" style={{ color: PRIMARY }}>
              Imtihonlarga o&apos;tish
            </Text>
          </Pressable>
        </View>
      ) : (
        <View className="gap-3">
          {tests.map((e) => {
            const st = statusVisual(e);
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
                  backgroundColor: "#ffffff",
                  borderWidth: 1,
                  borderColor: "#e2e8f0",
                  borderLeftWidth: 4,
                  borderLeftColor: st.color,
                  paddingVertical: 14,
                  paddingHorizontal: 14,
                  flexDirection: "row",
                  alignItems: "stretch",
                  gap: 12,
                  // subtle shadow
                  shadowColor: "#0f172a",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 1,
                }}
              >
                <View className="flex-row items-center justify-between w-full gap-2">
                  <View className="min-w-0 flex-1" style={{ paddingRight: 2 }}>
                    <View className="flex-row items-start justify-between gap-2">
                      <View
                        className="max-w-[58%] rounded-lg px-2.5 py-1"
                        style={{ backgroundColor: `${PRIMARY}12` }}
                      >
                        <Text
                          className="text-[12px] font-extrabold"
                          style={{ color: PRIMARY }}
                          numberOfLines={1}
                        >
                          {mode}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-1">
                        <MaterialIcons
                          name="schedule"
                          size={13}
                          color="#94a3b8"
                        />
                        <Text className="text-[11px] font-medium text-slate-400">
                          {formatDateShort(e.startedAt ?? e.createdAt)}
                        </Text>
                      </View>
                    </View>

                    <View className="mt-3">
                      <View className="mb-1.5 flex-row items-end justify-between">
                        <Text className="text-xs font-semibold text-slate-500">
                          To&apos;g&apos;ri javoblar
                        </Text>
                        <Text className="text-sm font-bold text-slate-800">
                          {correct}
                          <Text className="text-slate-300"> / </Text>
                          {totalQ > 0 ? totalQ : "—"}
                        </Text>
                      </View>
                      <View className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <View
                          style={{
                            width: `${Math.min(100, Math.round(ratio * 1000) / 10)}%`,
                            backgroundColor: st.color,
                            height: "100%",
                            borderRadius: 9999,
                          }}
                        />
                      </View>
                    </View>

                    <View className="mt-3 flex-row items-center justify-between">
                      <View
                        className="flex-row items-center gap-1.5 rounded-full px-2.5 py-1"
                        style={{ backgroundColor: `${st.color}14` }}
                      >
                        <MaterialIcons
                          name={st.icon}
                          size={15}
                          color={st.color}
                        />
                        <Text
                          className="text-[11px] font-bold"
                          style={{ color: st.color }}
                        >
                          {st.label}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-0.5">
                        <Text className="text-[11px] font-semibold text-slate-400">
                          Batafsil
                        </Text>
                        <MaterialCommunityIcons
                          name="chevron-right"
                          size={18}
                          color="#94a3b8"
                        />
                      </View>
                    </View>
                  </View>

                  <View className="items-center justify-center self-center pl-0.5">
                    <View
                      className="h-[72px] w-[72px] items-center justify-center rounded-full"
                      style={{
                        backgroundColor: `${st.color}12`,
                        borderWidth: 2,
                        borderColor: `${st.color}30`,
                      }}
                    >
                      {scoreN != null ? (
                        <View className="items-center">
                          <View className="flex-row items-baseline">
                            <Text
                              className="text-[22px] font-black tabular-nums"
                              style={{ color: st.color, lineHeight: 26 }}
                            >
                              {Math.round(scoreN)}
                            </Text>
                            <Text
                              className="ml-0.5 text-sm font-extrabold"
                              style={{ color: st.color, opacity: 0.75 }}
                            >
                              %
                            </Text>
                          </View>
                          <Text className="mt-0.5 text-[10px] font-semibold text-slate-500">
                            ball
                          </Text>
                        </View>
                      ) : (
                        <>
                          <Text
                            className="text-2xl font-bold text-slate-300"
                            style={{ lineHeight: 28 }}
                          >
                            —
                          </Text>
                          <Text className="mt-0.5 text-[10px] font-medium text-slate-400">
                            ball
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
