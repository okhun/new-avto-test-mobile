import { ScalePressable } from "@/src/components/ui/ScalePressable";
import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ExamHistoryEntry } from "../../practice/types/practice.types";
import { ExamHistoryCard } from "../components/ExamHistoryCard";
import { ExamListSkeleton } from "../components/ExamListSkeleton";
import { useExamHistoryInfinite } from "../hook/useExams";
import type { GetExamHistoryParams } from "../types/exams.types";

const SUCCESS = "#22c55e";
const ERROR = "#ef4444";
const WARNING = "#f59e0b";

type FilterId = "all" | "passed" | "failed" | "in_progress";

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
  const { palette, isDark } = useTheme();
  const iconSurface = isDark ? `${iconColor}2B` : `${iconColor}18`;
  return (
    <View
      className="flex-1 rounded-2xl border px-3 py-3"
      style={{
        backgroundColor: palette.card,
        borderColor: palette.border,
        shadowColor: palette.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: palette.cardShadowOpacity,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      <View className="mb-2 flex-row items-center justify-between">
        <View
          className="h-8 w-8 items-center justify-center rounded-xl"
          style={{ backgroundColor: iconSurface }}
        >
          <MaterialIcons name={icon} size={18} color={iconColor} />
        </View>
        <View
          className="h-1.5 w-9 rounded-full"
          style={{ backgroundColor: iconColor }}
        />
      </View>
      <Text
        className="text-xl font-extrabold leading-tight"
        style={{ color: palette.foreground }}
      >
        {value}
      </Text>
      <Text
        className="mt-1 text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: palette.muted }}
      >
        {label}
      </Text>
    </View>
  );
}

function FilterPill({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  const { palette } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      className="items-center justify-center rounded-full border"
      style={{
        height: 36,
        paddingHorizontal: 20,
        backgroundColor: isActive ? palette.primary : palette.card,
        borderColor: isActive ? palette.primary : palette.border,
      }}
    >
      <Text
        style={{
          fontSize: 13,
          color: isActive ? palette.switchThumb : palette.muted,
          fontWeight: isActive ? "600" : "500",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function EmptyState() {
  const { t } = useTranslation();
  const { palette } = useTheme();
  return (
    <View className="items-center justify-center px-8 py-20">
      <MaterialIcons name="history" size={48} color={palette.chevron} />
      <Text
        className="mt-3 text-center text-base font-semibold"
        style={{ color: palette.muted }}
      >
        {t("no_exams_yet")}
      </Text>
      <Text
        className="mt-1 text-center text-xs"
        style={{ color: palette.chevron }}
      >
        {t("your_exam_results_will_appear_here")}
      </Text>
    </View>
  );
}

/** FlatList calls onEndReached on mount when content is shorter than the viewport; only load more after real scroll. */
const SCROLL_GATE_PX = 48;

function ExamHistoryListFooter({
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}) {
  const { palette } = useTheme();
  const { t } = useTranslation();
  if (isFetchingNextPage) {
    return (
      <View className="items-center py-6">
        <ActivityIndicator size="small" color={palette.primary} />
      </View>
    );
  }
  if (!hasNextPage) return null;
  return (
    <View className="px-4 pb-6 pt-2">
      <Pressable
        onPress={onLoadMore}
        className="items-center rounded-2xl border py-3"
        style={{
          borderColor: palette.border,
          backgroundColor: palette.card,
        }}
      >
        <Text
          className="text-sm font-semibold"
          style={{ color: palette.primary }}
        >
          {t("exam_history_load_more")}
        </Text>
      </Pressable>
    </View>
  );
}

export default function ExamsScreen() {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const router = useRouter();
  const hasUserScrolledForNextPage = useRef(false);
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const FILTERS: ReadonlyArray<{ id: FilterId; label: string }> = [
    { id: "all", label: t("view_all") },
    { id: "passed", label: t("completed") },
    { id: "failed", label: t("failed") },
    { id: "in_progress", label: t("in_progress") },
  ];
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

  useEffect(() => {
    hasUserScrolledForNextPage.current = false;
  }, [activeFilter]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const entries: ExamHistoryEntry[] = useMemo(
    () => data?.pages.flatMap((p) => p.tests) ?? [],
    [data]
  );

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

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (e.nativeEvent.contentOffset.y >= SCROLL_GATE_PX) {
        hasUserScrolledForNextPage.current = true;
      }
    },
    []
  );

  const handleEndReached = useCallback(() => {
    if (!hasUserScrolledForNextPage.current) return;
    handleLoadMore();
  }, [handleLoadMore]);

  const renderItem = useCallback(
    ({ item }: { item: ExamHistoryEntry }) => (
      <View className="px-4">
        <ExamHistoryCard
          entry={item}
          onPress={() => router.push(`/exams/result/${item.id}`)}
        />
      </View>
    ),
    [router]
  );

  if (isLoading && entries.length === 0) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: palette.background }}
        edges={["top"]}
      >
        <View className="px-4 pb-2 pt-4">
          <Text
            className="text-2xl font-bold tracking-tight"
            style={{ color: palette.foreground }}
          >
            {t("exam_history_title")}
          </Text>
          <Text
            className="mt-1 text-sm leading-snug"
            style={{ color: palette.muted }}
          >
            {t("exam_history_description")}
          </Text>
        </View>
        <ExamListSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: palette.background }}
      edges={["top"]}
    >
      <View
        className="border-b px-4 pb-3 pt-2"
        style={{
          borderBottomColor: palette.border,
          backgroundColor: palette.background,
        }}
      >
        <Text
          className="text-2xl font-bold tracking-tight"
          style={{ color: palette.foreground }}
        >
          {t("exam_history_title")}
        </Text>
        <Text
          className="mt-1 text-sm leading-snug"
          style={{ color: palette.muted }}
        >
          {t("exam_history_description")}
        </Text>

        {/* <View className="mt-3 flex-row gap-3">
          <StatCard
            icon="check-circle"
            iconColor={SUCCESS}
            value={stats.passed}
            label={t("passed")}
          />
          <StatCard
            icon="cancel"
            iconColor={ERROR}
            value={stats.failed}
            label={t("failed")}
          />
          <StatCard
            icon="timelapse"
            iconColor={WARNING}
            value={stats.inProgress}
            label={t("in_progress")}
          />
        </View> */}

        {/* <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: 10,
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
        </ScrollView> */}
      </View>

      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120, gap: 12, paddingTop: 12 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={400}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.35}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isFetchingNextPage}
            onRefresh={() => refetch()}
            tintColor={palette.primary}
          />
        }
        ListEmptyComponent={<EmptyState />}
        ListFooterComponent={
          <ExamHistoryListFooter
            hasNextPage={!!hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={handleLoadMore}
          />
        }
      />

      <View className="absolute bottom-0 left-0 right-0 px-6 pb-24 pt-2">
        <ScalePressable
          onPress={() => router.push("/exams/start")}
          style={{
            backgroundColor: palette.primary,
            shadowColor: palette.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: palette.cardShadowOpacity + 0.08,
            shadowRadius: 8,
            elevation: 8,
          }}
          className="rounded-2xl py-4"
        >
          <View className="flex-row items-center justify-center gap-2">
            <MaterialIcons
              name="play-arrow"
              size={20}
              color={palette.switchThumb}
            />
            <Text
              className="text-base font-bold"
              style={{ color: palette.switchThumb }}
            >
              {t("start_exam")}
            </Text>
          </View>
        </ScalePressable>
      </View>
    </SafeAreaView>
  );
}
