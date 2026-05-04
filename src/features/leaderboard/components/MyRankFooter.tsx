import { resolveAvatarUrl } from "@/src/features/auth/utils/avatarUrl";
import { useTheme } from "@/src/theme";
import React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Image, Text, View } from "react-native";

import { formatLeaderboardXp, formatRankDisplay } from "../utils/leaderboardUi";

type Props = {
  displayName: string;
  avatarUrl: string | null | undefined;
  rank: number | null;
  totalXp: number | null;
  loading?: boolean;
};

export function MyRankFooter({
  displayName,
  avatarUrl,
  rank,
  totalXp,
  loading,
}: Props) {
  const { t } = useTranslation();
  const { palette, isDark } = useTheme();
  const uri = resolveAvatarUrl(avatarUrl);
  const rankLabel = formatRankDisplay(rank);
  const xpLabel = formatLeaderboardXp(totalXp);

  const barBg = isDark ? "rgba(245, 158, 11, 0.90)" : "#fbbf24";
  const badgeBg = isDark
    ? "rgba(254, 243, 199, 0.12)"
    : "rgba(180, 83, 9, 0.25)";
  const primaryText = isDark ? "#fef9c3" : "#0f172a";
  const secondaryText = isDark ? "#fde68a" : "#1e293b";
  const avatarBorder = isDark
    ? "rgba(251, 191, 36, 0.45)"
    : "rgba(217, 119, 6, 0.3)";
  const avatarFallback = isDark
    ? "rgba(251, 191, 36, 0.2)"
    : "rgba(251, 191, 36, 0.8)";

  return (
    <View
      className="flex-row items-center overflow-hidden rounded-3xl px-3 py-3"
      style={{
        backgroundColor: barBg,
        borderWidth: isDark ? 1 : 0,
        borderColor: palette.border,
        shadowColor: palette.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.35 : palette.cardShadowOpacity * 2,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <View
        className="h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: badgeBg }}
      >
        {loading ? (
          <ActivityIndicator color={palette.primary} size="small" />
        ) : (
          <Text
            className="text-sm font-extrabold"
            style={{ color: primaryText }}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {rankLabel}
          </Text>
        )}
      </View>
      <View
        className="ml-2.5 h-12 w-12 overflow-hidden rounded-full border-2"
        style={{
          borderColor: avatarBorder,
          backgroundColor: isDark ? palette.card : "rgba(254, 243, 199, 0.6)",
        }}
      >
        {uri ? (
          <Image
            source={{ uri }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View
            className="h-full w-full"
            style={{ backgroundColor: avatarFallback }}
          />
        )}
      </View>
      <View className="min-w-0 flex-1 pl-2.5">
        <Text
          className="text-sm font-extrabold"
          style={{ color: primaryText }}
          numberOfLines={1}
        >
          {displayName}
        </Text>
        <Text
          className="mt-0.5 text-[9px] font-extrabold uppercase tracking-wider"
          style={{ color: secondaryText }}
        >
          {t("leaderboard_page.your_rank")}
        </Text>
      </View>
      <View className="items-end pl-1">
        <Text
          className="text-base font-extrabold"
          style={{ color: primaryText }}
        >
          {xpLabel}
        </Text>
        <Text
          className="mt-0.5 text-[9px] font-extrabold uppercase tracking-wider"
          style={{ color: secondaryText }}
        >
          {t("total_xp")}
        </Text>
      </View>
    </View>
  );
}
