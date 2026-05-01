import LangSwitcher from "@/components/LangSwitcher";
import { useResolvedTheme, useThemePreference } from "@/src/config/theme";
import { useAuthStore } from "@/src/store/auth.store";
import { useThemeStore, type ThemePreference } from "@/src/store/theme.store";
import { darkColors } from "@/src/theme/colors.dark";
import { lightColors } from "@/src/theme/colors.light";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
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

function SectionHeader({
  title,
  mutedColor,
}: {
  title: string;
  mutedColor: string;
}) {
  return (
    <Text
      className="px-1 pb-3 pt-6 text-xs font-bold uppercase tracking-wider"
      style={{ color: mutedColor }}
    >
      {title}
    </Text>
  );
}

export default function SettingsTabScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const themePreference = useThemePreference();
  const setThemePreference = useThemeStore((s) => s.setTheme);
  const resolvedTheme = useResolvedTheme();
  const isDark = resolvedTheme === "dark";

  const palette = useMemo(() => {
    const base = isDark ? darkColors : lightColors;
    return {
      ...base,
      border: isDark ? "#334155" : "#e2e8f0",
      divider: isDark ? "#1e293b" : "#f1f5f9",
      iconSurface: isDark ? "#1e293b" : "#f1f5f9",
      radioOff: isDark ? "#475569" : "#e2e8f0",
      chevron: isDark ? "#64748b" : "#94a3b8",
      versionMuted: isDark ? "#64748b" : "#94a3b8",
      dangerBg: isDark ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.1)",
      cardShadowOpacity: isDark ? 0.25 : 0.05,
    };
  }, [isDark]);

  const selectTheme = (next: ThemePreference) => setThemePreference(next);

  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const logout = useAuthStore((s) => s.logout);
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: palette.background }}
      edges={["top"]}
    >
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 pb-2 pt-4"
        style={{
          backgroundColor: palette.background,
          borderBottomWidth: 1,
          borderBottomColor: palette.border,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          className="h-12 w-12 shrink-0 items-center justify-center active:opacity-70"
          hitSlop={8}
        >
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={palette.foreground}
          />
        </Pressable>
        <Text
          className="flex-1 pr-12 text-center text-lg font-bold leading-tight tracking-tight"
          style={{ color: palette.foreground }}
        >
          {t("settings")}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance */}
        <SectionHeader title={t("appearance")} mutedColor={palette.muted} />
        <View className="flex-row gap-3">
          {/* Light */}
          <ScalePressable
            onPress={() => selectTheme("light")}
            style={{
              flex: 1,
              alignItems: "center",
              gap: 12,
              padding: 16,
              borderRadius: 16,
              borderWidth: 2,
              borderColor:
                themePreference === "light" ? palette.primary : "transparent",
              backgroundColor: palette.card,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: palette.cardShadowOpacity,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <View
              className="h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: `${palette.primary}1A` }}
            >
              <MaterialIcons
                name="wb-sunny"
                size={22}
                color={palette.primary}
              />
            </View>
            <Text
              className="text-sm font-semibold"
              style={{ color: palette.foreground }}
            >
              {t("light")}
            </Text>
            <View className="flex-row items-center justify-center">
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor:
                    themePreference === "light"
                      ? palette.primary
                      : palette.radioOff,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {themePreference === "light" && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: palette.primary,
                    }}
                  />
                )}
              </View>
            </View>
          </ScalePressable>
          {/* Dark */}
          <ScalePressable
            onPress={() => selectTheme("dark")}
            style={{
              flex: 1,
              alignItems: "center",
              gap: 12,
              padding: 16,
              borderRadius: 16,
              borderWidth: 2,
              borderColor:
                themePreference === "dark" ? palette.primary : "transparent",
              backgroundColor: palette.card,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: palette.cardShadowOpacity,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <View
              className="h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: palette.iconSurface }}
            >
              <MaterialIcons
                name="nights-stay"
                size={22}
                color={palette.muted}
              />
            </View>
            <Text
              className="text-sm font-semibold"
              style={{ color: palette.foreground }}
            >
              {t("dark")}
            </Text>
            <View className="flex-row items-center justify-center">
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor:
                    themePreference === "dark"
                      ? palette.primary
                      : palette.radioOff,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {themePreference === "dark" && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: palette.primary,
                    }}
                  />
                )}
              </View>
            </View>
          </ScalePressable>
          {/* System */}
          <ScalePressable
            onPress={() => selectTheme("system")}
            style={{
              flex: 1,
              alignItems: "center",
              gap: 12,
              padding: 16,
              borderRadius: 16,
              borderWidth: 2,
              borderColor:
                themePreference === "system" ? palette.primary : "transparent",
              backgroundColor: palette.card,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: palette.cardShadowOpacity,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <View
              className="h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: palette.iconSurface }}
            >
              <MaterialIcons
                name="brightness-6"
                size={22}
                color={palette.muted}
              />
            </View>
            <Text
              className="text-sm font-semibold"
              style={{ color: palette.foreground }}
            >
              {t("system")}
            </Text>
            <View className="flex-row items-center justify-center">
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor:
                    themePreference === "system"
                      ? palette.primary
                      : palette.radioOff,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {themePreference === "system" && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: palette.primary,
                    }}
                  />
                )}
              </View>
            </View>
          </ScalePressable>
        </View>

        <SectionHeader title={t("language")} mutedColor={palette.muted} />
        <LangSwitcher />

        {/* Preferences */}
        <SectionHeader title={t("preferences")} mutedColor={palette.muted} />
        <View
          className="overflow-hidden rounded-2xl shadow-sm"
          style={{ backgroundColor: palette.card }}
        >
          <View
            className="min-h-[60px] flex-row items-center justify-between gap-4 px-4"
            style={{ borderBottomWidth: 1, borderBottomColor: palette.divider }}
          >
            <View className="flex-row flex-1 items-center gap-4">
              <View
                className="h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: palette.iconSurface }}
              >
                <MaterialIcons
                  name="notifications"
                  size={22}
                  color={palette.foreground}
                />
              </View>
              <Text
                className="flex-1 text-base font-medium"
                style={{ color: palette.foreground }}
                numberOfLines={1}
              >
                {t("push_notifications")}
              </Text>
            </View>
            <View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: palette.radioOff, true: palette.primary }}
                thumbColor={isDark ? "#e2e8f0" : "#ffffff"}
              />
            </View>
          </View>
          <View className="min-h-[60px] flex-row items-center justify-between gap-4 px-4">
            <View className="flex-row flex-1 items-center gap-4">
              <View
                className="h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: palette.iconSurface }}
              >
                <MaterialIcons
                  name="volume-up"
                  size={22}
                  color={palette.foreground}
                />
              </View>
              <Text
                className="flex-1 text-base font-medium"
                style={{ color: palette.foreground }}
                numberOfLines={1}
              >
                {t("sound_effects")}
              </Text>
            </View>
            <View>
              <Switch
                value={soundEffects}
                onValueChange={setSoundEffects}
                trackColor={{ false: palette.radioOff, true: palette.primary }}
                thumbColor={isDark ? "#e2e8f0" : "#ffffff"}
              />
            </View>
          </View>
          {/* <Pressable
            onPress={() => setHapticFeedback(!hapticFeedback)}
            className="flex-row items-center justify-between px-4 py-3 active:bg-slate-50"
          >
            <View className="flex-row items-center gap-4">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <MaterialIcons name="vibration" size={22} color={PRIMARY} />
              </View>

              <View>
                <Text className="text-[16px] font-bold text-slate-900">
                  {t("haptic_feedback")}
                </Text>
                <Text className="text-[12px] text-slate-400 font-medium">
                  {t("vibrate_on_tap_and_errors")}
                </Text>
              </View>
            </View>

            <Switch
              value={hapticFeedback}
              onValueChange={setHapticFeedback}
              trackColor={{ false: "#cbd5e1", true: PRIMARY }}
              thumbColor={Platform.OS === "android" ? "#ffffff" : undefined}
              ios_backgroundColor="#cbd5e1"
            />
          </Pressable> */}
        </View>

        {/* Support */}
        <SectionHeader title={t("support")} mutedColor={palette.muted} />
        <View
          className="overflow-hidden rounded-2xl shadow-sm"
          style={{ backgroundColor: palette.card }}
        >
          <Pressable
            className="min-h-[60px] flex-row items-center justify-between gap-4"
            style={({ pressed }) =>
              pressed
                ? { backgroundColor: isDark ? "#1e293b" : "#f8fafc" }
                : undefined
            }
            onPress={() => router.push("/conversations")}
          >
            <View className="flex-row flex-1 items-center gap-4 px-4">
              <View
                className="h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${palette.primary}1A` }}
              >
                <MaterialIcons name="help" size={22} color={palette.primary} />
              </View>
              <Text
                className="flex-1 text-base font-medium"
                style={{ color: palette.foreground }}
                numberOfLines={1}
              >
                {t("help_and_support")}
              </Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={palette.chevron}
            />
          </Pressable>
          <View className="h-px" style={{ backgroundColor: palette.divider }} />
          <Pressable
            className="min-h-[60px] flex-row items-center justify-between gap-4"
            style={({ pressed }) =>
              pressed
                ? { backgroundColor: isDark ? "#1e293b" : "#f8fafc" }
                : undefined
            }
          >
            <View className="flex-row flex-1 items-center gap-4 px-4">
              <View
                className="h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${palette.primary}1A` }}
              >
                <MaterialIcons
                  name="policy"
                  size={22}
                  color={palette.primary}
                />
              </View>
              <Text
                className="flex-1 text-base font-medium"
                style={{ color: palette.foreground }}
                numberOfLines={1}
              >
                {t("privacy_policy")}
              </Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={palette.chevron}
            />
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
              backgroundColor: palette.dangerBg,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <View className="flex-row items-center justify-center gap-2">
              <MaterialIcons name="logout" size={22} color="#dc2626" />
              <Text className="text-base font-bold text-red-600">
                {t("logout")}
              </Text>
            </View>
          </ScalePressable>
          <Text
            className="mt-6 text-center text-sm"
            style={{ color: palette.versionMuted }}
          >
            {t("version")} 2.4.0 (Build 108)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
