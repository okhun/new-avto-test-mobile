import { stripThemeInlineStyles } from "@/src/features/knowledge-base/utils/parseKnowledgeRefs";
import type { KnowledgeDetail } from "@/src/features/knowledge-base/types/knowledge-base.types";
import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Text, useWindowDimensions, View } from "react-native";
import RenderHTML from "react-native-render-html";

const TYPE_I18N: Record<string, string> = {
  "road-sign": "knowledge.sections.road_signs",
  "road-marking": "knowledge.sections.road_markings",
  "additional-plate": "knowledge.sections.additional_plates",
};

type Props = {
  detail: KnowledgeDetail;
};

export function KnowledgeReferenceContent({ detail }: Props) {
  const { t } = useTranslation();
  const { palette, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const bodyColor = isDark ? "#cbd5e1" : "#475569";
  const description = useMemo(
    () => stripThemeInlineStyles(detail.description ?? ""),
    [detail.description],
  );
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(description);
  const typeLabel = t(TYPE_I18N[detail.type] ?? detail.type);

  return (
    <View>
      {detail.imageUrl ? (
        <View className="mb-3 items-center">
          <Image
            source={{ uri: detail.imageUrl }}
            style={{ width: 160, height: 160 }}
            contentFit="contain"
          />
        </View>
      ) : null}

      <View className="mb-2 flex-row flex-wrap items-center gap-2">
        <View
          className="rounded-full px-2 py-0.5"
          style={{ backgroundColor: `${palette.primary}18` }}
        >
          <Text
            className="text-[11px] font-semibold uppercase"
            style={{ color: palette.primary }}
          >
            {typeLabel}
          </Text>
        </View>
        <Text
          className="text-sm font-semibold"
          style={{ color: palette.foreground, fontFamily: "Menlo" }}
        >
          {detail.code}
        </Text>
      </View>

      {detail.title ? (
        <Text
          className="mb-3 text-base font-medium"
          style={{ color: palette.foreground }}
        >
          {detail.title}
        </Text>
      ) : null}

      {description ? (
        isHtml ? (
          <RenderHTML
            contentWidth={Math.max(0, width - 64)}
            source={{ html: description }}
            ignoredStyles={["color", "backgroundColor"]}
            baseStyle={{
              color: bodyColor,
              fontSize: 14,
              lineHeight: 21,
            }}
            tagsStyles={{
              p: { marginTop: 0, marginBottom: 8, color: bodyColor },
            }}
          />
        ) : (
          <Text className="text-sm leading-relaxed" style={{ color: bodyColor }}>
            {description}
          </Text>
        )
      ) : (
        <Text className="text-sm" style={{ color: palette.muted }}>
          {t("knowledge.no_description")}
        </Text>
      )}

      <View className="mt-3 flex-row items-center gap-1.5">
        <MaterialIcons name="menu-book" size={16} color={palette.muted} />
        <Text className="text-xs font-medium" style={{ color: palette.muted }}>
          {t("knowledge.used_in_questions", {
            count: detail.relatedQuestionCount ?? 0,
          })}
        </Text>
      </View>
    </View>
  );
}
