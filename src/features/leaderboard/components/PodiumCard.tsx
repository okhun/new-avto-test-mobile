import { resolveAvatarUrl } from "@/src/features/auth/utils/avatarUrl";
import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Image, Text, View } from "react-native";

import type { LeaderboardEntry } from "../types/leaderboard.types";
import { formatLeaderboardXp } from "../utils/leaderboardUi";

const GOLD_LIGHT = "#d97706";
const GOLD_DARK = "#fbbf24";

const BADGE_LIGHT: Record<
  1 | 2 | 3,
  { text: string; bg: string; textColor: string }
> = {
  1: { text: "G\u0027olib", bg: "#fef08a", textColor: "#a16207" },
  2: { text: "2-orin", bg: "#e2e8f0", textColor: "#475569" },
  3: { text: "3-orin", bg: "#fed7aa", textColor: "#9a3412" },
};

const BADGE_DARK: Record<
  1 | 2 | 3,
  { text: string; bg: string; textColor: string }
> = {
  1: {
    text: "G\u0027olib",
    bg: "rgba(234, 179, 8)",
    textColor: "#fde047",
  },
  2: {
    text: "2-orin",
    bg: "rgba(148, 163, 184)",
    textColor: "#e2e8f0",
  },
  3: {
    text: "3-orin",
    bg: "rgba(249, 115, 22)",
    textColor: "#fdba74",
  },
};

const RING: Record<1 | 2 | 3, string> = {
  1: "#facc15",
  2: "#94a3b8",
  3: "#d97706",
};

type Props = {
  place: 1 | 2 | 3;
  entry: LeaderboardEntry | undefined;
  cardMinHeight: number;
  avatarSize: number;
  showTrophy?: boolean;
};

export function PodiumCard({
  place,
  entry,
  cardMinHeight,
  avatarSize,
  showTrophy = false,
}: Props) {
  const { palette, isDark } = useTheme();
  const BADGE = isDark ? BADGE_DARK : BADGE_LIGHT;
  const badge = BADGE[place];
  const ring = RING[place];
  const uri = entry ? resolveAvatarUrl(entry.avatarUrl) : undefined;
  const name = entry?.displayName?.trim() || "—";
  const xp = entry != null ? formatLeaderboardXp(entry.totalXp) : "—";

  const xpColor =
    place === 1 ? (isDark ? GOLD_DARK : GOLD_LIGHT) : palette.muted;

  return (
    <View className="items-center" style={{ width: "31%", maxWidth: 128 }}>
      {showTrophy && place === 1 ? (
        <View className="mb-1 items-center">
          <MaterialIcons name="emoji-events" size={32} color="#eab308" />
        </View>
      ) : (
        <View style={{ height: showTrophy ? 0 : 8 }} />
      )}

      <View className="items-center" style={{ marginBottom: -8, zIndex: 2 }}>
        <View
          className="items-center justify-center overflow-hidden rounded-full"
          style={{
            width: avatarSize,
            height: avatarSize,
            borderWidth: 3,
            borderColor: ring,
            backgroundColor: palette.iconSurface,
          }}
        >
          {uri ? (
            <Image
              source={{ uri }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <MaterialIcons
              name="person"
              size={avatarSize * 0.5}
              color={palette.muted}
            />
          )}
        </View>
        <View
          className="absolute -bottom-1 rounded-md px-1.5 py-0.5"
          style={{ backgroundColor: badge.bg }}
        >
          <Text
            className="text-[8px] font-extrabold"
            style={{ color: badge.textColor }}
            numberOfLines={1}
          >
            {badge.text}
          </Text>
        </View>
      </View>

      <View
        className="w-full items-center rounded-2xl px-2 pb-3 pt-10"
        style={{
          backgroundColor: palette.card,
          minHeight: cardMinHeight,
          shadowColor: palette.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: palette.cardShadowOpacity,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        <Text
          className="text-center text-xs font-extrabold"
          numberOfLines={1}
          style={{ color: palette.foreground }}
        >
          {name}
        </Text>
        <Text
          className="mt-0.5 text-center text-[11px] font-bold"
          numberOfLines={1}
          style={{ color: xpColor }}
        >
          {xp} XP
        </Text>
      </View>
    </View>
  );
}
