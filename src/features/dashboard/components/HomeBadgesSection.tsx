import { useTheme } from "@/src/theme";
import { API_CONFIG } from "@/src/utils/constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, ScrollView, Text, View } from "react-native";
import type { UserBadge } from "../types/dashboard.types";

type Props = {
  badges: UserBadge[];
};

function badgeIconUri(iconUrl: string | null | undefined): string | undefined {
  if (!iconUrl?.trim()) return undefined;
  const u = iconUrl.trim();
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  const base = API_CONFIG.API_URL.replace(/\/$/, "");
  return u.startsWith("/") ? `${base}${u}` : `${base}/${u}`;
}

export function HomeBadgesSection({ badges }: Props) {
  const { t } = useTranslation();
  const { palette, isDark } = useTheme();
  const countPill = isDark
    ? { bg: "rgba(245,158,11,0.22)", text: "#fbbf24" as const }
    : { bg: "#fef3c7", text: "#92400e" as const };

  if (!badges.length) {
    return (
      <View className="px-5 py-2">
        <Text
          className="text-lg font-extrabold tracking-tight"
          style={{ color: palette.foreground }}
        >
          {t("badges")}
        </Text>
        <View
          className="mt-2 rounded-2xl border border-dashed px-4 py-6"
          style={{
            borderColor: palette.border,
            backgroundColor: palette.surfacePressed,
          }}
        >
          <Text
            className="text-center text-sm"
            style={{ color: palette.muted }}
          >
            {t("no_badges")}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mt-2 py-2">
      <View className="mb-2 flex-row items-center justify-between px-5">
        <Text
          className="text-lg font-extrabold tracking-tight"
          style={{ color: palette.foreground }}
        >
          {t("badges")}
        </Text>
        <View
          className="rounded-full px-2.5 py-0.5"
          style={{ backgroundColor: countPill.bg }}
        >
          <Text className="text-xs font-bold" style={{ color: countPill.text }}>
            {badges.length}
          </Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: 20,
          paddingRight: 12,
          paddingVertical: 4,
        }}
      >
        {badges.slice(0, 12).map((ub) => {
          const uri = badgeIconUri(ub.badge?.iconUrl);
          const isNew = ub.isNew;
          return (
            <View key={ub.id} className="mr-3 w-[100px] items-center">
              <View
                className="mb-2 h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-[20px] border"
                style={{
                  borderColor: palette.border,
                  backgroundColor: palette.card,
                  shadowColor: palette.shadow,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: palette.cardShadowOpacity + 0.01,
                  shadowRadius: 6,
                  elevation: 2,
                }}
              >
                {uri ? (
                  <Image
                    source={{ uri }}
                    className="h-12 w-12"
                    resizeMode="contain"
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="medal"
                    size={32}
                    color={palette.primary}
                  />
                )}
                {isNew ? (
                  <View className="absolute right-1 top-1 rounded bg-amber-500 px-1">
                    <Text className="text-[8px] font-bold text-white">
                      {t("new")}
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text
                className="text-center text-[11px] font-bold"
                style={{ color: palette.foreground }}
                numberOfLines={2}
              >
                {t(`badge.${ub.badge?.type}`) ?? t("badge")}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
