import { useAuthStore } from "@/src/store/auth.store";
import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNetwork } from "@/src/providers/NetworkProvider";

type BannerMode = "hidden" | "offline" | "online";

export function OfflineBanner() {
  const { t } = useTranslation();
  const { palette, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { isOffline } = useNetwork();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [mode, setMode] = useState<BannerMode>("hidden");
  const translateY = useRef(new Animated.Value(-120)).current;
  const wasOfflineRef = useRef(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setMode("hidden");
      return;
    }

    if (isOffline) {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      wasOfflineRef.current = true;
      setMode("offline");
      return;
    }

    if (wasOfflineRef.current) {
      wasOfflineRef.current = false;
      setMode("online");
      hideTimerRef.current = setTimeout(() => setMode("hidden"), 2500);
    }
  }, [isOffline, isAuthenticated]);

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: mode === "hidden" ? -120 : 0,
      useNativeDriver: true,
      damping: 18,
      stiffness: 220,
    }).start();
  }, [mode, translateY]);

  if (!isAuthenticated || mode === "hidden") return null;

  const isOnlineBanner = mode === "online";
  const bg = isOnlineBanner
    ? isDark
      ? "#14532d"
      : "#dcfce7"
    : isDark
      ? "#451a03"
      : "#fef3c7";
  const fg = isOnlineBanner
    ? isDark
      ? "#bbf7d0"
      : "#166534"
    : isDark
      ? "#fde68a"
      : "#92400e";

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transform: [{ translateY }],
        paddingTop: insets.top + 4,
      }}
    >
      <View
        className="mx-3 flex-row items-start gap-2 rounded-2xl border px-3 py-2.5 shadow-md"
        style={{
          backgroundColor: bg,
          borderColor: isOnlineBanner ? "#86efac" : "#fcd34d",
        }}
      >
        <MaterialIcons
          name={isOnlineBanner ? "wifi" : "cloud-off"}
          size={18}
          color={fg}
          style={{ marginTop: 1 }}
        />
        <View className="min-w-0 flex-1">
          <Text className="text-sm font-bold" style={{ color: fg }}>
            {isOnlineBanner
              ? t("network.back_online")
              : t("network.offline_banner_title")}
          </Text>
          {!isOnlineBanner ? (
            <Text className="mt-0.5 text-xs leading-snug" style={{ color: fg }}>
              {t("network.offline_banner_subtitle")}
            </Text>
          ) : null}
        </View>
      </View>
    </Animated.View>
  );
}
