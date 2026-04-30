import { ScalePressable } from "@/src/components/ui/ScalePressable";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

const PRIMARY = "#137fec";
const TEXT_DARK = "#0f172a";

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
  return (
    <View className="mt-2 gap-3 pb-8">
      <ScalePressable
        onPress={onRetake}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          backgroundColor: PRIMARY,
          borderRadius: 14,
          paddingVertical: 14,
        }}
      >
        <MaterialIcons name="replay" size={22} color="#ffffff" />
        <Text className="text-base font-bold text-white">
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
          backgroundColor: "#f1f5f9",
          borderRadius: 14,
          paddingVertical: 14,
        }}
      >
        <MaterialIcons name="list-alt" size={22} color={TEXT_DARK} />
        <Text className="text-base font-semibold" style={{ color: TEXT_DARK }}>
          {t("exam_history")}
        </Text>
      </ScalePressable>
    </View>
  );
}
