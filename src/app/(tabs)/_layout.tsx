import { HapticTab } from "@/components/haptic-tab";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { Tabs } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

const PRIMARY = "#137fec";
const TAB_INACTIVE = "#4c739a";

const TAB_BAR_STYLE = {
  position: "absolute" as const,
  borderTopWidth: 1,
  borderTopColor: "rgba(226, 232, 240, 0.8)",
  backgroundColor:
    Platform.OS === "ios"
      ? "rgba(255, 255, 255, 0.8)"
      : "rgba(255, 255, 255, 0.95)",
  paddingTop: 12,
  paddingBottom: Platform.OS === "ios" ? 28 : 12,
  height: Platform.OS === "ios" ? 88 : 64,
};

const TAB_BAR_HIDDEN = {
  display: "none" as const,
  height: 0,
  overflow: "hidden" as const,
};

export default function TabLayout() {
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: TAB_INACTIVE,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
        tabBarStyle: TAB_BAR_STYLE,
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
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="edit-note" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="exams"
        options={{
          title: t("exams"),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="book" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("profile"),
          tabBarIcon: ({ color, size }) => (
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
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <MaterialIcons name="chat" size={24} color={color} />
            ),
            tabBarStyle: hideTabBar ? TAB_BAR_HIDDEN : TAB_BAR_STYLE,
          };
        }}
      />
    </Tabs>
  );
}
