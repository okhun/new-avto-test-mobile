import React from "react";
import { View } from "react-native";

function ShimmerBlock({
  className,
  style,
}: {
  className?: string;
  style?: object;
}) {
  return (
    <View
      className={`rounded-lg bg-slate-200 ${className ?? ""}`}
      style={style}
    />
  );
}

export function ExamResultSkeleton() {
  return (
    <View className="flex-1 bg-slate-50">
      <View className="border-b border-slate-200 bg-white px-4 pb-4 pt-12">
        <ShimmerBlock className="mb-4 h-8 w-8 rounded-full" />
        <ShimmerBlock className="mb-2 h-7 w-3/5" />
        <ShimmerBlock className="h-4 w-24" />
        <View className="mt-4 flex-row gap-2">
          <ShimmerBlock className="h-16 flex-1" />
          <ShimmerBlock className="h-16 flex-1" />
        </View>
        <ShimmerBlock className="mt-4 h-2 w-full" />
      </View>
      <View className="p-4">
        <ShimmerBlock className="mb-4 h-40 w-full rounded-2xl" />
        <ShimmerBlock className="mb-2 h-6 w-full" />
        <ShimmerBlock className="mb-4 h-6" style={{ width: "80%" }} />
        {[1, 2, 3, 4].map((k) => (
          <ShimmerBlock key={k} className="mb-2 h-14 w-full rounded-xl" />
        ))}
      </View>
    </View>
  );
}
