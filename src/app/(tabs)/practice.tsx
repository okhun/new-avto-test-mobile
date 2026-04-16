import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#137fec";
const BACKGROUND_LIGHT = "#f4f5f7";
const SUCCESS = "#2ecc71";
const ERROR = "#e74c3c";
const INFO = "#3498db";
const TEXT_DARK = "#0f172a";
const CARD_BG = "#ffffff";
const springConfig = { damping: 15, stiffness: 400 };

function ScalePressable({
  children,
  onPress,
  className,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  style?: object;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.98, springConfig);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, springConfig);
      }}
      className={className}
      style={style}
    >
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Pressable>
  );
}

const FILTERS = [
  { id: "all", label: "All Tickets" },
  { id: "new", label: "New" },
  { id: "passed", label: "Passed" },
  { id: "failed", label: "Failed" },
] as const;

type TicketStatus = "passed" | "failed" | "new" | "locked";

const TICKETS: Array<{
  id: string;
  title: string;
  status: TicketStatus;
  score?: string;
  subtitle?: string;
}> = [
  { id: "1", title: "Ticket 01", status: "passed", score: "Score: 10/10" },
  { id: "2", title: "Ticket 02", status: "failed", score: "Score: 6/10" },
  { id: "3", title: "Ticket 03", status: "new", subtitle: "New" },
  { id: "4", title: "Ticket 04", status: "locked", subtitle: "Locked" },
  { id: "5", title: "Ticket 05", status: "passed", score: "Score: 9/10" },
  { id: "6", title: "Ticket 06", status: "new", subtitle: "New" },
];

export default function PracticeTabScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardGap = 16;
  const padding = 16;
  const cardWidth = (width - padding * 2 - cardGap) / 2;

  const [activeFilter, setActiveFilter] =
    useState<(typeof FILTERS)[number]["id"]>("all");

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: BACKGROUND_LIGHT }}
      edges={["top"]}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-4">
        <View className="flex-row flex-1 items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            className="active:opacity-50"
            hitSlop={12}
          >
            <MaterialIcons name="arrow-back-ios" size={20} color={TEXT_DARK} />
          </Pressable>
          <Text
            className="text-xl font-bold tracking-tight"
            style={{ color: TEXT_DARK }}
          >
            Practice Tickets
          </Text>
        </View>
        <View className="flex-row gap-1">
          <Pressable className="rounded-full p-2 active:bg-slate-200">
            <MaterialIcons name="insert-chart" size={22} color={TEXT_DARK} />
          </Pressable>
          <Pressable className="rounded-full p-2 active:bg-slate-200">
            <MaterialIcons name="settings" size={22} color={TEXT_DARK} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        <View className="flex-row gap-3 px-4 py-4">
          <View
            className="flex-1 flex-col gap-1 rounded-2xl border border-slate-100 p-4 shadow-sm"
            style={{ backgroundColor: CARD_BG }}
          >
            <View className="mb-1 flex-row items-center justify-between">
              <MaterialIcons name="check-circle" size={20} color={SUCCESS} />
            </View>
            <Text
              className="text-2xl font-bold leading-tight"
              style={{ color: TEXT_DARK }}
            >
              12
            </Text>
            <Text className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Passed
            </Text>
          </View>
          <View
            className="flex-1 flex-col gap-1 rounded-2xl border border-slate-100 p-4 shadow-sm"
            style={{ backgroundColor: CARD_BG }}
          >
            <View className="mb-1 flex-row items-center justify-between">
              <MaterialIcons name="cancel" size={20} color={ERROR} />
            </View>
            <Text
              className="text-2xl font-bold leading-tight"
              style={{ color: TEXT_DARK }}
            >
              3
            </Text>
            <Text className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Failed
            </Text>
          </View>
          <View
            className="flex-1 flex-col gap-1 rounded-2xl border border-slate-100 p-4 shadow-sm"
            style={{ backgroundColor: CARD_BG }}
          >
            <View className="mb-1 flex-row items-center justify-between">
              <MaterialIcons name="schedule" size={20} color={INFO} />
            </View>
            <Text
              className="text-2xl font-bold leading-tight"
              style={{ color: TEXT_DARK }}
            >
              5
            </Text>
            <Text className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Left
            </Text>
          </View>
        </View>

        {/* Filter pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            flexDirection: "row",
            gap: 8,
          }}
        >
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.id;
            return (
              <Pressable
                key={f.id}
                onPress={() => setActiveFilter(f.id)}
                style={{
                  height: 36,
                  paddingHorizontal: 20,
                  borderRadius: 9999,
                  borderWidth: 1,
                  backgroundColor: isActive ? PRIMARY : CARD_BG,
                  borderColor: isActive ? PRIMARY : "#e2e8f0",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: f.id !== FILTERS[FILTERS.length - 1].id ? 8 : 0,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: isActive ? "#ffffff" : "#475569",
                    fontWeight: isActive ? "600" : "500",
                  }}
                >
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Ticket grid */}
        <View className="flex-row flex-wrap px-4 pb-4" style={{ gap: cardGap }}>
          {TICKETS?.map((ticket, index) => (
            <TicketCard
              key={index}
              ticket={ticket}
              width={cardWidth}
              onPress={() =>
                router.push({
                  pathname: "/ticket-exam",
                  params: { ticketId: index + 1 },
                })
              }
            />
          ))}
        </View>
      </ScrollView>

      {/* Start Random Exam - fixed at bottom above tab bar */}
      <View className="absolute bottom-0 left-0 right-0 px-6 pb-24 pt-2">
        <ScalePressable
          onPress={() => {}}
          style={{
            backgroundColor: PRIMARY,
            shadowColor: PRIMARY,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
          className=" rounded-2xl py-4"
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

function TicketCard({
  ticket,
  width,
  onPress,
}: {
  ticket: (typeof TICKETS)[number];
  width: number;
  onPress: () => void;
}) {
  const isLocked = ticket.status === "locked";

  const statusIcon = () => {
    switch (ticket.status) {
      case "passed":
        return <MaterialIcons name="check-circle" size={18} color={SUCCESS} />;
      case "failed":
        return <MaterialIcons name="cancel" size={18} color={ERROR} />;
      case "new":
        return <MaterialIcons name="play-circle" size={18} color={INFO} />;
      case "locked":
        return <MaterialIcons name="lock" size={18} color="#94a3b8" />;
    }
  };

  const leftIcon = () => {
    if (ticket.status === "locked") {
      return (
        <View className="mb-3 h-10 w-10 items-center justify-center rounded-xl bg-slate-200">
          <MaterialIcons name="lock" size={22} color="#64748b" />
        </View>
      );
    }
    if (ticket.status === "passed") {
      return (
        <View
          className="mb-3 h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${SUCCESS}1A` }}
        >
          <MaterialIcons name="description" size={22} color={SUCCESS} />
        </View>
      );
    }
    if (ticket.status === "failed") {
      return (
        <View
          className="mb-3 h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${ERROR}1A` }}
        >
          <MaterialIcons name="assignment-late" size={22} color={ERROR} />
        </View>
      );
    }
    return (
      <View
        className="mb-3 h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${INFO}1A` }}
      >
        <MaterialIcons name="play-arrow" size={22} color={INFO} />
      </View>
    );
  };

  const scoreColor = () => {
    switch (ticket.status) {
      case "passed":
        return SUCCESS;
      case "failed":
        return ERROR;
      case "new":
        return INFO;
      default:
        return "#94a3b8";
    }
  };

  const cardStyle = {
    width,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    ...(isLocked
      ? {
          backgroundColor: "rgba(241, 245, 249, 0.5)",
          borderColor: "#f1f5f9",
        }
      : {
          backgroundColor: CARD_BG,
          borderColor: "#f1f5f9",
        }),
  };

  return (
    <ScalePressable onPress={isLocked ? undefined : onPress} style={cardStyle}>
      <View style={{ opacity: isLocked ? 0.8 : 1 }}>
        <View className="absolute right-0 top-3">{statusIcon()}</View>
        {leftIcon()}
        <Text
          className="text-base font-bold"
          style={{ color: isLocked ? "#64748b" : TEXT_DARK }}
          numberOfLines={1}
        >
          {ticket.title}
        </Text>
        <Text
          className="text-[11px] font-medium text-slate-400"
          numberOfLines={1}
        >
          10 Qs • 15 min
        </Text>
        {(ticket.score ?? ticket.subtitle) && (
          <Text
            className="mt-2 text-[12px] font-bold"
            style={{ color: isLocked ? "#94a3b8" : scoreColor() }}
          >
            {ticket.score ?? ticket.subtitle}
          </Text>
        )}
      </View>
    </ScalePressable>
  );
}
