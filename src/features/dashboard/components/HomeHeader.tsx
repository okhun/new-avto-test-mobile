import { resolveAvatarUrl } from "@/src/features/auth/utils/avatarUrl";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, Text, View } from "react-native";

type Props = {
  displayName?: string;
  avatarUrl?: string | null;
};

const TEXT = "#0f172a";

export function HomeHeader({ displayName, avatarUrl }: Props) {
  const router = useRouter();
  const name = displayName?.trim() || "Foydalanuvchi";
  const avatarUri = resolveAvatarUrl(avatarUrl);
  const { t } = useTranslation();
  return (
    <View className="flex-row items-center justify-between px-5 pb-2 pt-1">
      <View className="min-w-0 flex-1 pr-2">
        <Text className="text-sm font-medium text-slate-500">
          {t("welcome")},
        </Text>
        <Text
          className="mt-0.5 text-2xl font-extrabold tracking-tight"
          style={{ color: TEXT }}
          numberOfLines={1}
        >
          {name} 👋
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        <Pressable
          className="h-11 w-11 items-center justify-center rounded-2xl border border-slate-100 bg-white"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}
          hitSlop={8}
        >
          <MaterialIcons name="notifications-none" size={24} color="#1e293b" />
        </Pressable>

        <Pressable
          onPress={() => router.push("/(tabs)/profile")}
          className="h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-white"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 10,
            elevation: 3,
          }}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Profilga o'tish"
        >
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              className="h-full w-full"
              resizeMode="cover"
            />
          ) : (
            <View className="h-full w-full items-center justify-center bg-slate-100">
              <MaterialIcons name="person" size={22} color="#475569" />
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}
