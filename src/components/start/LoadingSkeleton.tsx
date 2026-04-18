import { Pulse } from "@/src/components/ui/Pulse";
import {
  COLORS,
  QUESTION_BTN_SIZE,
  SCREEN_WIDTH,
} from "@/src/features/practice/constants/theme";
import React from "react";
import { View } from "react-native";

export function LoadingSkeleton() {
  const imgH = (SCREEN_WIDTH - 32) * (9 / 16);

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.BG }}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pulse w={40} h={40} r={20} />
        <Pulse w={120} h={24} />
        <Pulse w={40} h={40} r={20} />
      </View>
      <View className="gap-2 px-4 pb-4 pt-2">
        <View className="flex-row justify-between">
          <Pulse w={120} h={14} />
          <Pulse w={40} h={14} />
        </View>
        <Pulse w={"100%"} h={8} r={4} />
      </View>
      <View className="flex-row gap-2 px-4 py-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Pulse
            key={i}
            w={QUESTION_BTN_SIZE}
            h={QUESTION_BTN_SIZE}
            r={QUESTION_BTN_SIZE / 2}
          />
        ))}
      </View>
      <View className="px-4 pt-2">
        <Pulse w={"100%"} h={imgH} r={12} />
      </View>
      <View className="gap-2 px-4 pt-4">
        <Pulse w={"90%"} h={22} />
        <Pulse w={"70%"} h={22} />
        <Pulse w={"50%"} h={16} style={{ marginTop: 4 }} />
      </View>
      <View className="gap-3 px-4 pt-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Pulse key={i} w={"100%"} h={60} r={12} />
        ))}
      </View>
    </View>
  );
}
