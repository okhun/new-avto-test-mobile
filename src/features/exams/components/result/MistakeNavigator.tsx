import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";

const SUCCESS = "#22c55e";
const ERROR = "#ef4444";
const NEUTRAL_DOT = "#94a3b8";

export type NavigatorItem = {
  order: number;
  isMistake: boolean;
  isAnswered: boolean;
};

type Props = {
  items: NavigatorItem[];
  mistakeCount: number;
  onSelectOrder: (order: number) => void;
};

export function MistakeNavigator({
  items,
  mistakeCount,
  onSelectOrder,
}: Props) {
  const { t } = useTranslation();
  const { palette, isDark } = useTheme();

  const pillStyles = (it: NavigatorItem) => {
    if (it.isMistake) {
      return {
        bg: isDark ? "rgba(239, 68, 68, 0.22)" : "#fee2e2",
        border: isDark ? "rgba(248, 113, 113, 0.45)" : "#fecaca",
        fg: isDark ? "#fca5a5" : "#b91c1c",
      };
    }
    if (it.isAnswered) {
      return {
        bg: isDark ? "rgba(34, 197, 94, 0.2)" : "#dcfce7",
        border: isDark ? "rgba(74, 222, 128, 0.4)" : "#bbf7d0",
        fg: isDark ? "#86efac" : "#166534",
      };
    }
    return {
      bg: palette.iconSurface,
      border: palette.border,
      fg: palette.muted,
    };
  };

  return (
    <View
      className="rounded-2xl border p-4"
      style={{
        backgroundColor: palette.card,
        borderColor: palette.border,
      }}
    >
      <View className="mb-3 flex-row items-center justify-between">
        <Text
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: palette.chevron }}
        >
          {t("questions")}
        </Text>
        {mistakeCount > 0 ? (
          <View className="flex-row items-center gap-1">
            <MaterialIcons name="error-outline" size={16} color={ERROR} />
            <Text
              className="text-xs font-semibold"
              style={{ color: palette.dangerForeground }}
            >
              {mistakeCount} {t("wrong")}
            </Text>
          </View>
        ) : (
          <Text className="text-xs font-semibold" style={{ color: SUCCESS }}>
            {t("no_mistakes")}
          </Text>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 4 }}
      >
        {items.map((it) => {
          const ps = pillStyles(it);
          return (
            <Pressable
              key={it.order}
              onPress={() => onSelectOrder(it.order)}
              className="h-10 min-w-[40px] items-center justify-center rounded-lg border px-2"
              style={{
                marginRight: 8,
                backgroundColor: ps.bg,
                borderColor: ps.border,
              }}
            >
              <Text className="text-sm font-bold" style={{ color: ps.fg }}>
                {it.order}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View
        className="mt-4 flex-row flex-wrap gap-x-4 gap-y-2 border-t pt-3"
        style={{ borderTopColor: palette.divider }}
      >
        <LegendDot color={SUCCESS} label={t("correct")} muted={palette.muted} />
        <LegendDot color={ERROR} label={t("wrong")} muted={palette.muted} />
        <LegendDot
          color={NEUTRAL_DOT}
          label={t("not_answered")}
          muted={palette.muted}
        />
      </View>
    </View>
  );
}

function LegendDot({
  color,
  label,
  muted,
}: {
  color: string;
  label: string;
  muted: string;
}) {
  return (
    <View className="flex-row items-center gap-1.5">
      <View
        className="h-2.5 w-2.5 rounded-sm"
        style={{ backgroundColor: color }}
      />
      <Text className="text-[10px] font-semibold" style={{ color: muted }}>
        {label}
      </Text>
    </View>
  );
}
