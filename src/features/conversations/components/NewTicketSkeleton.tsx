import React from "react";
import { View } from "react-native";
import { CONV } from "../constants/theme";

export function NewTicketSkeleton() {
  return (
    <View className="px-4 pt-4" style={{ backgroundColor: CONV.BG }}>
      <View
        className="mb-4 h-12 rounded-xl bg-slate-200"
        style={{ width: "100%" }}
      />
      <View className="h-40 rounded-xl bg-slate-200" />
      <View className="mt-6 h-14 rounded-xl bg-slate-200" />
    </View>
  );
}
