import { useTheme } from "@/src/theme";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text } from "react-native";

type Props = {
  onPress: () => void;
  label?: string;
  disabled?: boolean;
};

export function RetryButton({ onPress, label, disabled }: Props) {
  const { t } = useTranslation();
  const { palette } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="rounded-2xl px-6 py-3"
      style={{
        backgroundColor: palette.primary,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <Text className="font-bold" style={{ color: palette.switchThumb }}>
        {label ?? t("try_again_loading")}
      </Text>
    </Pressable>
  );
}
