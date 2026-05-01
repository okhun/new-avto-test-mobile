import { ScalePressable } from "@/src/components/ui/ScalePressable";
import { COLORS } from "@/src/features/practice/constants/theme";
import type { Answer } from "@/src/features/practice/types/practice.types";
import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Text } from "react-native";

export type FeedbackKind = null | "correct" | "incorrect" | "reveal";

interface AnswerOptionProps {
  answer: Answer;
  label: string;
  isSelected: boolean;
  feedback: FeedbackKind;
  disabled: boolean;
  onPress: () => void;
}

export function AnswerOption({
  answer,
  label: _label,
  isSelected,
  feedback,
  disabled,
  onPress,
}: AnswerOptionProps) {
  const { palette, isDark } = useTheme();
  const successTint = isDark ? "rgba(34,197,94,0.22)" : `${COLORS.SUCCESS}15`;
  const successRevealTint = isDark
    ? "rgba(34,197,94,0.14)"
    : `${COLORS.SUCCESS}0A`;
  const errorTint = isDark ? "rgba(239,68,68,0.2)" : `${COLORS.ERROR}15`;
  const primaryTint = isDark ? `${palette.primary}26` : `${palette.primary}0D`;

  let border = palette.border;
  let bg = palette.card;
  let answerTextColor = palette.foreground;

  if (feedback === "correct") {
    border = COLORS.SUCCESS;
    bg = successTint;
    answerTextColor = isDark ? "#86efac" : COLORS.SUCCESS;
  } else if (feedback === "incorrect") {
    border = COLORS.ERROR;
    bg = errorTint;
    answerTextColor = isDark ? "#fca5a5" : COLORS.ERROR;
  } else if (feedback === "reveal") {
    border = COLORS.SUCCESS;
    bg = successRevealTint;
    answerTextColor = isDark ? "#86efac" : "#166534";
  } else if (isSelected) {
    border = palette.primary;
    bg = primaryTint;
    answerTextColor = palette.primary;
  }

  return (
    <ScalePressable
      onPress={onPress}
      disabled={disabled}
      style={{
        width: "100%",
        borderRadius: 12,
        padding: 16,
        borderWidth: 2,
        borderColor: border,
        backgroundColor: bg,
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        opacity: disabled && !feedback && !isSelected ? 0.5 : 1,
      }}
    >
      <Text
        style={{
          flex: 1,
          fontSize: 15,
          color: answerTextColor,
          fontWeight: isSelected || feedback ? "600" : "500",
          lineHeight: 22,
        }}
        className="!text-wrap"
      >
        {answer.text}
      </Text>
      {feedback === "correct" && (
        <MaterialIcons name="check-circle" size={22} color={COLORS.SUCCESS} />
      )}
      {feedback === "incorrect" && (
        <MaterialIcons name="cancel" size={22} color={COLORS.ERROR} />
      )}
    </ScalePressable>
  );
}
