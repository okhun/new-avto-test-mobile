import { resolveAvatarUrl } from "@/src/features/auth/utils/avatarUrl";
import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Image, Text, View } from "react-native";
import type { LeaderboardEntry } from "../types/leaderboard.types";
import {
  formatLeaderboardXp,
  getLeaderboardLevelSubtitle,
} from "../utils/leaderboardUi";

type Props = {
  entry: LeaderboardEntry;
};

export function LeaderboardRankListItem({ entry }: Props) {
  const { palette } = useTheme();
  const uri = resolveAvatarUrl(entry.avatarUrl);
  const subtitle = getLeaderboardLevelSubtitle(entry.level);
  const xp = formatLeaderboardXp(entry.totalXp);

  return (
    <View
      className="mb-2 flex-row items-center rounded-2xl px-3 py-3"
      style={{
        backgroundColor: palette.card,
        shadowColor: palette.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: palette.cardShadowOpacity,
        shadowRadius: 4,
        elevation: 1,
      }}
    >
      <Text
        className="w-8 text-center text-base font-extrabold"
        style={{ color: `${palette.primary}cc` }}
      >
        {entry.rank}
      </Text>
      <View
        className="ml-1 h-12 w-12 overflow-hidden rounded-full"
        style={{ backgroundColor: palette.iconSurface }}
      >
        {uri ? (
          <Image
            source={{ uri }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View className="h-full w-full items-center justify-center">
            <MaterialIcons name="person" size={26} color={palette.muted} />
          </View>
        )}
      </View>
      <View className="min-w-0 flex-1 pl-3">
        <Text
          className="text-sm font-extrabold"
          style={{ color: palette.foreground }}
          numberOfLines={1}
        >
          {entry.displayName?.trim() || "Foydalanuvchi"}
        </Text>
        <Text
          className="mt-0.5 text-xs font-medium"
          style={{ color: palette.muted }}
          numberOfLines={1}
        >
          {subtitle}
        </Text>
      </View>
      <View className="items-end pl-1">
        <Text
          className="text-sm font-extrabold"
          style={{ color: palette.foreground }}
          numberOfLines={1}
        >
          {xp}
        </Text>
        <Text
          className="text-[10px] font-bold uppercase tracking-wide"
          style={{ color: palette.chevron }}
        >
          XP
        </Text>
      </View>
    </View>
  );
}
