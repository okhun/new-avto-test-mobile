/** Semantic palette shared by light/dark definitions. */
export type ThemeSemanticTokens = {
  background: string;
  foreground: string;
  card: string;
  muted: string;
  primary: string;
  secondary: string;
};

/** Resolved runtime palette (semantic tokens + structural UI roles). */
export type ThemeUIPalette = ThemeSemanticTokens & {
  border: string;
  divider: string;
  iconSurface: string;
  radioOff: string;
  chevron: string;
  dangerBg: string;
  dangerForeground: string;
  versionMuted: string;
  surfacePressed: string;
  switchThumb: string;
  /** Multiplier for shadows on elevated cards */
  cardShadowOpacity: number;
  /** Canonical shadow tint (elevations / cards) */
  shadow: string;
};

/** Backwards-compatible alias used by legacy color modules. */
export type ThemeTokens = ThemeSemanticTokens;

export type ThemePalette = {
  light: ThemeSemanticTokens;
  dark: ThemeSemanticTokens;
};
