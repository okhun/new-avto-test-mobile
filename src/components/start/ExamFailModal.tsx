import { COLORS } from "@/src/features/practice/constants/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

type Props = {
  visible: boolean;
  correctAnswers: number;
  totalQuestions: number;
  passingScore: number;
  onReviewMistakes: () => void;
  onTryAgain: () => void;
  onBackToStudy: () => void;
};

export function ExamFailModal({
  visible,
  correctAnswers,
  totalQuestions,
  passingScore,
  onReviewMistakes,
  onTryAgain,
  onBackToStudy,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onBackToStudy}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View
          className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
          style={{ elevation: 8 }}
        >
          <View className="mb-4 items-center">
            <View
              className="mb-3 h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: `${COLORS.ERROR}22` }}
            >
              <MaterialIcons
                name="sentiment-dissatisfied"
                size={40}
                color={COLORS.ERROR}
              />
            </View>
            <Text
              className="text-center text-xl font-bold"
              style={{ color: COLORS.TEXT_DARK }}
            >
              Imtihon yakunlandi
            </Text>
            <Text className="mt-2 text-center text-base text-slate-600">
              {correctAnswers} / {totalQuestions} to&apos;g&apos;ri
              (o&apos;tish: {passingScore}+)
            </Text>
          </View>

          <View className="gap-3">
            <Pressable
              onPress={onReviewMistakes}
              className="rounded-xl py-3.5"
              style={{ backgroundColor: COLORS.PRIMARY }}
            >
              <Text className="text-center text-base font-bold text-white">
                Xatolarni ko&apos;rish
              </Text>
            </Pressable>
            <Pressable
              onPress={onTryAgain}
              className="rounded-xl border border-slate-200 py-3.5"
            >
              <Text
                className="text-center text-base font-semibold"
                style={{ color: COLORS.TEXT_DARK }}
              >
                Qayta urinish
              </Text>
            </Pressable>
            <Pressable onPress={onBackToStudy} className="rounded-xl py-3">
              <Text
                className="text-center text-base font-semibold"
                style={{ color: COLORS.PRIMARY }}
              >
                O&apos;qishga qaytish
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
