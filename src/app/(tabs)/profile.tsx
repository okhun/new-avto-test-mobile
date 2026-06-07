import { LogoutConfirmModal } from "@/src/components/ui/LogoutConfirmModal";
import { resolveAvatarUrl } from "@/src/features/auth/utils/avatarUrl";
import { ProfileBadgesPreview } from "@/src/features/badges/components/ProfileBadgesPreview";
import { useMyRank } from "@/src/features/leaderboard/hook/useLeaderBoard";
import { formatRankDisplay } from "@/src/features/leaderboard/utils/leaderboardUi";
import { useAuthStore } from "@/src/store/auth.store";
import { useTheme } from "@/src/theme";
import { useTabBarMetrics } from "@/src/utils/tab-bar";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const springConfig = { damping: 15, stiffness: 400 };

function ScalePressable({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: object;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.98, springConfig);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, springConfig);
      }}
      style={style}
    >
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Pressable>
  );
}

export default function ProfileTabScreen() {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const { scrollBottomPadding } = useTabBarMetrics();
  const MENU_ITEMS = [
    {
      id: "edit",
      label: t("edit_profile"),
      icon: "manage-accounts" as const,
    },
    {
      id: "leaderboard",
      label: t("leaderboards"),
      icon: "emoji-events" as const,
    },
    {
      id: "settings",
      label: t("settings"),
      icon: "settings" as const,
    },
    {
      id: "help",
      label: t("help"),
      icon: "help" as const,
    },
  ] as const;
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const user = useAuthStore((s) => s.user);
  const { data: myRank, isPending: myRankLoading } = useMyRank();

  const avatarUri = resolveAvatarUrl(user?.avatarUrl ?? null);
  const displayName = user?.displayName?.trim() || t("user");
  const subtitle = user?.isGuest
    ? t("guest_account")
    : (user?.email ?? t("registered_user"));

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: palette.background }}
      edges={["top"]}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: scrollBottomPadding }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center px-6 pt-8 pb-10">
          <Pressable
            onPress={() => router.push("/edit-profile")}
            className="relative mb-6"
          >
            <View
              className="h-32 w-32 overflow-hidden rounded-full border-4 shadow-xl"
              style={{ borderColor: palette.card }}
            >
              {avatarUri ? (
                <Image
                  source={{ uri: avatarUri }}
                  className="h-full w-full"
                  style={{ backgroundColor: palette.iconSurface }}
                  resizeMode="cover"
                />
              ) : (
                <View
                  className="h-full w-full items-center justify-center"
                  style={{ backgroundColor: palette.iconSurface }}
                >
                  <MaterialIcons
                    name="person"
                    size={56}
                    color={palette.primary}
                  />
                </View>
              )}
            </View>
            <View
              className="absolute bottom-1 right-1 h-9 w-9 items-center justify-center rounded-full border-4 shadow-md"
              style={{
                borderColor: palette.background,
                backgroundColor: palette.primary,
              }}
            >
              <MaterialIcons
                name="edit"
                size={18}
                color={palette.switchThumb}
              />
            </View>
          </Pressable>
          <View className="items-center gap-1">
            <Text
              className="text-center text-2xl font-bold tracking-tight"
              style={{ color: palette.foreground }}
            >
              {displayName}
            </Text>
            <Text
              className="text-center text-sm font-medium"
              style={{ color: palette.muted }}
            >
              {subtitle}
            </Text>
          </View>
        </View>

        <View className="px-6 pb-2">
          <ProfileBadgesPreview />
        </View>

        <View className="flex-grow gap-3 px-6">
          {MENU_ITEMS.map((item) => (
            <ScalePressable
              key={item.id}
              onPress={() => {
                if (item.id === "settings") {
                  router.push("/settings");
                } else if (item.id === "help") {
                  router.push("/conversations");
                } else if (item.id === "edit") {
                  router.push("/edit-profile");
                } else if (item.id === "leaderboard") {
                  router.push("/leaderboard");
                }
              }}
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 20,
                borderRadius: 16,
                backgroundColor: palette.iconSurface,
              }}
            >
              <View className="w-full flex-row items-center justify-between">
                <View className="flex-1 flex-row items-center gap-4">
                  <View
                    className="h-10 w-10 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: palette.card,
                      shadowColor: palette.shadow,
                      shadowOpacity: palette.cardShadowOpacity * 0.5,
                      shadowOffset: { width: 0, height: 1 },
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  >
                    <MaterialIcons
                      name={item.icon}
                      size={22}
                      color={palette.muted}
                    />
                  </View>
                  <Text
                    className="text-base font-semibold"
                    style={{ color: palette.foreground }}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                </View>
                {item.id === "leaderboard" ? (
                  <View className="flex-row items-center gap-2 pr-0.5">
                    <Text
                      className="text-sm font-extrabold"
                      style={{ color: palette.primary }}
                    >
                      {myRankLoading
                        ? "…"
                        : formatRankDisplay(myRank?.allTime ?? null)}
                    </Text>
                    <MaterialIcons
                      name="chevron-right"
                      size={24}
                      color={palette.chevron}
                    />
                  </View>
                ) : (
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color={palette.chevron}
                  />
                )}
              </View>
            </ScalePressable>
          ))}
        </View>

        <View className="p-6 pb-12">
          <ScalePressable
            onPress={() => setShowLogoutConfirm(true)}
            style={{
              width: "100%",
              paddingVertical: 16,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
              backgroundColor: palette.dangerBg,
            }}
          >
            <Text
              className="text-base font-bold"
              style={{ color: palette.dangerForeground }}
            >
              {t("logout")}
            </Text>
          </ScalePressable>
        </View>
      </ScrollView>
      <LogoutConfirmModal
        visible={showLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={async () => {
          setShowLogoutConfirm(false);
          await logout();
          router.replace("/auth");
        }}
      />
    </SafeAreaView>
  );
}
