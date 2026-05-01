import { useGemificationSummary } from "@/src/features/dashboard/hook/useDashboard";
import { useTheme } from "@/src/theme";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BadgeGridItem } from "../components/BadgeGridItem";
import {
  BadgesFilterTabs,
  type BadgeFilter,
} from "../components/BadgesFilterTabs";
import { BadgesHeader } from "../components/BadgesHeader";
import { BadgesProgressCard } from "../components/BadgesProgressCard";
import { BadgesSkeleton } from "../components/BadgesSkeleton";
import { useUserBadges } from "../hook/useBadge";

export default function BadgesScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { palette } = useTheme();
  const [filter, setFilter] = useState<BadgeFilter>("all");

  const { data: badges, isPending, isError, refetch } = useUserBadges();
  const { data: summary, isError: summaryError } = useGemificationSummary();

  const streak = summaryError ? 0 : (summary?.streak?.currentStreak ?? 0);
  const totalXp = summaryError ? 0 : (summary?.progress?.totalXp ?? 0);

  const activeBadges = useMemo(
    () => (badges ?? []).filter((b) => b.isActive),
    [badges]
  );

  const earnedCount = useMemo(
    () => activeBadges.filter((b) => b.isEarned).length,
    [activeBadges]
  );
  const totalCount = activeBadges.length;
  const progress = totalCount > 0 ? earnedCount / totalCount : 0;

  const filtered = useMemo(() => {
    if (filter === "all") return activeBadges;
    if (filter === "unlocked") return activeBadges.filter((b) => b.isEarned);
    return activeBadges.filter((b) => !b.isEarned);
  }, [activeBadges, filter]);

  const showSkeleton = isPending;

  return (
    <View
      className="flex-1"
      style={{ paddingTop: insets.top, backgroundColor: palette.background }}
    >
      <BadgesHeader />

      {showSkeleton ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        >
          <BadgesSkeleton />
        </ScrollView>
      ) : isError || !badges ? (
        <View className="flex-1 items-center justify-center px-6 pb-16">
          <Text
            className="text-center text-base font-semibold"
            style={{ color: palette.muted }}
          >
            {t("badges_not_loaded")}
          </Text>
          <Pressable
            onPress={() => refetch()}
            className="mt-4 rounded-2xl px-5 py-2.5"
            style={{ backgroundColor: `${palette.primary}18` }}
          >
            <Text
              className="text-sm font-extrabold"
              style={{ color: palette.primary }}
            >
              {t("try_again_badge")}
            </Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        >
          <BadgesProgressCard
            totalXp={totalXp}
            currentStreak={streak}
            earnedCount={earnedCount}
            totalCount={totalCount}
            progress={progress}
          />
          <BadgesFilterTabs value={filter} onChange={setFilter} />

          {filtered.length === 0 ? (
            <View className="items-center px-6 py-8">
              <Text
                className="text-center text-sm"
                style={{ color: palette.muted }}
              >
                {filter === "all"
                  ? t("no_badges_available")
                  : filter === "unlocked"
                    ? t("no_unlocked_badges_available")
                    : t("all_badges_unlocked")}
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between px-4 pb-4">
              {filtered.map((b) => (
                <View key={b.id} className="mb-3" style={{ width: "48%" }}>
                  <BadgeGridItem badge={b} currentStreak={streak} />
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
