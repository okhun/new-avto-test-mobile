import { useThemeStore } from "@/src/store/theme.store";

import type { ResolvedTheme } from "../types";
import { useSystemColorScheme } from "./useSystemColorScheme";

/**
 * Returns the effective theme (`light` | `dark`).
 * When preference is `system`, follows `Appearance` and reacts to system changes.
 */
export function useResolvedTheme(): ResolvedTheme {
  const preference = useThemeStore((s) => s.theme);
  const systemTheme = useSystemColorScheme();

  return (preference === "system" ? systemTheme : preference) as ResolvedTheme;
}
