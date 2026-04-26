import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  title?: string;
};

export function LeaderboardHeader({ title = "Reyting" }: Props) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-center px-2 pb-3 pt-1">
      <Pressable
        onPress={() => router.back()}
        hitSlop={12}
        className="absolute left-2 h-10 w-10 items-center justify-center"
        accessibilityLabel="Orqaga"
      >
        <MaterialIcons name="chevron-left" size={28} color="#0f172a" />
      </Pressable>
      <Text className="text-center text-lg font-extrabold text-slate-900">
        {title}
      </Text>
    </View>
  );
}
