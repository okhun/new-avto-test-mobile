import LangSwitcher from "@/components/LangSwitcher";
import { ThemedText } from "@/components/themed-text";
import { useAuthStore } from "@/src/store/auth.store";
import { useThemeStore, type ThemePreference } from "@/src/store/theme.store";
import { useTheme, useThemePreference } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Switch, View } from "react-native";
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

function SectionHeader({ title }: { title: string }) {
  return (
    <ThemedText
      color="muted"
      className="px-1 pb-3 pt-6 text-xs font-bold uppercase tracking-wider"
    >
      {title}
    </ThemedText>
  );
}

export default function SettingsTabScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { palette } = useTheme();
  const themePreference = useThemePreference();
  const setThemePreference = useThemeStore((s) => s.setTheme);

  const selectTheme = (next: ThemePreference) => setThemePreference(next);

  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const logout = useAuthStore((s) => s.logout);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: palette.background }}
      edges={["top"]}
    >
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
        <ThemedText className="flex-1 pr-12 text-center text-lg font-bold leading-tight tracking-tight">
          {t("settings")}
        </ThemedText>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title={t("appearance")} />
        <View className="flex-row gap-3">
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
              shadowColor: palette.shadow,
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
            <ThemedText className="text-sm font-semibold">
              {t("light")}
            </ThemedText>
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
              shadowColor: palette.shadow,
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
            <ThemedText className="text-sm font-semibold">
              {t("dark")}
            </ThemedText>
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
              shadowColor: palette.shadow,
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
            <ThemedText className="text-sm font-semibold">
              {t("system")}
            </ThemedText>
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

        <SectionHeader title={t("language")} />
        <LangSwitcher />

        <SectionHeader title={t("preferences")} />
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
              <ThemedText
                className="flex-1 text-base font-medium"
                numberOfLines={1}
              >
                {t("push_notifications")}
              </ThemedText>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: palette.radioOff, true: palette.primary }}
              thumbColor={palette.switchThumb}
            />
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
              <ThemedText
                className="flex-1 text-base font-medium"
                numberOfLines={1}
              >
                {t("sound_effects")}
              </ThemedText>
            </View>
            <Switch
              value={soundEffects}
              onValueChange={setSoundEffects}
              trackColor={{ false: palette.radioOff, true: palette.primary }}
              thumbColor={palette.switchThumb}
            />
          </View>
        </View>

        <SectionHeader title={t("support")} />
        <View
          className="overflow-hidden rounded-2xl shadow-sm"
          style={{ backgroundColor: palette.card }}
        >
          <Pressable
            className="min-h-[60px] flex-row items-center justify-between gap-4"
            style={({ pressed }) =>
              pressed ? { backgroundColor: palette.surfacePressed } : undefined
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
              <ThemedText
                className="flex-1 text-base font-medium"
                numberOfLines={1}
              >
                {t("help_and_support")}
              </ThemedText>
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
              pressed ? { backgroundColor: palette.surfacePressed } : undefined
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
              <ThemedText
                className="flex-1 text-base font-medium"
                numberOfLines={1}
              >
                {t("privacy_policy")}
              </ThemedText>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={palette.chevron}
            />
          </Pressable>
        </View>

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
              <MaterialIcons
                name="logout"
                size={22}
                color={palette.dangerForeground}
              />
              <ThemedText type="defaultSemiBold" color="destructive">
                {t("logout")}
              </ThemedText>
            </View>
          </ScalePressable>
          <ThemedText
            className="mt-6 text-center text-sm"
            style={{ color: palette.versionMuted }}
          >
            {t("version")} 2.4.0 (Build 108)
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
