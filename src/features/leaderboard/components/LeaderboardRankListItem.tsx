import { resolveAvatarUrl } from "@/src/features/auth/utils/avatarUrl";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Image, Text, View } from "react-native";
import type { LeaderboardEntry } from "../types/leaderboard.types";
import {
  formatLeaderboardXp,
  getLeaderboardLevelSubtitle,
} from "../utils/leaderboardUi";

const PRIMARY = "#137fec";

type Props = {
  entry: LeaderboardEntry;
};

export function LeaderboardRankListItem({ entry }: Props) {
  const uri = resolveAvatarUrl(entry.avatarUrl);
  const subtitle = getLeaderboardLevelSubtitle(entry.level);
  const xp = formatLeaderboardXp(entry.totalXp);

  return (
    <View
      className="mb-2 flex-row items-center rounded-2xl bg-white px-3 py-3"
      style={{
        shadowColor: "#0f172a",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
      }}
    >
      <Text
        className="w-8 text-center text-base font-extrabold"
        style={{ color: `${PRIMARY}cc` }}
      >
        {entry.rank}
      </Text>
      <View className="ml-1 h-12 w-12 overflow-hidden rounded-full bg-slate-100">
        {uri ? (
          <Image
            source={{ uri }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View className="h-full w-full items-center justify-center">
            <MaterialIcons name="person" size={26} color="#94a3b8" />
          </View>
        )}
      </View>
      <View className="min-w-0 flex-1 pl-3">
        <Text
          className="text-sm font-extrabold text-slate-900"
          numberOfLines={1}
        >
          {entry.displayName?.trim() || "Foydalanuvchi"}
        </Text>
        <Text
          className="mt-0.5 text-xs font-medium text-slate-500"
          numberOfLines={1}
        >
          {subtitle}
        </Text>
      </View>
      <View className="items-end pl-1">
        <Text
          className="text-sm font-extrabold text-slate-900"
          numberOfLines={1}
        >
          {xp}
        </Text>
        <Text className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          XP
        </Text>
      </View>
    </View>
  );
}
