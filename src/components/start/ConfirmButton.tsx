import { ScalePressable } from "@/src/components/ui/ScalePressable";
import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, View } from "react-native";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

interface ConfirmButtonProps {
  onPress: () => void;
  isSubmitting: boolean;
}

export function ConfirmButton({ onPress, isSubmitting }: ConfirmButtonProps) {
  const { t } = useTranslation();
  const { palette } = useTheme();
  return (
    <Animated.View
      entering={SlideInDown.duration(300).springify()}
      exiting={SlideOutDown.duration(200)}
      className="absolute bottom-0 left-0 right-0 p-4 pb-8"
      style={{
        backgroundColor: `${palette.background}F2`,
        borderTopWidth: 1,
        borderTopColor: palette.border,
      }}
    >
      <ScalePressable
        onPress={onPress}
        disabled={isSubmitting}
        style={{
          width: "100%",
          height: 56,
          backgroundColor: palette.primary,
          borderRadius: 12,
          shadowColor: palette.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: palette.cardShadowOpacity + 0.14,
          shadowRadius: 8,
          elevation: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isSubmitting ? (
          <ActivityIndicator color={palette.switchThumb} />
        ) : (
          <View className="flex-row items-center justify-center gap-2">
            <Text
              className="text-base font-bold"
              style={{ color: palette.switchThumb }}
            >
              {t("confirm_and_next")}
            </Text>
            <MaterialIcons
              name="arrow-forward"
              size={20}
              color={palette.switchThumb}
            />
          </View>
        )}
      </ScalePressable>
    </Animated.View>
  );
}
