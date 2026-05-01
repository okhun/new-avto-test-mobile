import { resolveAvatarUrl } from "@/src/features/auth/utils/avatarUrl";
import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, Text, View } from "react-native";

type Props = {
  displayName?: string;
  avatarUrl?: string | null;
};

export function HomeHeader({ displayName, avatarUrl }: Props) {
  const { palette } = useTheme();
  const router = useRouter();
  const name = displayName?.trim() || "Foydalanuvchi";
  const avatarUri = resolveAvatarUrl(avatarUrl);
  const { t } = useTranslation();
  const iconSurface = {
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: palette.cardShadowOpacity,
    shadowRadius: 8,
    elevation: 2,
  };
  return (
    <View className="flex-row items-center justify-between px-5 pb-2 pt-1">
      <View className="min-w-0 flex-1 pr-2">
        <Text className="text-sm font-medium" style={{ color: palette.muted }}>
          {t("welcome")},
        </Text>
        <Text
          className="mt-0.5 text-2xl font-extrabold tracking-tight"
          style={{ color: palette.foreground }}
          numberOfLines={1}
        >
          {name} 👋
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        <Pressable
          className="h-11 w-11 items-center justify-center rounded-2xl border"
          style={{
            ...iconSurface,
            borderColor: palette.border,
            backgroundColor: palette.card,
            shadowOpacity: palette.cardShadowOpacity,
          }}
          hitSlop={8}
        >
          <MaterialIcons
            name="notifications-none"
            size={24}
            color={palette.foreground}
          />
        </Pressable>

        <Pressable
          onPress={() => router.push("/(tabs)/profile")}
          className="h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border"
          style={{
            ...iconSurface,
            borderColor: palette.border,
            backgroundColor: palette.card,
            shadowOpacity: palette.cardShadowOpacity + 0.03,
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
            <View
              className="h-full w-full items-center justify-center"
              style={{ backgroundColor: palette.iconSurface }}
            >
              <MaterialIcons name="person" size={22} color={palette.muted} />
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}
