import { resolveAvatarUrl } from "@/src/features/auth/utils/avatarUrl";
import { ProfileBadgesPreview } from "@/src/features/badges/components/ProfileBadgesPreview";
import { useMyRank } from "@/src/features/leaderboard/hook/useLeaderBoard";
import { formatRankDisplay } from "@/src/features/leaderboard/utils/leaderboardUi";
import { useAuthStore } from "@/src/store/auth.store";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#137fec";
const BACKGROUND = "#ffffff";
const BG_SLATE_50 = "#f8fafc";
const TEXT_SECONDARY = "#64748b";
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

const MENU_ITEMS = [
  {
    id: "edit",
    label: "Profilni tahrirlash",
    icon: "manage-accounts" as const,
  },
  {
    id: "leaderboard",
    label: "Reyting",
    icon: "emoji-events" as const,
  },
  {
    id: "settings",
    label: "Sozlamalar",
    icon: "settings" as const,
  },
  {
    id: "help",
    label: "Yordam va murojaat",
    icon: "help" as const,
  },
] as const;

export default function ProfileTabScreen() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const { data: myRank, isPending: myRankLoading } = useMyRank();

  const avatarUri = resolveAvatarUrl(user?.avatarUrl ?? null);
  const displayName = user?.displayName?.trim() || "Foydalanuvchi";
  const subtitle = user?.isGuest
    ? "Mehmon akkaunti"
    : (user?.email ?? "Ro'yxatdan o'tgan");

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: BACKGROUND }}
      edges={["top"]}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center px-6 pt-8 pb-10">
          <Pressable
            onPress={() => router.push("/edit-profile")}
            className="relative mb-6"
          >
            <View className="h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-xl">
              {avatarUri ? (
                <Image
                  source={{ uri: avatarUri }}
                  className="h-full w-full"
                  style={{ backgroundColor: "#e2e8f0" }}
                  resizeMode="cover"
                />
              ) : (
                <View className="h-full w-full items-center justify-center bg-slate-100">
                  <MaterialIcons name="person" size={56} color={PRIMARY} />
                </View>
              )}
            </View>
            <View
              className="absolute bottom-1 right-1 h-9 w-9 items-center justify-center rounded-full border-4 border-white shadow-md"
              style={{ backgroundColor: PRIMARY }}
            >
              <MaterialIcons name="edit" size={18} color="#ffffff" />
            </View>
          </Pressable>
          <View className="items-center gap-1">
            <Text className="text-center text-2xl font-bold tracking-tight text-slate-900">
              {displayName}
            </Text>
            <Text
              className="text-center text-sm font-medium"
              style={{ color: TEXT_SECONDARY }}
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
                backgroundColor: BG_SLATE_50,
              }}
            >
              <View className="w-full flex-row items-center justify-between">
                <View className="flex-1 flex-row items-center gap-4">
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                    <MaterialIcons name={item.icon} size={22} color="#475569" />
                  </View>
                  <Text
                    className="text-base font-semibold text-slate-700"
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                </View>
                {item.id === "leaderboard" ? (
                  <View className="flex-row items-center gap-2 pr-0.5">
                    <Text
                      className="text-sm font-extrabold"
                      style={{ color: PRIMARY }}
                    >
                      {myRankLoading
                        ? "…"
                        : formatRankDisplay(myRank?.allTime ?? null)}
                    </Text>
                    <MaterialIcons
                      name="chevron-right"
                      size={24}
                      color="#cbd5e1"
                    />
                  </View>
                ) : (
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color="#cbd5e1"
                  />
                )}
              </View>
            </ScalePressable>
          ))}
        </View>

        <View className="p-6 pb-12">
          <ScalePressable
            onPress={async () => {
              await logout();
              router.replace("/auth");
            }}
            style={{
              width: "100%",
              paddingVertical: 16,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
            }}
          >
            <Text className="text-base font-bold text-rose-500">Chiqish</Text>
          </ScalePressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
