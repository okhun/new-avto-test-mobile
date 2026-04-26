import { ScalePressable } from "@/src/components/ui/ScalePressable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import type { ExamHistoryEntry } from "../types/dashboard.types";
import { formatDateShort } from "../utils/dashboardFormat";

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
            const score = e.score != null ? String(e.score) : "—";
            return (
              <ScalePressable
                key={e.id}
                onPress={() => onOpen(e.id)}
                style={{
                  borderRadius: 20,
                  backgroundColor: "#ffffff",
                  borderWidth: 1,
                  borderColor: "#f1f5f9",
                  padding: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <View
                  className="h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${st.color}18` }}
                >
                  <MaterialIcons name={st.icon} size={26} color={st.color} />
                </View>
                <View className="min-w-0 flex-1">
                  <View className="flex-row items-center gap-2">
                    <View
                      className="rounded-md px-2 py-0.5"
                      style={{ backgroundColor: `${PRIMARY}14` }}
                    >
                      <Text
                        className="text-[11px] font-bold"
                        style={{ color: PRIMARY }}
                      >
                        {mode}
                      </Text>
                    </View>
                    <Text className="text-xs text-slate-400">
                      {formatDateShort(e.startedAt ?? e.createdAt)}
                    </Text>
                  </View>
                  <Text
                    className="mt-1 text-sm font-bold text-slate-900"
                    numberOfLines={1}
                  >
                    Ball: {score}% · {e.correctAnswers}/{e.totalQuestions}{" "}
                    to&apos;g&apos;ri
                  </Text>
                  <Text
                    className="text-xs font-semibold"
                    style={{ color: st.color }}
                  >
                    {st.label}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={22}
                  color="#cbd5e1"
                />
              </ScalePressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
