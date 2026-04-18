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

const PRIMARY = "#2563eb";
const BACKGROUND = "#ffffff";
const BG_SLATE_50 = "#f8fafc";
const TEXT_DARK = "#0f172a";
const TEXT_SECONDARY = "#64748b";
const springConfig = { damping: 15, stiffness: 400 };

const AVATAR_URI =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCalJMbX6eeXBY9PaDS9OFFk4KM97iUP1VbneL49kMIYNy05G_2HYAlBLr731GW0MUfs0Dzm5kCzy-rRaepcfWYWN0M1gCY-JoyUhsBKzu4nROd2mNwJfA7_Y50ebNy1GXT5lnG-HFFgnryTHEzBFvKwwjFWW_yTw6PslBPvQS7oH9RWnl4CWLyZ3Ap_ydbSVR7RK2AIDF4VbOwcFohTn_DlhAWxIPX14btfZ_LCrLlulF0LntfSHC3xaa9P2J7PzkglxQoDxbEZyg";

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
    label: "Edit Profile",
    icon: "manage-accounts" as const,
    href: "/edit-profile",
  },
  {
    id: "settings",
    label: "Settings",
    icon: "settings" as const,
    href: "/settings",
  },
  {
    id: "help",
    label: "Help & Support",
    icon: "help" as const,
    href: "/help",
  },
] as const;

export default function ProfileTabScreen() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: BACKGROUND }}
      edges={["top"]}
    >
      {/* Header */}
      {/* <View className="flex-row items-center justify-between bg-white px-4 py-4">
        <Pressable
          onPress={() => router.back()}
          className="h-12 w-12 shrink-0 items-center justify-start active:opacity-70"
          hitSlop={8}
        >
          <MaterialIcons name="arrow-back-ios" size={20} color={TEXT_DARK} />
        </Pressable>
        <Text className="flex-1 text-center text-lg font-semibold leading-tight text-slate-900">
          Profile
        </Text>
        <View className="w-12" />
      </View> */}

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile header */}
        <View className="items-center px-6 pt-8 pb-10">
          <View className="relative mb-6">
            <View className="h-36 w-36 overflow-hidden rounded-full border-4 border-white shadow-xl">
              <Image
                source={{ uri: AVATAR_URI }}
                className="h-full w-full"
                style={{ backgroundColor: "#e2e8f0" }}
                resizeMode="cover"
              />
            </View>
            <View
              className="absolute bottom-1 right-1 h-9 w-9 items-center justify-center rounded-full border-4 border-white shadow-md"
              style={{ backgroundColor: PRIMARY }}
            >
              <MaterialIcons name="verified-user" size={18} color="#ffffff" />
            </View>
          </View>
          <View className="items-center gap-2">
            <Text className="text-center text-3xl font-bold tracking-tight text-slate-900">
              Alex Driver
            </Text>
            <Text
              className="text-center text-sm font-medium"
              style={{ color: TEXT_SECONDARY }}
            >
              Member since Oct 2023
            </Text>
          </View>
          <View
            className="mt-6 flex-row items-center gap-2 rounded-full border px-5 py-2"
            style={{
              backgroundColor: "#eff6ff",
              borderColor: "#dbeafe",
            }}
          >
            <MaterialIcons name="workspace-premium" size={20} color={PRIMARY} />
            <Text
              className="text-sm font-bold tracking-wide"
              style={{ color: PRIMARY }}
            >
              Level 5 - Advanced Learner
            </Text>
          </View>
        </View>

        {/* Action list */}
        <View className="flex-grow gap-3 px-6">
          {MENU_ITEMS.map((item) => (
            <ScalePressable
              key={item.id}
              onPress={() => {
                if (item.id === "settings") {
                  router.push("/settings");
                } else if (item.id === "help") {
                  router.push("/conversations/new");
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
              <View className="flex-row items-center justify-between w-full">
                <View className="flex-row flex-1 items-center gap-4">
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
                <MaterialIcons name="chevron-right" size={24} color="#cbd5e1" />
              </View>
            </ScalePressable>
          ))}
        </View>

        {/* Sign Out */}
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
            <Text className="text-base font-bold text-rose-500">Sign Out</Text>
          </ScalePressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
