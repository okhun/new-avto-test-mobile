import { useTheme } from "@/src/theme";
import React from "react";
import { View } from "react-native";

export function NewTicketSkeleton() {
  const { palette } = useTheme();

  const Line = ({
    height,
    className = "",
  }: {
    height: number;
    className?: string;
  }) => (
    <View
      className={`rounded-xl ${className}`}
      style={{ height, width: "100%", backgroundColor: palette.divider }}
    />
  );

  return (
    <View className="px-4 pt-4" style={{ backgroundColor: palette.background }}>
      <Line height={48} className="mb-4" />
      <Line height={160} />
      <Line height={56} className="mt-6" />
    </View>
  );
}
