import React from "react";
import { View } from "react-native";
import type { LeaderboardEntry } from "../types/leaderboard.types";
import { PodiumCard } from "./PodiumCard";

type Props = {
  entries: LeaderboardEntry[];
};

/**
 * Renders 2nd – 1st – 3rd (left to right), with the center column tallest.
 */
export function PodiumSection({ entries }: Props) {
  const a = entries[0];
  const b = entries[1];
  const c = entries[2];

  return (
    <View className="items-end justify-center px-2 pb-2 pt-1">
      <View className="w-full flex-row items-end justify-center gap-1.5">
        <PodiumCard place={2} entry={b} cardMinHeight={112} avatarSize={56} />
        <PodiumCard
          place={1}
          entry={a}
          cardMinHeight={138}
          avatarSize={72}
          showTrophy
        />
        <PodiumCard place={3} entry={c} cardMinHeight={100} avatarSize={52} />
      </View>
    </View>
  );
}
