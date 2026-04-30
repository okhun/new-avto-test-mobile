import { ANSWER_LABELS } from "@/src/features/practice/constants/theme";
import type { Answer } from "@/src/features/practice/types/practice.types";
import { API_CONFIG } from "@/src/utils/constants";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, View } from "react-native";
const TEXT_DARK = "#0f172a";
const SUCCESS = "#22c55e";
const ERROR = "#ef4444";
const MUTED = "#64748b";

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
  const sorted = useMemo(
    () => [...answers].sort((a, b) => a.displayOrder - b.displayOrder),
    [answers]
  );

  const uri = imageUrl ? `${API_CONFIG.API_URL}/images/${imageUrl}.webp` : null;

  return (
    <View
      className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white"
      style={{ elevation: 1 }}
    >
      <View className="border-b border-slate-100 px-4 py-3">
        <View className="flex-row items-center justify-between gap-2">
          <View
            className="rounded-full px-2.5 py-0.5"
            style={{
              backgroundColor:
                isCorrect === true
                  ? `${SUCCESS}18`
                  : isCorrect === false
                    ? `${ERROR}18`
                    : "#f1f5f9",
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
                      : MUTED,
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
          style={{ color: TEXT_DARK }}
        >
          {questionText}
        </Text>
      </View>

      <View className="px-4 py-4">
        {uri ? (
          <Image
            source={{ uri }}
            className="mb-4 w-full rounded-xl bg-slate-100"
            style={{ aspectRatio: 16 / 9 }}
            resizeMode="contain"
          />
        ) : null}

        <View className="gap-2.5">
          {sorted.map((a, i) => {
            const label = ANSWER_LABELS[i] ?? String(i + 1);
            const isSelected = selectedAnswerId === a.id;
            const showCorrect = a.isCorrect;
            const showWrongSelection = isSelected && !a.isCorrect;

            let borderColor = "#e2e8f0";
            let bg = "#fafafa";
            let labelColor = TEXT_DARK;

            if (showCorrect) {
              borderColor = SUCCESS;
              bg = `${SUCCESS}12`;
              labelColor = "#166534";
            } else if (showWrongSelection) {
              borderColor = ERROR;
              bg = `${ERROR}12`;
              labelColor = "#b91c1c";
            } else if (isSelected) {
              borderColor = "#cbd5e1";
              bg = "#f8fafc";
            }

            return (
              <View
                key={a.id}
                className="flex-row gap-3 rounded-xl border-2 px-3 py-3"
                style={{ borderColor, backgroundColor: bg }}
              >
                <View
                  className="h-8 w-8 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: showCorrect
                      ? SUCCESS
                      : showWrongSelection
                        ? ERROR
                        : "#e2e8f0",
                  }}
                >
                  <Text className="text-sm font-bold text-white">{label}</Text>
                </View>
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
          <View className="mt-4 rounded-xl border border-amber-100 bg-amber-50/80 px-3 py-3">
            <View className="mb-1 flex-row items-center gap-1">
              <MaterialIcons
                name="lightbulb-outline"
                size={18}
                color="#d97706"
              />
              <Text className="text-xs font-bold uppercase text-amber-800">
                {t("explanation")}
              </Text>
            </View>
            <Text className="text-sm leading-relaxed text-amber-950/90">
              {explanation}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
