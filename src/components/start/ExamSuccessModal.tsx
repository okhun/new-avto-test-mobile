import { COLORS } from "@/src/features/practice/constants/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
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
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onContinue}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View
          className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
          style={{ elevation: 8 }}
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
              style={{ color: COLORS.TEXT_DARK }}
            >
              Tabriklaymiz!
            </Text>
            <Text className="mt-2 text-center text-base text-slate-600">
              {correctAnswers} / {totalQuestions} savol to&apos;g&apos;ri
            </Text>
          </View>

          <View className="gap-3">
            <Pressable
              onPress={onContinue}
              className="rounded-xl py-3.5"
              style={{ backgroundColor: COLORS.PRIMARY }}
            >
              <Text className="text-center text-base font-bold text-white">
                Davom etish
              </Text>
            </Pressable>
            <Pressable
              onPress={onResults}
              className="rounded-xl border border-slate-200 py-3.5"
            >
              <Text
                className="text-center text-base font-semibold"
                style={{ color: COLORS.TEXT_DARK }}
              >
                Natijalar
              </Text>
            </Pressable>
            <Pressable onPress={onShare} className="rounded-xl py-3">
              <Text
                className="text-center text-base font-semibold"
                style={{ color: COLORS.PRIMARY }}
              >
                Ulashish
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
