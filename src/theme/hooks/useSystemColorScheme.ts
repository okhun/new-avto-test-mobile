import { useEffect, useState } from "react";
import { Appearance } from "react-native";

import type { ResolvedTheme } from "../types";

/**
 * Tracks the device color scheme and updates when the user changes system appearance.
 */
export function useSystemColorScheme(): ResolvedTheme {
  const [scheme, setScheme] = useState<ResolvedTheme>(
    () => (Appearance.getColorScheme() ?? "light") as ResolvedTheme
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setScheme((colorScheme ?? "light") as ResolvedTheme);
    });
    return () => subscription.remove();
  }, []);

  return scheme;
}
