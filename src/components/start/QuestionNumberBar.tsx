import {
  COLORS,
  QUESTION_BTN_GAP,
  QUESTION_BTN_SIZE,
  SCREEN_WIDTH,
} from "@/src/features/practice/constants/theme";
import type {
  SubmitAnswerResult,
  TestResponse,
} from "@/src/features/practice/types/practice.types";
import { useTheme } from "@/src/theme";
import React, { useEffect, useMemo, useRef } from "react";
import { Pressable, ScrollView, Text } from "react-native";

type QStatus = "unanswered" | "correct" | "incorrect" | "active";

function getQStatus(
  r: TestResponse,
  idx: number,
  currentIdx: number,
  results: Record<string, SubmitAnswerResult>
): QStatus {
  const res = results[r.questionId];
  if (res) return res.isCorrect ? "correct" : "incorrect";
  if (r.selectedAnswerId != null) return r.isCorrect ? "correct" : "incorrect";
  if (idx === currentIdx) return "active";
  return "unanswered";
}

interface QuestionNumberBarProps {
  responses: TestResponse[];
  currentIndex: number;
  results: Record<string, SubmitAnswerResult>;
  onPress: (index: number) => void;
}

export function QuestionNumberBar({
  responses,
  currentIndex,
  results,
  onPress,
}: QuestionNumberBarProps) {
  const { palette } = useTheme();
  const ref = useRef<ScrollView>(null);

  const STATUS_STYLE = useMemo<
    Record<QStatus, { bg: string; text: string; border: string }>
  >(
    () => ({
      active: {
        bg: palette.primary,
        text: palette.switchThumb,
        border: palette.primary,
      },
      correct: {
        bg: COLORS.SUCCESS,
        text: "#fff",
        border: COLORS.SUCCESS,
      },
      incorrect: {
        bg: COLORS.ERROR,
        text: "#fff",
        border: COLORS.ERROR,
      },
      unanswered: {
        bg: palette.iconSurface,
        text: palette.muted,
        border: palette.border,
      },
    }),
    [palette]
  );

  useEffect(() => {
    const offset =
      currentIndex * (QUESTION_BTN_SIZE + QUESTION_BTN_GAP) -
      SCREEN_WIDTH / 2 +
      QUESTION_BTN_SIZE / 2 +
      16;
    ref.current?.scrollTo({ x: Math.max(0, offset), animated: true });
  }, [currentIndex]);

  return (
    <ScrollView
      ref={ref}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 8,
        paddingBottom: 16,
        gap: QUESTION_BTN_GAP,
      }}
    >
      {responses.map((r, i) => {
        const st = getQStatus(r, i, currentIndex, results);
        const c = STATUS_STYLE[st];
        const isCurrent = i === currentIndex;
        return (
          <Pressable
            key={r.id}
            onPress={() => onPress(i)}
            style={{
              width: QUESTION_BTN_SIZE,
              height: QUESTION_BTN_SIZE,
              borderRadius: QUESTION_BTN_SIZE / 2,
              backgroundColor: c.bg,
              borderWidth: isCurrent && st !== "active" ? 2.5 : 1.5,
              borderColor:
                isCurrent && st !== "active" ? palette.primary : c.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: "700", color: c.text }}>
              {r.questionOrder}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
