import React from "react";
import { Pressable, Text, View } from "react-native";
import { BADGES_PRIMARY } from "../utils/badgeUi";

export type BadgeFilter = "all" | "unlocked" | "locked";

const TABS: { id: BadgeFilter; label: string }[] = [
  { id: "all", label: "Hamma" },
  { id: "unlocked", label: "Ochilgan" },
  { id: "locked", label: "Qulflangan" },
];

type Props = {
  value: BadgeFilter;
  onChange: (v: BadgeFilter) => void;
};

export function BadgesFilterTabs({ value, onChange }: Props) {
  return (
    <View className="mb-2 flex-row gap-2 px-4">
      {TABS.map((tab) => {
        const active = value === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onChange(tab.id)}
            className="min-w-0 flex-1 items-center justify-center rounded-2xl py-2.5"
            style={
              active
                ? { backgroundColor: BADGES_PRIMARY }
                : { backgroundColor: "#e2e8f0" }
            }
          >
            <Text
              className="text-center text-xs font-extrabold"
              numberOfLines={1}
              style={{ color: active ? "#ffffff" : "#64748b" }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
