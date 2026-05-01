import { Pulse } from "@/src/components/ui/Pulse";
import { useTheme } from "@/src/theme";
import React from "react";
import { View } from "react-native";

function CardSkeleton({
  pulseColor,
  cardBg,
  borderColor,
}: {
  pulseColor: string;
  cardBg: string;
  borderColor: string;
}) {
  return (
    <View
      className="rounded-2xl border p-4"
      style={{
        backgroundColor: cardBg,
        borderColor,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Pulse w={64} h={24} r={8} color={pulseColor} />
          <Pulse w={80} h={14} r={6} color={pulseColor} />
        </View>
        <Pulse w={72} h={18} r={8} color={pulseColor} />
      </View>
      <View className="mt-3 flex-row items-end justify-between">
        <Pulse w={70} h={36} r={8} color={pulseColor} />
        <Pulse w={90} h={16} r={6} color={pulseColor} />
      </View>
      <View className="mt-2">
        <Pulse w={"100%"} h={6} r={3} color={pulseColor} />
      </View>
      <View className="mt-3 flex-row gap-4">
        <Pulse w={56} h={14} r={6} color={pulseColor} />
        <Pulse w={64} h={14} r={6} color={pulseColor} />
        <Pulse w={48} h={14} r={6} color={pulseColor} />
      </View>
    </View>
  );
}

export function ExamListSkeleton() {
  const { palette } = useTheme();

  return (
    <View className="gap-3 px-4 pt-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <CardSkeleton
          key={i}
          pulseColor={palette.divider}
          cardBg={palette.card}
          borderColor={palette.border}
        />
      ))}
    </View>
  );
}
