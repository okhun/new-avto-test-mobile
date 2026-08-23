import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ExplanationHtml } from "@/src/components/knowledge-reference/ExplanationHtml";

const MAX_HEIGHT = Dimensions.get("window").height * 0.85;
const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;

type ExplanationContentProps = {
  explanation: string;
  legalRef?: string;
};

export function ExplanationContent({
  explanation,
  legalRef,
}: ExplanationContentProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const explBg = isDark
    ? "rgba(245, 158, 11, 0.14)"
    : "rgba(255, 251, 235, 0.92)";
  const explBorder = isDark ? "rgba(251, 191, 36, 0.35)" : "#fde68a";
  const explIcon = isDark ? "#fbbf24" : "#d97706";
  const explTitle = isDark ? "#fcd34d" : "#92400e";
  const explBody = isDark ? "#fef3c7" : "#78350f";

  if (!explanation) return null;

  const isHtml = HTML_TAG_PATTERN.test(explanation);

  return (
    <View
      className="rounded-2xl border p-4"
      style={{
        backgroundColor: explBg,
        borderColor: explBorder,
      }}
    >
      <View className="mb-3 flex-row items-center gap-2">
        <MaterialIcons name="lightbulb-outline" size={22} color={explIcon} />
        <Text className="text-base font-bold" style={{ color: explTitle }}>
          {t("explanation")}
        </Text>
      </View>
      {isHtml ? (
        <ExplanationHtml
          html={explanation}
          color={explBody}
          tagsStyles={{
            p: {
              marginTop: 0,
              marginBottom: 8,
              color: explBody,
              fontSize: 14,
              lineHeight: 21,
            },
            span: {
              color: explBody,
              fontSize: 14,
              lineHeight: 21,
            },
            strong: {
              color: explBody,
              fontWeight: "700",
            },
            b: {
              color: explBody,
              fontWeight: "700",
            },
            em: {
              color: explBody,
              fontStyle: "italic",
            },
            i: {
              color: explBody,
              fontStyle: "italic",
            },
            ul: {
              marginTop: 0,
              marginBottom: 8,
              color: explBody,
            },
            ol: {
              marginTop: 0,
              marginBottom: 8,
              color: explBody,
            },
            li: {
              color: explBody,
              fontSize: 14,
              lineHeight: 21,
            },
          }}
        />
      ) : (
        <Text className="text-sm leading-relaxed" style={{ color: explBody }}>
          {explanation}
        </Text>
      )}
      {legalRef ? (
        <View
          className="mt-4 flex-row flex-wrap items-center justify-between gap-2 border-t pt-4"
          style={{
            borderTopColor: isDark ? "rgba(251,191,36,0.25)" : "#fde68a",
          }}
        >
          <Text
            className="text-[11px] font-bold uppercase tracking-widest"
            style={{ color: isDark ? "#fbbf24" : "#b45309" }}
          >
            {t("explanation")}: {legalRef}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

type ExplanationDrawerProps = {
  visible: boolean;
  onClose: () => void;
  explanation: string;
  legalRef?: string;
};

export function ExplanationDrawer({
  visible,
  onClose,
  explanation,
  legalRef,
}: ExplanationDrawerProps) {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <Pressable
          style={StyleSheet.absoluteFill}
          className="bg-slate-900/40"
          accessibilityRole="button"
          accessibilityLabel={t("hide_explanation")}
          onPress={onClose}
        />

        <View
          className="rounded-t-3xl border border-b-0 shadow-lg"
          style={{
            maxHeight: MAX_HEIGHT,
            backgroundColor: palette.card,
            borderColor: palette.border,
            paddingBottom: Math.max(insets.bottom, 16),
          }}
        >
          <View className="relative px-4 pt-3">
            <View className="mb-2 items-center">
              <View
                className="h-1 w-10 rounded-full"
                style={{ backgroundColor: palette.border }}
              />
            </View>

            <Pressable
              onPress={onClose}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={t("hide_explanation")}
              className="absolute right-3 top-2 h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: palette.iconSurface }}
            >
              <MaterialIcons name="close" size={22} color={palette.muted} />
            </Pressable>
          </View>

          <ScrollView
            className="px-4 pt-6"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <ExplanationContent explanation={explanation} legalRef={legalRef} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
