import { useTheme } from "@/src/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { useUserBadges } from "../hook/useBadge";
import { fallbackIconNameForType, resolveBadgeIconUrl } from "../utils/badgeUi";

export function ProfileBadgesPreview() {
  const { t } = useTranslation();
  const router = useRouter();
  const { palette } = useTheme();
  const { data: badges, isPending } = useUserBadges();

  const { earned, total, preview } = useMemo(() => {
    const list = badges?.filter((b) => b.isActive) ?? [];
    const e = list.filter((b) => b.isEarned).length;
    const previewList = list.filter((b) => b.isEarned).slice(0, 4);
    return { earned: e, total: list.length, preview: previewList };
  }, [badges]);

  if (isPending) {
    return (
      <View
        className="mb-4 h-20 items-center justify-center rounded-2xl"
        style={{ backgroundColor: palette.iconSurface }}
      >
        <ActivityIndicator color={palette.primary} size="small" />
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => router.push("/badges")}
      className="mb-2 rounded-2xl border p-4 active:opacity-90"
      style={{
        borderColor: palette.border,
        backgroundColor: palette.iconSurface,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="min-w-0 flex-1 pr-2">
          <View className="flex-row items-center gap-1.5">
            <MaterialIcons
              name="military-tech"
              size={20}
              color={palette.primary}
            />
            <Text
              className="text-base font-extrabold"
              style={{ color: palette.foreground }}
            >
              {t("badges_page.title")}
            </Text>
          </View>
          <Text
            className="mt-0.5 text-xs font-medium lowercase"
            style={{ color: palette.muted }}
          >
            {earned} / {total} {t("badges_page.filter_earned")}
          </Text>
        </View>

        <View className="flex-row items-center gap-1.5 pr-1">
          {preview.length === 0
            ? [0, 1, 2, 3].map((k) => (
                <View
                  key={k}
                  className="h-9 w-9 items-center justify-center overflow-hidden rounded-full border"
                  style={{
                    borderColor: palette.border,
                    backgroundColor: palette.card,
                  }}
                >
                  <MaterialIcons
                    name="military-tech"
                    size={16}
                    color={palette.chevron}
                  />
                </View>
              ))
            : preview.map((b) => {
                const uri = resolveBadgeIconUrl(b.iconUrl);
                const fall = fallbackIconNameForType(
                  b.type
                ) as keyof typeof MaterialCommunityIcons.glyphMap;
                return (
                  <View
                    key={b.id}
                    className="h-9 w-9 items-center justify-center overflow-hidden rounded-full border"
                    style={{
                      borderColor: palette.border,
                      backgroundColor: palette.card,
                      shadowColor: palette.shadow,
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: palette.cardShadowOpacity + 0.01,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  >
                    {uri ? (
                      <Image
                        source={{ uri }}
                        className="h-7 w-7"
                        resizeMode="contain"
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name={fall}
                        size={20}
                        color={palette.primary}
                      />
                    )}
                  </View>
                );
              })}
          <MaterialIcons
            name="chevron-right"
            size={22}
            color={palette.chevron}
          />
        </View>
      </View>
    </Pressable>
  );
}
