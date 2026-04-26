import { useAuthStore } from "@/src/store/auth.store";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LeaderboardFilterTabs } from "../components/LeaderboardFilterTabs";
import { LeaderboardHeader } from "../components/LeaderboardHeader";
import { LeaderboardRankListItem } from "../components/LeaderboardRankListItem";
import { LeaderboardSkeleton } from "../components/LeaderboardSkeleton";
import { MyRankFooter } from "../components/MyRankFooter";
import { PodiumSection } from "../components/PodiumSection";
import { useLeaderboard, useMyRank } from "../hook/useLeaderBoard";
import {
  LeaderboardType,
  type LeaderboardEntry,
} from "../types/leaderboard.types";
import { getMyRankForType } from "../utils/leaderboardUi";

const PRIMARY = "#137fec";
const PAGE_LIMIT = 100;

export default function LeaderBoardScreen() {
  const insets = useSafeAreaInsets();
  const [type, setType] = useState(LeaderboardType.WEEKLY);
  const user = useAuthStore((s) => s.user);
  const displayName = user?.displayName?.trim() || "Foydalanuvchi";
  const avatarUrl = user?.avatarUrl;

  const {
    data: leaderboard,
    isPending: leaderboardPending,
    isError: leaderboardError,
    refetch,
  } = useLeaderboard({ type, limit: PAGE_LIMIT });
  const { data: myRank, isPending: myRankPending } = useMyRank();

  const { top, rest, allEntries } = useMemo(() => {
    const sorted = [...(leaderboard?.entries ?? [])].sort(
      (a, b) => a.rank - b.rank
    ) as LeaderboardEntry[];
    return {
      allEntries: sorted,
      top: sorted.slice(0, 3),
      rest: sorted.slice(3),
    };
  }, [leaderboard]);

  const meEntry = useMemo(
    () => (user?.id ? allEntries.find((e) => e.userId === user.id) : undefined),
    [allEntries, user?.id]
  );

  const myRankValue = useMemo(() => {
    const fromList = getMyRankForType(myRank, type);
    if (fromList != null) return fromList;
    const fallback = leaderboard?.currentUserRank;
    if (fallback != null && Number.isFinite(fallback) && fallback > 0) {
      return Math.round(fallback);
    }
    return null;
  }, [myRank, type, leaderboard?.currentUserRank]);

  const myTotalXp = meEntry != null ? meEntry.totalXp : null;
  const showFooter = Boolean(user);

  const showSkeleton = leaderboardPending;
  const showError = leaderboardError && !leaderboard;

  return (
    <View className="flex-1 bg-slate-50" style={{ paddingTop: insets.top }}>
      <View className="flex-1">
        <LeaderboardHeader />
        <LeaderboardFilterTabs value={type} onChange={setType} />

        {showSkeleton ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: insets.bottom + (showFooter ? 120 : 24),
            }}
          >
            <LeaderboardSkeleton />
          </ScrollView>
        ) : showError ? (
          <View className="flex-1 items-center justify-center px-6 pb-24">
            <Text className="text-center text-base font-semibold text-slate-600">
              Reytingni yuklab bo&apos;lmadi.
            </Text>
            <Pressable
              onPress={() => refetch()}
              className="mt-4 rounded-2xl px-5 py-2.5"
              style={{ backgroundColor: `${PRIMARY}18` }}
            >
              <Text
                className="text-sm font-extrabold"
                style={{ color: PRIMARY }}
              >
                Qayta urinish
              </Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: insets.bottom + (showFooter ? 120 : 24),
            }}
            keyboardShouldPersistTaps="handled"
          >
            {allEntries.length === 0 ? (
              <View className="mt-4 items-center px-6">
                <Text className="text-center text-sm text-slate-500">
                  Bu davrda hali reyting yo&apos;q.
                </Text>
              </View>
            ) : (
              <>
                {top.length > 0 ? <PodiumSection entries={top} /> : null}
                <View className="px-4 pt-1">
                  {rest.map((e) => (
                    <LeaderboardRankListItem key={e.userId} entry={e} />
                  ))}
                </View>
              </>
            )}
          </ScrollView>
        )}
      </View>

      {showFooter ? (
        <View
          className="absolute left-0 right-0"
          style={{ bottom: 0, paddingBottom: insets.bottom || 8 }}
        >
          <View className="px-4 pb-1">
            <MyRankFooter
              displayName={displayName}
              avatarUrl={avatarUrl}
              rank={myRankValue}
              totalXp={myTotalXp}
              loading={myRankPending}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}
