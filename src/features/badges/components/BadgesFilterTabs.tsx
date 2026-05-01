import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/src/theme";

export type BadgeFilter = "all" | "unlocked" | "locked";

type Props = {
  value: BadgeFilter;
  onChange: (v: BadgeFilter) => void;
};

export function BadgesFilterTabs({ value, onChange }: Props) {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const TABS: { id: BadgeFilter; label: string }[] = [
    { id: "all", label: t("badges_page.filter_all") },
    { id: "unlocked", label: t("badges_page.filter_earned") },
    { id: "locked", label: t("badges_page.filter_locked") },
  ];

  return (
    <View className="mb-2 flex-row gap-2 px-4">
      {TABS.map((tab) => {
        const active = value === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onChange(tab.id)}
            className="min-w-0 flex-1 items-center justify-center rounded-2xl py-2.5"
            style={{
              backgroundColor: active ? palette.primary : palette.radioOff,
            }}
          >
            <Text
              className="text-center text-xs font-extrabold"
              numberOfLines={1}
              style={{
                color: active ? palette.switchThumb : palette.muted,
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
