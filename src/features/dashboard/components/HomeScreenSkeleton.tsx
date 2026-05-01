import { useTheme } from "@/src/theme";
import React from "react";
import { View } from "react-native";

export function HomeScreenSkeleton() {
  const { palette } = useTheme();
  const block = { backgroundColor: palette.divider };
  return (
    <View
      className="flex-1 px-5 pt-3"
      style={{ backgroundColor: palette.background }}
    >
      <View className="mb-4 flex-row justify-between">
        <View className="flex-1">
          <View className="mb-2 h-3 w-24 rounded" style={block} />
          <View className="h-7 w-40 rounded-lg" style={block} />
        </View>
        <View className="h-12 w-12 rounded-2xl" style={block} />
      </View>
      <View
        className="mb-3 rounded-[28px] p-2"
        style={{ minHeight: 200, ...block }}
      />
      <View className="mb-2 flex-row gap-2">
        <View className="h-24 flex-1 rounded-2xl" style={block} />
        <View className="h-24 flex-1 rounded-2xl" style={block} />
        <View className="h-24 flex-1 rounded-2xl" style={block} />
      </View>
      <View className="mb-1 mt-4 h-5 w-28 rounded" style={block} />
      <View className="h-20 rounded-2xl" style={block} />
      <View className="mb-1 mt-6 h-5 w-40 rounded" style={block} />
      <View className="h-20 rounded-2xl" style={block} />
    </View>
  );
}
