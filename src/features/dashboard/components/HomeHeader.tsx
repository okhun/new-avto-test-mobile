import { resolveAvatarUrl } from "@/src/features/auth/utils/avatarUrl";
import { useTheme } from "@/src/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, Text, View } from "react-native";

const AVATAR_PLACEHOLDER_BG = "#2c3e50";

type Props = {
  /** Driving / gamification level (shown as subtitle). */
  level: number;
  avatarUrl?: string | null;
};

export function HomeHeader({ level, avatarUrl }: Props) {
  const { palette, isDark } = useTheme();
  const router = useRouter();
  const avatarUri = resolveAvatarUrl(avatarUrl);
  const { t } = useTranslation();
  const levelSafe = Number.isFinite(level) && level > 0 ? level : 1;
  // const topAccent = `${palette.primary}55`;

  return (
    <View
      pointerEvents="box-none"
      style={{
        backgroundColor: palette.card,
        // borderTopLeftRadius: 22,
        // borderTopRightRadius: 22,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 18,
        // borderTopWidth: 1,
        // borderTopColor: topAccent,
        shadowColor: palette.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: palette.cardShadowOpacity + 0.04,
        // shadowRadius: 8,
        // elevation: 3,
        zIndex: 20,
      }}
    >
      <View className="flex-row items-center justify-between">
        <Pressable
          onPress={() => router.push("/(tabs)/profile")}
          className="min-w-0 flex-1 flex-row items-center gap-3 active:opacity-85"
          hitSlop={4}
          accessibilityRole="button"
          accessibilityLabel={t("profile")}
        >
          <View
            className="items-center justify-center overflow-hidden rounded-full"
            style={{
              width: 52,
              height: 52,
              backgroundColor: AVATAR_PLACEHOLDER_BG,
              borderWidth: 2,
              borderColor: isDark ? `${palette.primary}44` : "#e8eef5",
            }}
          >
            {avatarUri ? (
              <Image
                source={{ uri: avatarUri }}
                style={{ width: 52, height: 52 }}
                resizeMode="cover"
              />
            ) : (
              <MaterialIcons name="person" size={28} color="#ffffff" />
            )}
          </View>
          <View className="min-w-0 flex-1 gap-1">
            <Text
              className="text-2xl font-extrabold tracking-tight"
              style={{ color: palette.foreground }}
            >
              {t("home_header_greeting")}
            </Text>
            <Text
              className="text-[11px] font-semibold tracking-wide"
              style={{ color: palette.muted }}
              numberOfLines={1}
            >
              {t("home_header_level_driver", { level: levelSafe })}
            </Text>
          </View>
        </Pressable>

        <Pressable
          hitSlop={12}
          className="shrink-0 p-2"
          accessibilityRole="button"
          accessibilityLabel={t("push_notifications")}
          onPress={() => {
            /* future: notifications */
          }}
        >
          <Ionicons name="notifications" size={26} color={palette.primary} />
        </Pressable>
      </View>
    </View>
  );
}
