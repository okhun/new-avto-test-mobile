import { ImagePreview } from "@/src/components/ui/ImagePreview";
import {
  ANSWER_LABELS,
  SCREEN_WIDTH,
} from "@/src/features/practice/constants/theme";
import type { Answer } from "@/src/features/practice/types/practice.types";
import { useTheme } from "@/src/theme";
import { API_CONFIG } from "@/src/utils/constants";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

const SUCCESS = "#22c55e";
const ERROR = "#ef4444";
const IMAGE_HEIGHT = (SCREEN_WIDTH - 32) * (9 / 16);
type Props = {
  questionOrder: number;
  questionText: string;
  imageUrl: string | null;
  answers: Answer[];
  selectedAnswerId: string | null;
  isCorrect: boolean | null;
  explanation: string;
};

export function ExamResultQuestionCard({
  questionOrder,
  questionText,
  imageUrl,
  answers,
  selectedAnswerId,
  isCorrect,
  explanation,
}: Props) {
  const { t } = useTranslation();
  const { palette, isDark } = useTheme();
  const sorted = useMemo(
    () => [...answers].sort((a, b) => a.displayOrder - b.displayOrder),
    [answers]
  );

  const uri = imageUrl ? `${API_CONFIG.API_URL}/images/${imageUrl}.webp` : null;

  const neutralBadgeBg = isDark ? palette.iconSurface : "#f1f5f9";

  const explBg = isDark
    ? "rgba(245, 158, 11, 0.14)"
    : "rgba(255, 251, 235, 0.92)";
  const explBorder = isDark ? "rgba(251, 191, 36, 0.35)" : "#fde68a";
  const explIcon = isDark ? "#fbbf24" : "#d97706";
  const explTitle = isDark ? "#fcd34d" : "#92400e";
  const explBody = isDark ? "#fef3c7" : "#78350f";

  return (
    <View
      className="mb-4 overflow-hidden rounded-2xl border"
      style={{
        borderColor: palette.border,
        backgroundColor: palette.card,
        elevation: 1,
      }}
    >
      <View
        className="border-b px-4 py-3"
        style={{ borderBottomColor: palette.divider }}
      >
        <View className="flex-row items-center justify-between gap-2">
          <View
            className="rounded-full px-2.5 py-0.5"
            style={{
              backgroundColor:
                isCorrect === true
                  ? `${SUCCESS}18`
                  : isCorrect === false
                    ? `${ERROR}18`
                    : neutralBadgeBg,
            }}
          >
            <Text
              className="text-xs font-bold"
              style={{
                color:
                  isCorrect === true
                    ? SUCCESS
                    : isCorrect === false
                      ? ERROR
                      : palette.muted,
              }}
            >
              {t("question")} {questionOrder}
            </Text>
          </View>
          {isCorrect === true && (
            <MaterialIcons name="check-circle" size={22} color={SUCCESS} />
          )}
          {isCorrect === false && (
            <MaterialIcons name="cancel" size={22} color={ERROR} />
          )}
        </View>
        <Text
          className="mt-2 text-base font-bold leading-snug"
          style={{ color: palette.foreground }}
        >
          {questionText}
        </Text>
      </View>

      <View className="px-4 py-4">
        {uri ? (
          <View className="mb-4">
            <ImagePreview
              uri={uri}
              width={SCREEN_WIDTH - 68}
              height={IMAGE_HEIGHT}
            />
          </View>
        ) : null}

        <View className="gap-2.5">
          {sorted.map((a, i) => {
            const label = ANSWER_LABELS[i] ?? String(i + 1);
            const isSelected = selectedAnswerId === a.id;
            const showCorrect = a.isCorrect;
            const showWrongSelection = isSelected && !a.isCorrect;

            let borderColor = palette.border;
            let bg = isDark ? `${palette.iconSurface}99` : "#fafafa";
            let labelColor = palette.foreground;

            if (showCorrect) {
              borderColor = SUCCESS;
              bg = `${SUCCESS}12`;
              labelColor = isDark ? "#86efac" : "#166534";
            } else if (showWrongSelection) {
              borderColor = ERROR;
              bg = `${ERROR}12`;
              labelColor = isDark ? "#fca5a5" : "#b91c1c";
            } else if (isSelected) {
              borderColor = palette.border;
              bg = isDark ? palette.surfacePressed : "#f8fafc";
            }

            return (
              <View
                key={a.id}
                className="flex-row gap-3 rounded-xl border-2 px-3 py-3"
                style={{ borderColor, backgroundColor: bg }}
              >
                {/* <View
                  className="h-8 w-8 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: showCorrect
                      ? SUCCESS
                      : showWrongSelection
                        ? ERROR
                        : palette.radioOff,
                  }}
                >
                  <Text
                    className="text-sm font-bold"
                    style={{ color: palette.switchThumb }}
                  >
                    {label}
                  </Text>
                </View> */}
                <Text
                  className="min-w-0 flex-1 text-[15px] font-semibold leading-snug"
                  style={{ color: labelColor }}
                >
                  {a.text}
                </Text>
              </View>
            );
          })}
        </View>

        {explanation ? (
          <View
            className="mt-4 rounded-xl border px-3 py-3"
            style={{
              backgroundColor: explBg,
              borderColor: explBorder,
            }}
          >
            <View className="mb-1 flex-row items-center gap-1">
              <MaterialIcons
                name="lightbulb-outline"
                size={18}
                color={explIcon}
              />
              <Text
                className="text-xs font-bold uppercase"
                style={{ color: explTitle }}
              >
                {t("explanation")}
              </Text>
            </View>
            <Text
              className="text-sm leading-relaxed"
              style={{ color: explBody }}
            >
              {explanation}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
