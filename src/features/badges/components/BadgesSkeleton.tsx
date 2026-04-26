import React from "react";
import { View } from "react-native";

function Box({ className = "" }: { className?: string }) {
  return <View className={`rounded-2xl bg-slate-200/90 ${className}`} />;
}

export function BadgesSkeleton() {
  return (
    <View className="px-4">
      <Box className="mb-4 h-40 w-full" />
      <View className="mb-3 flex-row gap-2">
        <Box className="h-10 flex-1" />
        <Box className="h-10 flex-1" />
        <Box className="h-10 flex-1" />
      </View>
      <View className="flex-row flex-wrap justify-between">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <View key={i} className="mb-3" style={{ width: "48%" }}>
            <Box className="h-48 w-full rounded-3xl" />
          </View>
        ))}
      </View>
    </View>
  );
}
