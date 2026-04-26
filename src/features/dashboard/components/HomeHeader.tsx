import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  displayName?: string;
};

const TEXT = "#0f172a";

export function HomeHeader({ displayName }: Props) {
  const name = displayName?.trim() || "Foydalanuvchi";

  return (
    <View className="flex-row items-center justify-between px-5 pb-2 pt-1">
      <View className="min-w-0 flex-1 pr-2">
        <Text className="text-sm font-medium text-slate-500">
          Xush kelibsiz,
        </Text>
        <Text
          className="mt-0.5 text-2xl font-extrabold tracking-tight"
          style={{ color: TEXT }}
          numberOfLines={1}
        >
          {name} 👋
        </Text>
      </View>
      <Pressable
        className="h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-white"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
        }}
        hitSlop={8}
      >
        <MaterialIcons name="notifications-none" size={26} color="#1e293b" />
      </Pressable>
    </View>
  );
}
