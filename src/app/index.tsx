import { useAuthStore } from "@/src/store/auth.store";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { SplashScreen } from "./../screens/SplashScreen";

export default function Index() {
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (!splashDone || isLoading) return;

    if (isAuthenticated) {
      router.replace("/(tabs)");
    } else {
      router.replace("/auth");
    }
  }, [splashDone, isLoading, isAuthenticated]);

  if (!splashDone) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />;
  }

  return null;
}
