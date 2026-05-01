import { ScalePressable } from "@/src/components/ui/ScalePressable";
import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetTicketsHistory } from "../hook/usePractice";
import type { TicketHistory, TicketStatus } from "../types/practice.types";

const SUCCESS = "#22c55e";
const ERROR = "#ef4444";
const INFO = "#3b82f6";
const WARNING = "#f59e0b";

type FilterId = "all" | TicketStatus;

function computeStats(tickets: TicketHistory[]) {
  let passed = 0;
  let failed = 0;
  let remaining = 0;
  for (const t of tickets) {
    if (t.status === "passed") passed++;
    else if (t.status === "failed") failed++;
    else remaining++;
  }
  return { passed, failed, remaining, total: tickets.length };
}

function formatTicketNumber(num: number): string {
  return `Ticket ${String(num).padStart(2, "0")}`;
}

// --- Stat card ---

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
  const { palette } = useTheme();
  return (
    <View
      className="flex-1 flex-col gap-1 rounded-2xl border p-4"
      style={{
        backgroundColor: palette.card,
        borderColor: palette.border,
      }}
    >
      <View className="mb-1">
        <MaterialIcons name={icon} size={20} color={iconColor} />
      </View>
      <Text
        className="text-2xl font-bold leading-tight"
        style={{ color: palette.foreground }}
      >
        {value}
      </Text>
      <Text
        className="text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: palette.muted }}
      >
        {label}
      </Text>
    </View>
  );
}

// --- Filter pill ---

function FilterPill({
  label,
  count,
  isActive,
  onPress,
}: {
  label: string;
  count: number;
  isActive: boolean;
  onPress: () => void;
}) {
  const { palette } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-center rounded-full border"
      style={{
        height: 36,
        paddingHorizontal: 16,
        backgroundColor: isActive ? palette.primary : palette.card,
        borderColor: isActive ? palette.primary : palette.border,
        gap: 6,
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
      <View
        className="items-center justify-center rounded-full"
        style={{
          minWidth: 20,
          height: 20,
          paddingHorizontal: 5,
          backgroundColor: isActive
            ? "rgba(255,255,255,0.25)"
            : palette.iconSurface,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: isActive ? palette.switchThumb : palette.chevron,
          }}
        >
          {count}
        </Text>
      </View>
    </Pressable>
  );
}

// --- Progress bar ---

function ProgressBar({ progress, color }: { progress: number; color: string }) {
  const { palette } = useTheme();
  return (
    <View
      className="mt-2 h-1.5 w-full overflow-hidden rounded-full"
      style={{ backgroundColor: palette.divider }}
    >
      <View
        className="h-full rounded-full"
        style={{
          width: `${Math.min(progress * 100, 100)}%`,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

// --- Ticket card ---

function TicketCard({
  ticket,
  width,
  onPress,
}: {
  ticket: TicketHistory;
  width: number;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const STATUS_META: Record<
    TicketStatus,
    {
      color: string;
      badgeIcon: keyof typeof MaterialIcons.glyphMap;
      cardIcon: keyof typeof MaterialIcons.glyphMap;
      label: string;
    }
  > = {
    passed: {
      color: SUCCESS,
      badgeIcon: "check-circle",
      cardIcon: "description",
      label: t("passed"),
    },
    failed: {
      color: ERROR,
      badgeIcon: "cancel",
      cardIcon: "assignment-late",
      label: t("failed"),
    },
    in_progress: {
      color: WARNING,
      badgeIcon: "timelapse",
      cardIcon: "edit-note",
      label: t("in_progress"),
    },
    unattempted: {
      color: INFO,
      badgeIcon: "radio-button-unchecked",
      cardIcon: "play-arrow",
      label: t("unattempted"),
    },
  };
  const meta = STATUS_META[ticket.status];
  const progress =
    ticket.totalQuestions > 0
      ? ticket.answeredQuestions / ticket.totalQuestions
      : 0;

  const scoreLabel = () => {
    switch (ticket.status) {
      case "passed":
      case "failed":
        return `${ticket.answeredQuestions}/${ticket.totalQuestions} ${t("correct")}`;
      case "in_progress":
        return `${ticket.answeredQuestions}/${ticket.totalQuestions} ${t("answered")}`;
      default:
        return `${ticket.totalQuestions} ${t("questions")}`;
    }
  };

  return (
    <ScalePressable
      onPress={onPress}
      style={{
        width,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        backgroundColor: palette.card,
        borderColor: palette.border,
      }}
    >
      <View>
        <View className="absolute right-0 top-0">
          <MaterialIcons name={meta.badgeIcon} size={18} color={meta.color} />
        </View>

        <View
          className="mb-3 h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${meta.color}1A` }}
        >
          <MaterialIcons name={meta.cardIcon} size={22} color={meta.color} />
        </View>

        <Text
          className="text-base font-bold"
          style={{ color: palette.foreground }}
          numberOfLines={1}
        >
          {t("ticket_number", { number: String(ticket.ticketNumber) })}
        </Text>

        <Text
          className="mt-0.5 text-[11px] font-medium"
          style={{ color: palette.muted }}
          numberOfLines={1}
        >
          {scoreLabel()}
        </Text>

        <ProgressBar progress={progress} color={meta.color} />

        <Text
          className="mt-2 text-[12px] font-bold"
          style={{ color: meta.color }}
        >
          {meta.label}
        </Text>
      </View>
    </ScalePressable>
  );
}

// --- Empty state ---

function EmptyState() {
  const { t } = useTranslation();
  const { palette } = useTheme();
  return (
    <View className="items-center justify-center px-8 py-16">
      <MaterialIcons name="inbox" size={48} color={palette.chevron} />
      <Text
        className="mt-3 text-center text-base font-semibold"
        style={{ color: palette.muted }}
      >
        {t("no_tests_found")}
      </Text>
      {/* <Text className="mt-1 text-center text-xs text-slate-400">
        {t("no_tests_found")}
      </Text> */}
    </View>
  );
}

// --- Main screen ---

export default function TicketsListScreen() {
  const { data: ticketsHistory, isLoading, refetch } = useGetTicketsHistory();
  const router = useRouter();
  const { t } = useTranslation();
  const { palette } = useTheme();
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );
  const FILTERS: ReadonlyArray<{ id: FilterId; label: string }> = [
    { id: "all", label: t("all_tests") },
    { id: "unattempted", label: t("unattempted") },
    { id: "in_progress", label: t("in_progress") },
    { id: "passed", label: t("passed") },
    { id: "failed", label: t("failed") },
  ];
  const { width } = useWindowDimensions();
  const cardGap = 16;
  const padding = 16;
  const cardWidth = (width - padding * 2 - cardGap) / 2;

  const [activeFilter, setActiveFilter] = useState<FilterId>("all");

  const tickets: TicketHistory[] = Array.isArray(ticketsHistory)
    ? ticketsHistory
    : [];

  const stats = useMemo(() => computeStats(tickets), [tickets]);

  const filterCounts = useMemo(() => {
    const counts: Record<FilterId, number> = {
      all: tickets.length,
      unattempted: 0,
      in_progress: 0,
      passed: 0,
      failed: 0,
    };
    for (const t of tickets) {
      counts[t.status]++;
    }
    return counts;
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    if (activeFilter === "all") return tickets;
    return tickets.filter((t) => t.status === activeFilter);
  }, [tickets, activeFilter]);

  const activeFilterLabel =
    FILTERS.find((f) => f.id === activeFilter)?.label ?? "All";

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: palette.background }}
        edges={["top"]}
      >
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={palette.primary} />
          <Text
            className="mt-3 text-sm font-medium"
            style={{ color: palette.muted }}
          >
            Loading tickets…
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: palette.background }}
      edges={["top"]}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        <View className="flex-row gap-3 px-4 py-4">
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
            icon="schedule"
            iconColor={INFO}
            value={stats.remaining}
            label={t("remaining")}
          />
        </View>

        {/* Filter pills */}
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
              count={filterCounts[f.id]}
              isActive={activeFilter === f.id}
              onPress={() => setActiveFilter(f.id)}
            />
          ))}
        </ScrollView>

        {/* Ticket grid */}
        {filteredTickets.length === 0 ? (
          <EmptyState />
        ) : (
          <View
            className="flex-row flex-wrap px-4 pb-4 pt-2"
            style={{ gap: cardGap }}
          >
            {filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.ticketId}
                ticket={ticket}
                width={cardWidth}
                onPress={() =>
                  router.push({
                    pathname: "/tickets/[id]",
                    params: {
                      id: ticket.ticketId,
                      ticketNumber: String(ticket.ticketNumber),
                    },
                  })
                }
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Start Random Exam */}
      <View className="absolute bottom-0 left-0 right-0 px-6 pb-24 pt-2">
        <ScalePressable
          onPress={() =>
            router.push({
              pathname: "/exams/start",
              params: { ticketId: "random" },
            })
          }
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
            <MaterialIcons name="bolt" size={20} color={palette.switchThumb} />
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
