import React from "react";
import { Pressable, Text, View } from "react-native";
import { LeaderboardType } from "../types/leaderboard.types";

const PRIMARY = "#137fec";

const TABS: { type: LeaderboardType; label: string }[] = [
  { type: LeaderboardType.WEEKLY, label: "Hafta" },
  { type: LeaderboardType.MONTHLY, label: "Oy" },
  { type: LeaderboardType.ALL_TIME, label: "Butun vaqt" },
];

type Props = {
  value: LeaderboardType;
  onChange: (t: LeaderboardType) => void;
};

export function LeaderboardFilterTabs({ value, onChange }: Props) {
  return (
    <View className="px-4 pb-3">
      <View className="flex-row rounded-2xl bg-slate-200/90 p-1">
        {TABS.map((tab) => {
          const active = value === tab.type;
          return (
            <Pressable
              key={tab.type}
              onPress={() => onChange(tab.type)}
              className="min-w-0 flex-1 items-center justify-center rounded-xl py-2.5"
              style={
                active
                  ? {
                      backgroundColor: "#ffffff",
                      shadowColor: "#0f172a",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.08,
                      shadowRadius: 3,
                      elevation: 2,
                    }
                  : undefined
              }
            >
              <Text
                className="text-center text-xs font-extrabold"
                numberOfLines={1}
                style={{ color: active ? PRIMARY : "#64748b" }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
