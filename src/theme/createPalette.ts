import { darkColors } from "./colors.dark";
import { lightColors } from "./colors.light";
import type { ThemeUIPalette } from "./tokens";
import type { ResolvedTheme } from "./types";

/**
 * Pure function mapping resolved theme → full palette.
 * Keeps merging logic centralized and test-friendly.
 */
export function createPalette(resolvedTheme: ResolvedTheme): ThemeUIPalette {
  const base = resolvedTheme === "dark" ? darkColors : lightColors;
  const isDark = resolvedTheme === "dark";

  return {
    ...base,
    border: isDark ? "#334155" : "#e2e8f0",
    divider: isDark ? "#1e293b" : "#f1f5f9",
    iconSurface: isDark ? "#1e293b" : "#f1f5f9",
    radioOff: isDark ? "#475569" : "#e2e8f0",
    chevron: isDark ? "#64748b" : "#94a3b8",
    dangerBg: isDark ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.1)",
    dangerForeground: "#dc2626",
    versionMuted: isDark ? "#64748b" : "#94a3b8",
    surfacePressed: isDark ? "#1e293b" : "#f8fafc",
    switchThumb: isDark ? "#e2e8f0" : "#ffffff",
    cardShadowOpacity: isDark ? 0.25 : 0.05,
    shadow: "#000000",
  };
}
