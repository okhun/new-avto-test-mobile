import { HapticTab } from "@/components/haptic-tab";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

const PRIMARY = "#137fec";
const TAB_INACTIVE = "#4c739a";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: TAB_INACTIVE,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
        tabBarStyle: {
          position: "absolute",
          borderTopWidth: 1,
          borderTopColor: "rgba(226, 232, 240, 0.8)",
          backgroundColor:
            Platform.OS === "ios"
              ? "rgba(255, 255, 255, 0.8)"
              : "rgba(255, 255, 255, 0.95)",
          paddingTop: 12,
          paddingBottom: Platform.OS === "ios" ? 28 : 12,
          height: Platform.OS === "ios" ? 88 : 64,
        },
        tabBarShowLabel: true,
        tabBarButton: (props) => <HapticTab {...props} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons
              name={focused ? "dashboard" : "dashboard"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Stats",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="insert-chart" size={24} color={color} />
          ),
        }}
      /> */}
      <Tabs.Screen name="leaderboard" options={{ href: null }} />
      <Tabs.Screen
        name="practice"
        options={{
          title: "Practice",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="edit-note" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="theory"
        options={{
          title: "Theory",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="school" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
