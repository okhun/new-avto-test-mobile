import { COLORS } from "@/src/features/practice/constants/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export type NavigatorItem = {
  order: number;
  isMistake: boolean;
  isAnswered: boolean;
};

type Props = {
  items: NavigatorItem[];
  mistakeCount: number;
  onSelectOrder: (order: number) => void;
};

export function MistakeNavigator({
  items,
  mistakeCount,
  onSelectOrder,
}: Props) {
  return (
    <View className="rounded-2xl border border-slate-200 bg-white p-4">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Savollar
        </Text>
        {mistakeCount > 0 ? (
          <View className="flex-row items-center gap-1">
            <MaterialIcons
              name="error-outline"
              size={16}
              color={COLORS.ERROR}
            />
            <Text className="text-xs font-semibold text-red-600">
              {mistakeCount} xato
            </Text>
          </View>
        ) : (
          <Text className="text-xs font-semibold text-emerald-600">
            Xatosiz
          </Text>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 4 }}
      >
        {items.map((it) => (
          <Pressable
            key={it.order}
            onPress={() => onSelectOrder(it.order)}
            className="h-10 min-w-[40px] items-center justify-center rounded-lg border px-2"
            style={{
              marginRight: 8,
              backgroundColor: it.isMistake
                ? "#fee2e2"
                : it.isAnswered
                  ? "#dcfce7"
                  : "#f1f5f9",
              borderColor: it.isMistake
                ? "#fecaca"
                : it.isAnswered
                  ? "#bbf7d0"
                  : "#e2e8f0",
            }}
          >
            <Text
              className="text-sm font-bold"
              style={{
                color: it.isMistake
                  ? "#b91c1c"
                  : it.isAnswered
                    ? "#166534"
                    : "#64748b",
              }}
            >
              {it.order}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View className="mt-4 flex-row flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-3">
        <LegendDot color="#22c55e" label="To'g'ri" />
        <LegendDot color="#ef4444" label="Xato" />
        <LegendDot color="#94a3b8" label="Javobsiz" />
      </View>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View className="flex-row items-center gap-1.5">
      <View
        className="h-2.5 w-2.5 rounded-sm"
        style={{ backgroundColor: color }}
      />
      <Text className="text-[10px] font-semibold text-slate-500">{label}</Text>
    </View>
  );
}
