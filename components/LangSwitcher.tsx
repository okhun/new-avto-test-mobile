import clsx from "clsx";
import * as Haptics from "expo-haptics";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, Text, View } from "react-native";

import { useTheme } from "@/src/theme";

type Lang = "uz" | "uz-Cyrl" | "ru";

interface LangSwitcherProps {
  className?: string;
}

const LANGS: { key: Lang; label: string; a11y: string }[] = [
  { key: "uz", label: "Oʻzbek", a11y: "Oʻzbek lotin alifbosi" },
  { key: "uz-Cyrl", label: "Ўзбек", a11y: "Ўзбек кирилл алфбети" },
  { key: "ru", label: "Рус", a11y: "Рус тили" },
];

function resolveActiveLang(code: string): Lang {
  const c = (code || "uz").toLowerCase();
  if (c === "ru" || c.startsWith("ru-")) return "ru";
  if (c === "uz-cyrl" || c.includes("cyrl")) return "uz-Cyrl";
  return "uz";
}

export default function LangSwitcher({ className }: LangSwitcherProps) {
  const { i18n } = useTranslation();
  const { palette } = useTheme();

  const currentLang = useMemo(
    () => resolveActiveLang(i18n.resolvedLanguage ?? i18n.language),
    [i18n.resolvedLanguage, i18n.language]
  );

  const changeLang = (lang: Lang) => {
    if (lang === currentLang) return;
    void i18n.changeLanguage(lang);
    if (Platform.OS !== "web") {
      void Haptics.selectionAsync();
    }
  };

  return (
    <View
      className={clsx("w-full max-w-sm flex-row rounded-2xl p-1", className)}
      style={{
        backgroundColor: palette.iconSurface,
        borderWidth: 1,
        borderColor: palette.border,
      }}
      accessibilityRole="radiogroup"
      accessibilityLabel="Ilova tili"
    >
      {LANGS.map((lang) => {
        const isActive = currentLang === lang.key;

        return (
          <Pressable
            key={lang.key}
            onPress={() => changeLang(lang.key)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={lang.a11y}
            hitSlop={{ top: 4, bottom: 4, left: 0, right: 0 }}
            className="min-w-0 flex-1 items-center justify-center overflow-hidden rounded-xl py-2.5 active:opacity-80"
            style={
              isActive
                ? {
                    backgroundColor: palette.card,
                    shadowColor: palette.shadow,
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: palette.cardShadowOpacity,
                    shadowRadius: 3,
                    elevation: 2,
                  }
                : undefined
            }
          >
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
              className="text-center text-[13px] font-extrabold tracking-tight"
              style={{
                color: isActive ? palette.primary : palette.muted,
              }}
            >
              {lang.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
