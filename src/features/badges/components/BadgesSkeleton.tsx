import React from "react";
import { View } from "react-native";

import { useTheme } from "@/src/theme";

function SkeletonBox({
  className = "",
  style,
}: {
  className?: string;
  style?: object;
}) {
  const { palette } = useTheme();
  return (
    <View
      className={`rounded-2xl ${className}`}
      style={[{ backgroundColor: palette.divider }, style]}
    />
  );
}

export function BadgesSkeleton() {
  return (
    <View className="px-4">
      <SkeletonBox className="mb-4 h-40 w-full" />
      <View className="mb-3 flex-row gap-2">
        <SkeletonBox className="h-10 flex-1" />
        <SkeletonBox className="h-10 flex-1" />
        <SkeletonBox className="h-10 flex-1" />
      </View>
      <View className="flex-row flex-wrap justify-between">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <View key={i} className="mb-3" style={{ width: "48%" }}>
            <SkeletonBox className="h-48 w-full rounded-3xl" />
          </View>
        ))}
      </View>
    </View>
  );
}
