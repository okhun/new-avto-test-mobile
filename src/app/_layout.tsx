import { api } from "@/services/api/axios";
import "@/services/api/interceptors";
import { setLogoutCallback } from "@/services/api/interceptors";
import "@/src/config/reanimated";
import type { GetMeResponse } from "@/src/features/auth/types/auth.types";
import { QueryProvider } from "@/src/providers";
import { useAuthStore } from "@/src/store/auth.store";
import { Stack } from "expo-router";
import React, { useEffect, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./../../global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

function useBootstrapAuth() {
  const hasInitialized = useRef(false);

  useEffect(() => {
    setLogoutCallback(() => {
      useAuthStore.getState().logout();
    });
  }, []);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    (async () => {
      const store = useAuthStore.getState();
      const hasStored = await store.loadStoredAuth();

      if (hasStored) {
        try {
          const { data } = await api.get<GetMeResponse>("/users/me");
          if (data) {
            store.setUser({
              id: data.id,
              email: data.email,
              phoneNumber: data.phoneNumber,
              avatarUrl: data.avatarUrl ?? null,
              provider: data.provider,
              isGuest: data.isGuest,
              displayName: data.displayName,
            });
          }
        } catch {
          await store.logout();
        }
      } else {
        store.setLoading(false);
      }
    })();
  }, []);
}

export default function RootLayout() {
  useBootstrapAuth();

  return (
    <GestureHandlerRootView className="flex-1">
      <QueryProvider>
        <SafeAreaProvider>
          {/* <AuthBootstrapProvider> */}
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
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen
              name="ticket-exam"
              options={{ headerShown: false, title: "Ticket Exam" }}
            />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
          {/* </AuthBootstrapProvider> */}
        </SafeAreaProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
