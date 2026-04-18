import { ScalePressable } from "@/src/components/ui/ScalePressable";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ExamHistoryEntry } from "../../practice/types/practice.types";
import { ExamHistoryCard } from "../components/ExamHistoryCard";
import { ExamListSkeleton } from "../components/ExamListSkeleton";
import { useExamHistoryInfinite } from "../hook/useExams";
import type { GetExamHistoryParams } from "../types/exams.types";

const PRIMARY = "#137fec";
const BG = "#f4f5f7";
const SUCCESS = "#22c55e";
const ERROR = "#ef4444";
const WARNING = "#f59e0b";
const TEXT_DARK = "#0f172a";
const CARD_BG = "#ffffff";

type FilterId = "all" | "passed" | "failed" | "in_progress";

const FILTERS: ReadonlyArray<{ id: FilterId; label: string }> = [
  { id: "all", label: "All" },
  { id: "passed", label: "Passed" },
  { id: "failed", label: "Failed" },
  { id: "in_progress", label: "In Progress" },
];

// ─── Stat card ────────────────────────────────────────────
function StatCard({
  icon,
  iconColor,
  value,
  label,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  iconColor: string;
  value: number;
  label: string;
}) {
  return (
    <View
      className="flex-1 flex-col gap-1 rounded-2xl border border-slate-100 p-4 shadow-sm"
      style={{ backgroundColor: CARD_BG }}
    >
      <View className="mb-1">
        <MaterialIcons name={icon} size={20} color={iconColor} />
      </View>
      <Text
        className="text-2xl font-bold leading-tight"
        style={{ color: TEXT_DARK }}
      >
        {value}
      </Text>
      <Text className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </Text>
    </View>
  );
}

// ─── Filter pill ──────────────────────────────────────────
function FilterPill({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="items-center justify-center rounded-full border"
      style={{
        height: 36,
        paddingHorizontal: 20,
        backgroundColor: isActive ? PRIMARY : CARD_BG,
        borderColor: isActive ? PRIMARY : "#e2e8f0",
      }}
    >
      <Text
        style={{
          fontSize: 13,
          color: isActive ? "#ffffff" : "#475569",
          fontWeight: isActive ? "600" : "500",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// ─── Empty state ──────────────────────────────────────────
function EmptyState({ filterLabel }: { filterLabel: string }) {
  return (
    <View className="items-center justify-center px-8 py-20">
      <MaterialIcons name="history" size={48} color="#cbd5e1" />
      <Text className="mt-3 text-center text-base font-semibold text-slate-400">
        No {filterLabel.toLowerCase()} exams yet
      </Text>
      <Text className="mt-1 text-center text-xs text-slate-400">
        Your exam results will appear here
      </Text>
    </View>
  );
}

// ─── Footer loader ────────────────────────────────────────
function ListFooter({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;
  return (
    <View className="items-center py-6">
      <ActivityIndicator size="small" color={PRIMARY} />
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────
export default function ExamsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");

  const queryParams = useMemo<
    Omit<GetExamHistoryParams, "page" | "limit"> | undefined
  >(() => {
    if (activeFilter === "all") return undefined;
    return { status: activeFilter as any };
  }, [activeFilter]);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useExamHistoryInfinite(queryParams);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const entries: ExamHistoryEntry[] = useMemo(
    () => data?.pages.flatMap((p) => p.tests) ?? [],
    [data]
  );

  const totalCount = data?.pages[0]?.total ?? 0;

  const stats = useMemo(() => {
    let passed = 0;
    let failed = 0;
    let inProgress = 0;
    for (const e of entries) {
      if (e.isPassed) passed++;
      else if (e.status === "failed") failed++;
      else if (e.status === "in_progress") inProgress++;
    }
    return { passed, failed, inProgress };
  }, [entries]);

  const activeFilterLabel =
    FILTERS.find((f) => f.id === activeFilter)?.label ?? "All";

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: ExamHistoryEntry }) => (
      <View className="px-4">
        <ExamHistoryCard
          entry={item}
          onPress={() => router.push(`/exams/result/${item.id}`)}
        />
      </View>
    ),
    []
  );

  // ── Initial loading ──
  if (isLoading && entries.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top"]}>
        <View className="px-4 pb-2 pt-4">
          <Text
            className="text-2xl font-bold tracking-tight"
            style={{ color: TEXT_DARK }}
          >
            Imtihon natijalari
          </Text>
          <Text className="mt-1 text-sm leading-snug text-slate-400">
            Natijangizni tahlil qiling va yaxshilash kerak bo'lgan jihatlarni
            aniqlang.
          </Text>
        </View>
        <ExamListSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top"]}>
      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120, gap: 12 }}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isFetchingNextPage}
            onRefresh={() => refetch()}
            tintColor={PRIMARY}
          />
        }
        ListHeaderComponent={
          <>
            {/* Title */}
            <View className="px-4 pb-2 pt-4">
              <Text
                className="text-2xl font-bold tracking-tight"
                style={{ color: TEXT_DARK }}
              >
                Imtihon natijalari
              </Text>
              <Text className="mt-1 text-sm leading-snug text-slate-400">
                Natijangizni tahlil qiling va yaxshilash kerak bo'lgan
                jihatlarni aniqlang.
              </Text>
            </View>

            {/* Stats */}
            <View className="flex-row gap-3 px-4 py-2">
              <StatCard
                icon="check-circle"
                iconColor={SUCCESS}
                value={stats.passed}
                label="Passed"
              />
              <StatCard
                icon="cancel"
                iconColor={ERROR}
                value={stats.failed}
                label="Failed"
              />
              <StatCard
                icon="timelapse"
                iconColor={WARNING}
                value={stats.inProgress}
                label="In Progress"
              />
            </View>

            {/* Filters */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                gap: 8,
              }}
            >
              {FILTERS.map((f) => (
                <FilterPill
                  key={f.id}
                  label={f.label}
                  isActive={activeFilter === f.id}
                  onPress={() => setActiveFilter(f.id)}
                />
              ))}
            </ScrollView>
          </>
        }
        ListEmptyComponent={<EmptyState filterLabel={activeFilterLabel} />}
        ListFooterComponent={<ListFooter isLoading={isFetchingNextPage} />}
      />

      {/* Start New Exam — fixed at bottom */}
      <View className="absolute bottom-0 left-0 right-0 px-6 pb-24 pt-2">
        <ScalePressable
          onPress={() => router.push("/exams/start")}
          style={{
            backgroundColor: PRIMARY,
            shadowColor: PRIMARY,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
          className="rounded-2xl py-4"
        >
          <View className="flex-row items-center justify-center gap-2">
            <MaterialIcons name="play-arrow" size={20} color="#ffffff" />
            <Text className="text-base font-bold text-white">
              Start New Exam
            </Text>
          </View>
        </ScalePressable>
      </View>
    </SafeAreaView>
  );
}
