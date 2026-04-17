import { ScalePressable } from "@/src/components/ui/ScalePressable";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
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

const PRIMARY = "#137fec";
const BACKGROUND_LIGHT = "#f4f5f7";
const SUCCESS = "#2ecc71";
const ERROR = "#e74c3c";
const INFO = "#3498db";
const WARNING = "#f59e0b";
const TEXT_DARK = "#0f172a";
const CARD_BG = "#ffffff";

type FilterId = "all" | TicketStatus;

const FILTERS: ReadonlyArray<{ id: FilterId; label: string }> = [
  { id: "all", label: "All" },
  { id: "unattempted", label: "New" },
  { id: "in_progress", label: "In Progress" },
  { id: "passed", label: "Passed" },
  { id: "failed", label: "Failed" },
];

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
    label: "Passed",
  },
  failed: {
    color: ERROR,
    badgeIcon: "cancel",
    cardIcon: "assignment-late",
    label: "Failed",
  },
  in_progress: {
    color: WARNING,
    badgeIcon: "timelapse",
    cardIcon: "edit-note",
    label: "In Progress",
  },
  unattempted: {
    color: INFO,
    badgeIcon: "radio-button-unchecked",
    cardIcon: "play-arrow",
    label: "Not Started",
  },
};

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
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-center rounded-full border"
      style={{
        height: 36,
        paddingHorizontal: 16,
        backgroundColor: isActive ? PRIMARY : CARD_BG,
        borderColor: isActive ? PRIMARY : "#e2e8f0",
        gap: 6,
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
      <View
        className="items-center justify-center rounded-full"
        style={{
          minWidth: 20,
          height: 20,
          paddingHorizontal: 5,
          backgroundColor: isActive ? "rgba(255,255,255,0.25)" : "#f1f5f9",
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: isActive ? "#ffffff" : "#94a3b8",
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
  return (
    <View className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
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
  const meta = STATUS_META[ticket.status];
  const progress =
    ticket.totalQuestions > 0
      ? ticket.answeredQuestions / ticket.totalQuestions
      : 0;

  const scoreLabel = () => {
    switch (ticket.status) {
      case "passed":
      case "failed":
        return `${ticket.answeredQuestions}/${ticket.totalQuestions} correct`;
      case "in_progress":
        return `${ticket.answeredQuestions}/${ticket.totalQuestions} answered`;
      default:
        return `${ticket.totalQuestions} questions`;
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
        backgroundColor: CARD_BG,
        borderColor: "#f1f5f9",
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
          style={{ color: TEXT_DARK }}
          numberOfLines={1}
        >
          {formatTicketNumber(ticket.ticketNumber)}
        </Text>

        <Text
          className="mt-0.5 text-[11px] font-medium text-slate-400"
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

function EmptyState({ filterLabel }: { filterLabel: string }) {
  return (
    <View className="items-center justify-center px-8 py-16">
      <MaterialIcons name="inbox" size={48} color="#cbd5e1" />
      <Text className="mt-3 text-center text-base font-semibold text-slate-400">
        No {filterLabel.toLowerCase()} tickets
      </Text>
      <Text className="mt-1 text-center text-xs text-slate-400">
        Try selecting a different filter
      </Text>
    </View>
  );
}

// --- Main screen ---

export default function TicketsListScreen() {
  const { data: ticketsHistory, isLoading, refetch } = useGetTicketsHistory();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );
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
        style={{ flex: 1, backgroundColor: BACKGROUND_LIGHT }}
        edges={["top"]}
      >
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={PRIMARY} />
          <Text className="mt-3 text-sm font-medium text-slate-400">
            Loading tickets…
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: BACKGROUND_LIGHT }}
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
            label="Passed"
          />
          <StatCard
            icon="cancel"
            iconColor={ERROR}
            value={stats.failed}
            label="Failed"
          />
          <StatCard
            icon="schedule"
            iconColor={INFO}
            value={stats.remaining}
            label="Remaining"
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
          <EmptyState filterLabel={activeFilterLabel} />
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
              pathname: "/ticket-exam",
              params: { ticketId: "random" },
            })
          }
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
            <MaterialIcons name="bolt" size={20} color="#ffffff" />
            <Text className="text-base font-bold text-white">
              Start Random Exam
            </Text>
          </View>
        </ScalePressable>
      </View>
    </SafeAreaView>
  );
}
