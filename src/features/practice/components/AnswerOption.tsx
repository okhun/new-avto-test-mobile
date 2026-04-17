import { ScalePressable } from "@/src/components/ui/ScalePressable";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Text } from "react-native";
import { COLORS } from "../constants/theme";
import type { Answer } from "../types/practice.types";

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
  label,
  isSelected,
  feedback,
  disabled,
  onPress,
}: AnswerOptionProps) {
  let border = "#e2e8f0";
  let bg = COLORS.CARD_BG;
  let circle = "transparent";
  let cBorder = "#cbd5e1";
  let cText = COLORS.TEXT_DARK;

  if (feedback === "correct") {
    border = COLORS.SUCCESS;
    bg = `${COLORS.SUCCESS}15`;
    circle = COLORS.SUCCESS;
    cBorder = COLORS.SUCCESS;
    cText = "#fff";
  } else if (feedback === "incorrect") {
    border = COLORS.ERROR;
    bg = `${COLORS.ERROR}15`;
    circle = COLORS.ERROR;
    cBorder = COLORS.ERROR;
    cText = "#fff";
  } else if (feedback === "reveal") {
    border = COLORS.SUCCESS;
    bg = `${COLORS.SUCCESS}0A`;
    circle = COLORS.SUCCESS;
    cBorder = COLORS.SUCCESS;
    cText = "#fff";
  } else if (isSelected) {
    border = COLORS.PRIMARY;
    bg = `${COLORS.PRIMARY}0D`;
    circle = COLORS.PRIMARY;
    cBorder = COLORS.PRIMARY;
    cText = "#fff";
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
        // numberOfLines={3}
        style={{
          flex: 1,
          fontSize: 15,
          color: COLORS.TEXT_DARK,
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
