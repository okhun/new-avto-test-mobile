import { ScalePressable } from "@/src/components/ui/ScalePressable";
import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

type Props = {
  onBackToExams: () => void;
  onRetake: () => void;
  retakeLabel: string;
};

export function ExamResultActions({
  onBackToExams,
  onRetake,
  retakeLabel,
}: Props) {
  const { t } = useTranslation();
  const { palette } = useTheme();

  return (
    <View className="mt-2 gap-3 pb-8">
      <ScalePressable
        onPress={onRetake}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          backgroundColor: palette.primary,
          borderRadius: 14,
          paddingVertical: 14,
        }}
      >
        <MaterialIcons name="replay" size={22} color={palette.switchThumb} />
        <Text
          className="text-base font-bold"
          style={{ color: palette.switchThumb }}
        >
          {t("retake")} ({retakeLabel})
        </Text>
      </ScalePressable>

      <ScalePressable
        onPress={onBackToExams}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          backgroundColor: palette.iconSurface,
          borderRadius: 14,
          paddingVertical: 14,
          borderWidth: 1,
          borderColor: palette.border,
        }}
      >
        <MaterialIcons name="list-alt" size={22} color={palette.foreground} />
        <Text
          className="text-base font-semibold"
          style={{ color: palette.foreground }}
        >
          {t("exam_history")}
        </Text>
      </ScalePressable>
    </View>
  );
}
