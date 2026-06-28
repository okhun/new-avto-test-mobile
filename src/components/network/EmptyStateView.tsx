import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  icon?: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function EmptyStateView({
  icon = "inbox",
  title,
  description,
  action,
}: Props) {
  const { palette } = useTheme();

  return (
    <View className="flex-1 items-center justify-center px-6 py-10">
      <MaterialIcons name={icon} size={48} color={palette.chevron} />
      <Text
        className="mt-3 text-center text-lg font-bold"
        style={{ color: palette.foreground }}
      >
        {title}
      </Text>
      {description ? (
        <Text
          className="mt-2 text-center text-sm leading-relaxed"
          style={{ color: palette.muted }}
        >
          {description}
        </Text>
      ) : null}
      {action ? <View className="mt-5">{action}</View> : null}
    </View>
  );
}
