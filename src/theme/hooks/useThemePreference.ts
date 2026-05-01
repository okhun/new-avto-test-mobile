import { useThemeStore, type ThemePreference } from "@/src/store/theme.store";

/** Stored user choice: may be `system`. */
export function useThemePreference(): ThemePreference {
  return useThemeStore((s) => s.theme);
}
