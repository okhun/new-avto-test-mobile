import { StyleSheet, Text, type TextProps } from "react-native";

import { useTheme } from "@/src/theme";

export type ThemedTextProps = TextProps & {
  /**
   * Color role from palette. Overrides only the text color, not typography.
   * @default foreground
   */
  color?: "foreground" | "muted" | "primary" | "secondary" | "destructive";
  /** Legacy typography presets (spacing / weight); colors come from palette when not overridden */
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  color = "foreground",
  type = "default",
  ...rest
}: ThemedTextProps) {
  const { palette } = useTheme();

  const semanticColor =
    color === "foreground"
      ? palette.foreground
      : color === "muted"
        ? palette.muted
        : color === "primary"
          ? palette.primary
          : color === "secondary"
            ? palette.secondary
            : palette.dangerForeground;

  return (
    <Text
      style={[
        { color: semanticColor },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? [styles.link, { color: palette.primary }] : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    fontWeight: "500",
  },
});
