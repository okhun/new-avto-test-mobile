import React from "react";
import { View } from "react-native";

export function HomeScreenSkeleton() {
  return (
    <View className="flex-1 bg-slate-50 px-5 pt-3">
      <View className="mb-4 flex-row justify-between">
        <View className="flex-1">
          <View className="mb-2 h-3 w-24 rounded bg-slate-200" />
          <View className="h-7 w-40 rounded-lg bg-slate-200" />
        </View>
        <View className="h-12 w-12 rounded-2xl bg-slate-200" />
      </View>
      <View
        className="mb-3 rounded-[28px] bg-slate-200 p-2"
        style={{ minHeight: 200 }}
      />
      <View className="mb-2 flex-row gap-2">
        <View className="h-24 flex-1 rounded-2xl bg-slate-200" />
        <View className="h-24 flex-1 rounded-2xl bg-slate-200" />
        <View className="h-24 flex-1 rounded-2xl bg-slate-200" />
      </View>
      <View className="mb-1 mt-4 h-5 w-28 rounded bg-slate-200" />
      <View className="h-20 rounded-2xl bg-slate-200" />
      <View className="mb-1 mt-6 h-5 w-40 rounded bg-slate-200" />
      <View className="h-20 rounded-2xl bg-slate-200" />
    </View>
  );
}
