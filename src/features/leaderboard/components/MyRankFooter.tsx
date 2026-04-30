import { resolveAvatarUrl } from "@/src/features/auth/utils/avatarUrl";
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
  const uri = resolveAvatarUrl(avatarUrl);
  const rankLabel = formatRankDisplay(rank);
  const xpLabel = formatLeaderboardXp(totalXp);

  return (
    <View
      className="flex-row items-center overflow-hidden rounded-3xl bg-amber-400 px-3 py-3"
      style={{
        shadowColor: "#0f172a",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <View
        className="h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: "rgba(180, 83, 9, 0.25)" }}
      >
        {loading ? (
          <ActivityIndicator color="#0f172a" size="small" />
        ) : (
          <Text
            className="text-sm font-extrabold text-slate-900"
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {rankLabel}
          </Text>
        )}
      </View>
      <View className="ml-2.5 h-12 w-12 overflow-hidden rounded-full border-2 border-amber-600/30 bg-amber-100">
        {uri ? (
          <Image
            source={{ uri }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View className="h-full w-full items-center justify-center bg-amber-200/80" />
        )}
      </View>
      <View className="min-w-0 flex-1 pl-2.5">
        <Text
          className="text-sm font-extrabold text-slate-900"
          numberOfLines={1}
        >
          {displayName}
        </Text>
        <Text className="mt-0.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-800">
          {t("leaderboard_page.your_rank")}
        </Text>
      </View>
      <View className="items-end pl-1">
        <Text className="text-base font-extrabold text-slate-900">
          {xpLabel}
        </Text>
        <Text className="mt-0.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-800">
          {t("total_xp")}
        </Text>
      </View>
    </View>
  );
}
