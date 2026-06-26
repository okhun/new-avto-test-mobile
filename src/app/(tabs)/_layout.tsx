import { HapticTab } from "@/components/haptic-tab";
import { useTheme } from "@/src/theme";
import {
  getTabBarBottomInset,
  TAB_BAR_CONTENT_HEIGHT,
} from "@/src/utils/tab-bar";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { Tabs } from "expo-router";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

const ANDROID_ICON_SIZE = 22;

function AndroidTabLabel({
  color,
  children,
}: {
  color: string;
  children: string;
}) {
  return (
    <Text
      numberOfLines={1}
      ellipsizeMode="tail"
      adjustsFontSizeToFit
      minimumFontScale={0.75}
      style={{
        color,
        fontSize: 10,
        fontWeight: "600",
        lineHeight: 12,
        textAlign: "center",
        marginTop: 2,
        marginBottom: 2,
        paddingHorizontal: 1,
        includeFontPadding: false,
      }}
    >
      {children}
    </Text>
  );
}

export default function TabLayout() {
  const { t } = useTranslation();
  const { palette, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomInset = getTabBarBottomInset(insets);
  const tabBarHeight = TAB_BAR_CONTENT_HEIGHT + bottomInset;

  const tabBarStyle = useMemo(() => {
    if (Platform.OS === "android") {
      return {
        position: "absolute" as const,
        left: 0,
        right: 0,
        bottom: 0,
        height: tabBarHeight,
        paddingTop: 8,
        paddingBottom: bottomInset,
        paddingHorizontal: 0,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: palette.border,
        backgroundColor: palette.card,
        elevation: 16,
      };
    }

    const iosBg = isDark
      ? hexWithAlpha(palette.card, "F0")
      : "rgba(255, 255, 255, 0.88)";

    return {
      position: "absolute" as const,
      left: 0,
      right: 0,
      bottom: 0,
      height: tabBarHeight,
      paddingTop: 6,
      paddingBottom: bottomInset,
      paddingHorizontal: 4,
      borderTopWidth: 1,
      borderTopColor: palette.border,
      backgroundColor: iosBg,
    };
  }, [palette.border, palette.card, isDark, tabBarHeight, bottomInset]);

  const inactiveTint = isDark ? palette.muted : "#475569";

  return (
    <Tabs
      // Bottom inset is applied in tabBarStyle — avoid RN adding it twice.
      safeAreaInsets={{ top: 0, right: 0, bottom: 0, left: 0 }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: inactiveTint,
        tabBarLabel:
          Platform.OS === "android"
            ? ({ color, children }) => (
                <AndroidTabLabel color={color}>{children}</AndroidTabLabel>
              )
            : undefined,
        tabBarLabelStyle:
          Platform.OS === "ios"
            ? { fontSize: 11, fontWeight: "600", marginTop: 2 }
            : undefined,
        tabBarIconStyle: {
          marginTop: Platform.OS === "android" ? 4 : 0,
        },
        tabBarItemStyle: {
          paddingVertical: Platform.OS === "android" ? 2 : 4,
        },
        tabBarStyle: tabBarStyle,
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarButton: (props) => <HapticTab {...props} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("home"),
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name="dashboard"
              size={Platform.OS === "android" ? ANDROID_ICON_SIZE : 24}
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
            <MaterialIcons
              name="edit-note"
              size={Platform.OS === "android" ? ANDROID_ICON_SIZE : 24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="exams"
        options={{
          title: t("exams"),
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name="book"
              size={Platform.OS === "android" ? ANDROID_ICON_SIZE : 24}
              color={color}
            />
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
              <MaterialIcons
                name="chat"
                size={Platform.OS === "android" ? ANDROID_ICON_SIZE : 24}
                color={color}
              />
            ),
            tabBarStyle: hideTabBar ? TAB_BAR_HIDDEN : tabBarStyle,
          };
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("profile"),
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name="person"
              size={Platform.OS === "android" ? ANDROID_ICON_SIZE : 24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
