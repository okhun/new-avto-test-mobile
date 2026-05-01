import { COLORS } from "@/src/features/practice/constants/theme";
import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, View } from "react-native";

type Props = {
  visible: boolean;
  correctAnswers: number;
  totalQuestions: number;
  onContinue: () => void;
  onResults: () => void;
  onShare: () => void;
};

export function ExamSuccessModal({
  visible,
  correctAnswers,
  totalQuestions,
  onContinue,
  onResults,
  onShare,
}: Props) {
  const { t } = useTranslation();
  const { palette } = useTheme();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onContinue}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View
          className="w-full max-w-md rounded-2xl p-6 shadow-xl"
          style={{
            elevation: 8,
            backgroundColor: palette.card,
            borderWidth: 1,
            borderColor: palette.border,
          }}
        >
          <View className="mb-4 items-center">
            <View
              className="mb-3 h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: `${COLORS.SUCCESS}22` }}
            >
              <MaterialIcons
                name="emoji-events"
                size={40}
                color={COLORS.SUCCESS}
              />
            </View>
            <Text
              className="text-center text-xl font-bold"
              style={{ color: palette.foreground }}
            >
              {t("congratulations")}
            </Text>
            <Text
              className="mt-2 text-center text-base"
              style={{ color: palette.muted }}
            >
              {correctAnswers} / {totalQuestions} {t("correct")}
            </Text>
          </View>

          <View className="gap-3">
            <Pressable
              onPress={onContinue}
              className="rounded-xl py-3.5"
              style={{ backgroundColor: palette.primary }}
            >
              <Text
                className="text-center text-base font-bold"
                style={{ color: palette.switchThumb }}
              >
                {t("continue")}
              </Text>
            </Pressable>
            <Pressable
              onPress={onResults}
              className="rounded-xl border py-3.5"
              style={{ borderColor: palette.border }}
            >
              <Text
                className="text-center text-base font-semibold"
                style={{ color: palette.foreground }}
              >
                {t("results")}
              </Text>
            </Pressable>
            <Pressable onPress={onShare} className="rounded-xl py-3">
              <Text
                className="text-center text-base font-semibold"
                style={{ color: palette.primary }}
              >
                {t("share")}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
