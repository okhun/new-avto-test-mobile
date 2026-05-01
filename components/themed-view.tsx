import { View, type ViewProps } from "react-native";

import { useTheme } from "@/src/theme";

export type ThemedViewProps = ViewProps & {
  /**
   * Background from the active palette.
   * `transparent` skips background so layout-only className styling applies.
   */
  variant?: "background" | "card" | "transparent";
};

export function ThemedView({
  style,
  variant = "background",
  ...rest
}: ThemedViewProps) {
  const { palette } = useTheme();

  const backgroundColor =
    variant === "transparent" ? undefined : palette[variant];

  return (
    <View
      style={backgroundColor != null ? [{ backgroundColor }, style] : style}
      {...rest}
    />
  );
}
