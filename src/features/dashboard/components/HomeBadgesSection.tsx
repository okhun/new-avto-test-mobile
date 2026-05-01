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
  if (!badges.length) {
    return (
      <View className="px-5 py-2">
        <Text className="text-lg font-extrabold tracking-tight text-slate-900">
          {t("badges")}
        </Text>
        <View className="mt-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-6">
          <Text className="text-center text-sm text-slate-500">
            {t("no_badges")}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mt-2 py-2">
      <View className="mb-2 flex-row items-center justify-between px-5">
        <Text className="text-lg font-extrabold tracking-tight text-slate-900">
          {t("badges")}
        </Text>
        <View className="rounded-full bg-amber-100 px-2.5 py-0.5">
          <Text className="text-xs font-bold text-amber-800">
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
                className="mb-2 h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-[20px] border border-slate-100 bg-white"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
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
                    color="#137fec"
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
                className="text-center text-[11px] font-bold text-slate-700"
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
