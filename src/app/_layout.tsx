import { api } from "@/services/api/axios";
import { setLogoutCallback } from "@/services/api/interceptors";
import "@/services/api/interceptors";
import "@/src/config/reanimated";
import { OfflineBanner } from "@/src/components/network/OfflineBanner";
import { NetworkSyncBridge } from "@/src/components/network/NetworkSyncBridge";
import { bootstrapAuthSession } from "@/src/services/auth/bootstrapAuth";
import { NetworkProvider } from "@/src/providers/NetworkProvider";
import { QueryProvider } from "@/src/providers";
import { ToastProvider } from "@/src/providers/ToastProvider";
import { useAuthStore } from "@/src/store/auth.store";
import { ThemeProvider } from "@/src/theme";
import { Stack } from "expo-router";
import React, { useEffect, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./../../global.css";
import "./../i18n/index";

export const unstable_settings = {
  anchor: "(tabs)",
};

function AppBootstrap() {
  const startedRef = useRef(false);

  useEffect(() => {
    setLogoutCallback(() => {
      useAuthStore.getState().logout();
    });
  }, []);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void bootstrapAuthSession();
  }, []);

  return (
    <>
      <NetworkSyncBridge />
      <OfflineBanner />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <NetworkProvider>
        <QueryProvider>
          <SafeAreaProvider>
            <ThemeProvider>
              <ToastProvider>
                <AppBootstrap />
                <Stack>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false, animation: "slide_from_left" }}
                  />
                  <Stack.Screen name="auth" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="tickets/[id]"
                    options={{ headerShown: false, animation: "slide_from_right" }}
                  />
                  <Stack.Screen
                    name="exams/start"
                    options={{ headerShown: false, animation: "slide_from_right" }}
                  />
                  <Stack.Screen
                    name="exams/result/[attemptId]"
                    options={{ headerShown: false, animation: "slide_from_right" }}
                  />
                  <Stack.Screen
                    name="settings"
                    options={{ headerShown: false, animation: "slide_from_right" }}
                  />
                  <Stack.Screen
                    name="edit-profile"
                    options={{ headerShown: false, animation: "slide_from_right" }}
                  />
                  <Stack.Screen
                    name="leaderboard"
                    options={{ headerShown: false, animation: "slide_from_right" }}
                  />
                  <Stack.Screen
                    name="badges"
                    options={{ headerShown: false, animation: "slide_from_right" }}
                  />
                </Stack>
              </ToastProvider>
            </ThemeProvider>
          </SafeAreaProvider>
        </QueryProvider>
      </NetworkProvider>
    </GestureHandlerRootView>
  );
}
