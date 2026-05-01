import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import {
  LayoutAnimation,
  Platform,
  UIManager,
  View,
  type ViewProps,
} from "react-native";

import { useResolvedTheme } from "./hooks/useResolvedTheme";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type RootViewProps = ViewProps & {
  className?: string;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const resolvedTheme = useResolvedTheme();
  const isDark = resolvedTheme === "dark";
  const prevTheme = useRef(resolvedTheme);

  useEffect(() => {
    if (prevTheme.current !== resolvedTheme) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      prevTheme.current = resolvedTheme;
    }
  }, [resolvedTheme]);

  const className: RootViewProps["className"] = isDark
    ? "dark flex-1"
    : "flex-1";

  return (
    <View className={className}>
      <StatusBar style={isDark ? "light" : "dark"} />
      {children}
    </View>
  );
}
