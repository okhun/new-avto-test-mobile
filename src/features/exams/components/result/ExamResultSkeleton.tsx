import { useTheme } from "@/src/theme";
import React from "react";
import { View } from "react-native";

function ShimmerBlock({
  className,
  style,
  color,
}: {
  className?: string;
  style?: object;
  color: string;
}) {
  return (
    <View
      className={`rounded-lg ${className ?? ""}`}
      style={[{ backgroundColor: color }, style]}
    />
  );
}

export function ExamResultSkeleton() {
  const { palette } = useTheme();
  const b = palette.divider;

  return (
    <View className="flex-1" style={{ backgroundColor: palette.background }}>
      <View
        className="border-b px-4 pb-4 pt-12"
        style={{
          backgroundColor: palette.card,
          borderBottomColor: palette.divider,
        }}
      >
        <ShimmerBlock color={b} className="mb-4 h-8 w-8 rounded-full" />
        <ShimmerBlock color={b} className="mb-2 h-7 w-3/5" />
        <ShimmerBlock color={b} className="h-4 w-24" />
        <View className="mt-4 flex-row gap-2">
          <ShimmerBlock color={b} className="h-16 flex-1" />
          <ShimmerBlock color={b} className="h-16 flex-1" />
        </View>
        <ShimmerBlock color={b} className="mt-4 h-2 w-full" />
      </View>
      <View className="p-4">
        <ShimmerBlock color={b} className="mb-4 h-40 w-full rounded-2xl" />
        <ShimmerBlock color={b} className="mb-2 h-6 w-full" />
        <ShimmerBlock color={b} className="mb-4 h-6" style={{ width: "80%" }} />
        {[1, 2, 3, 4].map((k) => (
          <ShimmerBlock
            key={k}
            color={b}
            className="mb-2 h-14 w-full rounded-xl"
          />
        ))}
      </View>
    </View>
  );
}
