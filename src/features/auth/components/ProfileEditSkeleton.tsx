import React from "react";
import { View } from "react-native";

const BG = "#ffffff";

export function ProfileEditSkeleton() {
  return (
    <View className="px-6 pt-8" style={{ backgroundColor: BG }}>
      <View className="mb-8 items-center">
        <View className="mb-4 h-28 w-28 rounded-full bg-slate-200" />
        <View className="h-8 w-48 rounded-lg bg-slate-200" />
      </View>
      <View className="mb-3 h-4 w-40 rounded bg-slate-200" />
      <View className="mb-6 h-12 w-full rounded-xl bg-slate-200" />
      <View className="mb-3 h-4 w-32 rounded bg-slate-200" />
      <View className="mb-10 h-12 w-full rounded-xl bg-slate-200" />
      <View className="h-14 w-full rounded-full bg-slate-200" />
    </View>
  );
}
