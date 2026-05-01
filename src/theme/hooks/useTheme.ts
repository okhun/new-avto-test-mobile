import { useMemo } from "react";

import { createPalette } from "../createPalette";
import type { ThemeUIPalette } from "../tokens";
import type { ResolvedTheme } from "../types";
import { useResolvedTheme } from "./useResolvedTheme";

export type UseThemeResult = {
  /** True when resolved appearance is dark. */
  isDark: boolean;
  /** Resolved concrete theme (after applying `system`). */
  theme: ResolvedTheme;
  /** Semantic + UI tokens for the current theme. */
  palette: ThemeUIPalette;
};

/**
 * Central hook for screens and themed components.
 * Palette is memoized per resolved theme to limit re-renders.
 */
export function useTheme(): UseThemeResult {
  const theme = useResolvedTheme();
  const palette = useMemo(() => createPalette(theme), [theme]);

  return useMemo(
    () => ({
      isDark: theme === "dark",
      theme,
      palette,
    }),
    [theme, palette]
  );
}
