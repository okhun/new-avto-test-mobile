import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import type { WeakTopic } from "../types/dashboard.types";

type Props = {
  topics: WeakTopic[];
};

function topicLabel(t: WeakTopic, index: number): string {
  if (t == null || typeof t !== "object") return `Mavzu ${index + 1}`;
  const o = t as Record<string, unknown>;
  return (
    (typeof o.name === "string" && o.name) ||
    (typeof o.title === "string" && o.title) ||
    (typeof o.topicName === "string" && o.topicName) ||
    (typeof o.label === "string" && o.label) ||
    `Mavzu ${index + 1}`
  );
}

export function HomeWeakTopicsSection({ topics }: Props) {
  if (!topics.length) return null;

  return (
    <View className="mt-4 px-5">
      <View className="mb-2 flex-row items-center gap-2">
        <MaterialCommunityIcons
          name="trending-down"
          size={22}
          color="#ef4444"
        />
        <Text className="text-lg font-extrabold text-slate-900">
          Mustahkamlash kerak
        </Text>
      </View>
      <View className="flex-row flex-wrap gap-2">
        {topics.slice(0, 6).map((t, i) => (
          <View
            key={i}
            className="rounded-full border border-red-100 bg-red-50 px-3 py-1.5"
          >
            <Text className="text-xs font-semibold text-red-800">
              {topicLabel(t, i)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
