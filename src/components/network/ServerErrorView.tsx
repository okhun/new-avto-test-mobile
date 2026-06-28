import { RetryButton } from "@/src/components/network/RetryButton";
import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

type Props = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export function ServerErrorView({ title, description, onRetry }: Props) {
  const { t } = useTranslation();
  const { palette } = useTheme();

  return (
    <View className="flex-1 items-center justify-center px-6">
      <MaterialIcons name="error-outline" size={48} color={palette.chevron} />
      <Text
        className="mt-3 text-center text-lg font-bold"
        style={{ color: palette.foreground }}
      >
        {title ?? t("network.server_error_title")}
      </Text>
      <Text
        className="mt-2 text-center text-sm leading-relaxed"
        style={{ color: palette.muted }}
      >
        {description ?? t("network.server_error_description")}
      </Text>
      {onRetry ? (
        <View className="mt-5">
          <RetryButton onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
}
