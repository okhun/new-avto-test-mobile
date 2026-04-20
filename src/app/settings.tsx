import { useAuthStore } from "@/src/store/auth.store";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#258cf4";
const BACKGROUND_LIGHT = "#f5f7f8";
const TEXT_DARK = "#0d141c";
const TEXT_SECONDARY = "#4f7396";
const CARD_BG = "#ffffff";
const springConfig = { damping: 15, stiffness: 400 };

type ThemeOption = "light" | "dark" | "system";

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

function SectionHeader({ title }: { title: string }) {
  return (
    <Text
      className="px-1 pb-3 pt-6 text-xs font-bold uppercase tracking-wider"
      style={{ color: TEXT_SECONDARY }}
    >
      {title}
    </Text>
  );
}

export default function SettingsTabScreen() {
  const router = useRouter();
  const [theme, setTheme] = useState<ThemeOption>("light");
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const isLoading = useAuthStore((s) => s.isLoading);
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: BACKGROUND_LIGHT }}
      edges={["top"]}
    >
      {/* Header */}
      <View
        className="flex-row items-center justify-between border-b border-slate-200 px-4 pb-2 pt-4"
        style={{ backgroundColor: BACKGROUND_LIGHT }}
      >
        <Pressable
          onPress={() => router.back()}
          className="h-12 w-12 shrink-0 items-center justify-center active:opacity-70"
          hitSlop={8}
        >
          <MaterialIcons name="arrow-back" size={24} color={TEXT_DARK} />
        </Pressable>
        <Text
          className="flex-1 pr-12 text-center text-lg font-bold leading-tight tracking-tight"
          style={{ color: TEXT_DARK }}
        >
          Settings
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Account */}
        {/* <SectionHeader title="Account" />
        <View
          className="overflow-hidden rounded-2xl shadow-sm"
          style={{ backgroundColor: CARD_BG }}
        >
          <Pressable className="min-h-[60px] flex-row items-center justify-between gap-4 px-4 active:bg-slate-50">
            <View className="flex-row flex-1 items-center gap-4">
              <View
                className="h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${PRIMARY}1A` }}
              >
                <MaterialIcons name="person" size={22} color={PRIMARY} />
              </View>
              <Text
                className="flex-1 text-base font-medium text-[#0d141c]"
                numberOfLines={1}
              >
                Edit Profile
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
          </Pressable>
          <View className="h-px bg-slate-100" />
          <Pressable className="min-h-[60px] flex-row items-center justify-between gap-4 px-4 active:bg-slate-50">
            <View className="flex-row flex-1 items-center gap-4">
              <View
                className="h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${PRIMARY}1A` }}
              >
                <MaterialIcons name="lock" size={22} color={PRIMARY} />
              </View>
              <Text
                className="flex-1 text-base font-medium text-[#0d141c]"
                numberOfLines={1}
              >
                Change Password
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
          </Pressable>
        </View> */}

        {/* Appearance */}
        <SectionHeader title="Appearance" />
        <View className="flex-row gap-3">
          {/* Light */}
          <ScalePressable
            onPress={() => setTheme("light")}
            style={{
              flex: 1,
              alignItems: "center",
              gap: 12,
              padding: 16,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: theme === "light" ? PRIMARY : "transparent",
              backgroundColor: CARD_BG,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <View
              className="h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: `${PRIMARY}1A` }}
            >
              <MaterialIcons name="wb-sunny" size={22} color={PRIMARY} />
            </View>
            <Text className="text-sm font-semibold text-[#0d141c]">Light</Text>
            <View className="flex-row items-center justify-center">
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: theme === "light" ? PRIMARY : "#e2e8f0",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {theme === "light" && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: PRIMARY,
                    }}
                  />
                )}
              </View>
            </View>
          </ScalePressable>
          {/* Dark */}
          <ScalePressable
            onPress={() => setTheme("dark")}
            style={{
              flex: 1,
              alignItems: "center",
              gap: 12,
              padding: 16,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: theme === "dark" ? PRIMARY : "transparent",
              backgroundColor: CARD_BG,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <MaterialIcons name="nights-stay" size={22} color="#64748b" />
            </View>
            <Text className="text-sm font-semibold text-[#0d141c]">Dark</Text>
            <View className="flex-row items-center justify-center">
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: theme === "dark" ? PRIMARY : "#e2e8f0",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {theme === "dark" && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: PRIMARY,
                    }}
                  />
                )}
              </View>
            </View>
          </ScalePressable>
          {/* System */}
          <ScalePressable
            onPress={() => setTheme("system")}
            style={{
              flex: 1,
              alignItems: "center",
              gap: 12,
              padding: 16,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: theme === "system" ? PRIMARY : "transparent",
              backgroundColor: CARD_BG,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <View className=" h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <MaterialIcons name="brightness-6" size={22} color="#64748b" />
            </View>
            <Text className="text-sm font-semibold text-[#0d141c]">System</Text>
            <View className="flex-row items-center justify-center">
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: theme === "system" ? PRIMARY : "#e2e8f0",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {theme === "system" && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: PRIMARY,
                    }}
                  />
                )}
              </View>
            </View>
          </ScalePressable>
        </View>

        {/* Preferences */}
        <SectionHeader title="Preferences" />
        <View
          className="overflow-hidden rounded-2xl shadow-sm"
          style={{ backgroundColor: CARD_BG }}
        >
          <View className="min-h-[60px] flex-row items-center justify-between gap-4 border-b border-slate-100 px-4">
            <View className="flex-row flex-1 items-center gap-4">
              <View className="h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <MaterialIcons
                  name="notifications"
                  size={22}
                  color={TEXT_DARK}
                />
              </View>
              <Text
                className="flex-1 text-base font-medium text-[#0d141c]"
                numberOfLines={1}
              >
                Push Notifications
              </Text>
            </View>
            <View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: "#e2e8f0", true: PRIMARY }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
          <View className="min-h-[60px] flex-row items-center justify-between gap-4 border-b border-slate-100 px-4">
            <View className="flex-row flex-1 items-center gap-4">
              <View className="h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <MaterialIcons name="volume-up" size={22} color={TEXT_DARK} />
              </View>
              <Text
                className="flex-1 text-base font-medium text-[#0d141c]"
                numberOfLines={1}
              >
                Sound Effects
              </Text>
            </View>
            <View>
              <Switch
                value={soundEffects}
                onValueChange={setSoundEffects}
                trackColor={{ false: "#e2e8f0", true: PRIMARY }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
          <Pressable
            onPress={() => setHapticFeedback(!hapticFeedback)}
            className="flex-row items-center justify-between px-4 py-3 active:bg-slate-50"
          >
            <View className="flex-row items-center gap-4">
              {/* Icon with a slightly softer tint */}
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <MaterialIcons name="vibration" size={22} color={PRIMARY} />
              </View>

              <View>
                <Text className="text-[16px] font-bold text-slate-900">
                  Haptic Feedback
                </Text>
                <Text className="text-[12px] text-slate-400 font-medium">
                  Vibrate on tap and errors
                </Text>
              </View>
            </View>

            <Switch
              value={hapticFeedback}
              onValueChange={setHapticFeedback}
              trackColor={{ false: "#cbd5e1", true: PRIMARY }}
              // On iOS, the thumb color is white by default; on Android, we define it
              thumbColor={Platform.OS === "android" ? "#ffffff" : undefined}
              ios_backgroundColor="#cbd5e1"
            />
          </Pressable>
          {/* <View className="min-h-[60px] flex-row items-center justify-between gap-4 px-4">
            <View className="flex-row flex-1 items-center gap-4">
              <View className="h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <MaterialIcons name="vibration" size={22} color={TEXT_DARK} />
              </View>
              <Text
                className="flex-1 text-base font-medium text-[#0d141c]"
                numberOfLines={1}
              >
                Haptic Feedback
              </Text>
            </View>
            <View>
              <Switch
                value={hapticFeedback}
                onValueChange={setHapticFeedback}
                trackColor={{ false: "#e2e8f0", true: PRIMARY }}
                thumbColor="#ffffff"
              />
            </View>
          </View> */}
        </View>

        {/* Support */}
        <SectionHeader title="Support" />
        <View
          className="overflow-hidden rounded-2xl shadow-sm"
          style={{ backgroundColor: CARD_BG }}
        >
          <Pressable
            className="min-h-[60px] flex-row items-center justify-between gap-4 active:bg-slate-50"
            onPress={() => router.push("/conversations")}
          >
            <View className="flex-row flex-1 items-center gap-4 px-4">
              <View
                className="h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${PRIMARY}1A` }}
              >
                <MaterialIcons name="help" size={22} color={PRIMARY} />
              </View>
              <Text
                className="flex-1 text-base font-medium text-[#0d141c]"
                numberOfLines={1}
              >
                Help & Support
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
          </Pressable>
          <View className="h-px bg-slate-100" />
          <Pressable className="min-h-[60px] flex-row items-center justify-between gap-4 active:bg-slate-50">
            <View className="flex-row flex-1 items-center gap-4 px-4">
              <View
                className="h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${PRIMARY}1A` }}
              >
                <MaterialIcons name="policy" size={22} color={PRIMARY} />
              </View>
              <Text
                className="flex-1 text-base font-medium text-[#0d141c]"
                numberOfLines={1}
              >
                Privacy Policy
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
          </Pressable>
        </View>

        {/* Log Out */}
        <View className="mt-12 pb-10">
          <ScalePressable
            onPress={async () => {
              await logout();
              router.replace("/auth");
            }}
            style={{
              width: "100%",
              height: 56,
              borderRadius: 16,
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <View className="flex-row items-center justify-center gap-2">
              <MaterialIcons name="logout" size={22} color="#dc2626" />
              <Text className="text-base font-bold text-red-600">Log Out</Text>
            </View>
          </ScalePressable>
          <Text
            className="mt-6 text-center text-sm"
            style={{ color: "#94a3b8" }}
          >
            Version 2.4.0 (Build 108)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
