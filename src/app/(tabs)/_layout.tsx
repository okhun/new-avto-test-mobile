import { HapticTab } from "@/components/haptic-tab";
import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { Tabs } from "expo-router";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

const TAB_BAR_HIDDEN = {
  display: "none" as const,
  height: 0,
  overflow: "hidden" as const,
};

/** Append 2-digit hex alpha to #RRGGBB (NativeWind / RN 8-digit color). */
function hexWithAlpha(hex: string, alphaHex: string): string {
  if (hex.startsWith("#") && hex.length === 7) return `${hex}${alphaHex}`;
  return hex;
}

export default function TabLayout() {
  const { t } = useTranslation();
  const { palette, isDark } = useTheme();

  const tabBarStyle = useMemo(() => {
    const iosBg = isDark
      ? hexWithAlpha(palette.card, "F0")
      : "rgba(255, 255, 255, 0.88)";
    const androidBg = isDark ? palette.card : "rgba(255, 255, 255, 0.95)";

    return {
      position: "absolute" as const,
      borderTopWidth: 1,
      borderTopColor: palette.border,
      backgroundColor: Platform.OS === "ios" ? iosBg : androidBg,
      paddingTop: 12,
      paddingBottom: Platform.OS === "ios" ? 28 : 12,
      height: Platform.OS === "ios" ? 88 : 64,
    };
  }, [palette.border, palette.card, isDark]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.muted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
        tabBarStyle: tabBarStyle,
        tabBarShowLabel: true,
        tabBarButton: (props) => <HapticTab {...props} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("home"),
          tabBarIcon: ({ focused, color }) => (
            <MaterialIcons
              name={focused ? "dashboard" : "dashboard"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="tickets/index"
        options={{
          title: t("questions"),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="edit-note" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="exams"
        options={{
          title: t("exams"),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="book" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("profile"),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="conversations"
        options={({ route }) => {
          const focused = getFocusedRouteNameFromRoute(route) ?? "index";
          const hideTabBar = focused !== "index";
          return {
            title: t("conversations"),
            tabBarIcon: ({ color }: { color: string }) => (
              <MaterialIcons name="chat" size={24} color={color} />
            ),
            tabBarStyle: hideTabBar ? TAB_BAR_HIDDEN : tabBarStyle,
          };
        }}
      />
    </Tabs>
  );
}
