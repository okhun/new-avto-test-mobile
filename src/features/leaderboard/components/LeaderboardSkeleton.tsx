import React from "react";
import { View } from "react-native";

function Line({ w, h = 12 }: { w: `${number}%` | number; h?: number }) {
  return (
    <View
      className="overflow-hidden rounded-md bg-slate-200/90"
      style={{ width: w, height: h }}
    />
  );
}

function PodiumBlock({ tall }: { tall: boolean }) {
  return (
    <View className="items-center" style={{ width: "31%", maxWidth: 128 }}>
      <View
        className="rounded-full bg-slate-200/90"
        style={{
          width: tall ? 72 : 56,
          height: tall ? 72 : 56,
        }}
      />
      <View
        className="mt-2 w-full rounded-2xl bg-white px-2 pb-3 pt-10"
        style={{
          minHeight: tall ? 140 : 110,
          shadowColor: "#0f172a",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 2,
          elevation: 1,
        }}
      >
        <Line w="80%" h={10} />
        <View className="mt-2">
          <Line w="50%" h={9} />
        </View>
      </View>
    </View>
  );
}

export function LeaderboardSkeleton() {
  return (
    <View className="px-4">
      <View className="mb-1 flex-row items-end justify-center gap-1.5">
        <PodiumBlock tall={false} />
        <PodiumBlock tall={true} />
        <PodiumBlock tall={false} />
      </View>
      <View className="mt-3 gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <View
            key={i}
            className="flex-row items-center rounded-2xl bg-white px-3 py-3"
          >
            <Line w={20} h={16} />
            <View className="ml-2 h-12 w-12 rounded-full bg-slate-200/90" />
            <View className="ml-3 flex-1">
              <Line w="55%" h={12} />
              <View className="mt-2">
                <Line w="35%" h={9} />
              </View>
            </View>
            <View className="items-end">
              <Line w={36} h={14} />
              <View className="mt-1.5">
                <Line w={22} h={8} />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
