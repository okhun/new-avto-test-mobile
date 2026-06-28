import { OfflineView } from "@/src/components/network/OfflineView";
import { ServerErrorView } from "@/src/components/network/ServerErrorView";
import { HomeBadgesSection } from "@/src/features/dashboard/components/HomeBadgesSection";
import { HomeHeader } from "@/src/features/dashboard/components/HomeHeader";
import { HomeProgressHero } from "@/src/features/dashboard/components/HomeProgressHero";
import { HomeQuickStats } from "@/src/features/dashboard/components/HomeQuickStats";
import { HomeRecentExamsSection } from "@/src/features/dashboard/components/HomeRecentExamsSection";
import { HomeScreenSkeleton } from "@/src/features/dashboard/components/HomeScreenSkeleton";
import { HomeWeakTopicsSection } from "@/src/features/dashboard/components/HomeWeakTopicsSection";
import { useOfflineRefresh } from "@/src/hooks/useNetwork";
import { getQueryErrorState } from "@/src/hooks/useQueryErrorState";
import { useNetwork } from "@/src/providers/NetworkProvider";
import { useAuthStore } from "@/src/store/auth.store";
import { useTheme } from "@/src/theme";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTabBarMetrics } from "@/src/utils/tab-bar";
import { useExamHistory, useGemificationSummary } from "../hook/useDashboard";

export default function HomeScreen() {
  const { palette } = useTheme();
  const { scrollBottomPadding } = useTabBarMetrics();
  const { isOffline } = useNetwork();
  const router = useRouter();
  const avatarUrl = useAuthStore((s) => s.user?.avatarUrl);

  const {
    data: summary,
    isPending: loadingSummary,
    isError: errorSummary,
    error: summaryError,
    refetch: refetchSummary,
  } = useGemificationSummary();
  const {
    data: examData,
    isPending: loadingExams,
    refetch: refetchExams,
  } = useExamHistory({ page: 1, limit: 5 });

  const refreshAll = useCallback(() => {
    refetchSummary();
    refetchExams();
  }, [refetchSummary, refetchExams]);
  const onRefresh = useOfflineRefresh(refreshAll);

  useFocusEffect(
    useCallback(() => {
      if (!isOffline) refreshAll();
    }, [isOffline, refreshAll])
  );

  const onContinueLearning = useCallback(() => {
    router.push("/(tabs)/tickets");
  }, [router]);

  const errorState = getQueryErrorState(summaryError, isOffline);

  if (loadingSummary && !summary) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: palette.background }}
        edges={["top"]}
      >
        <HomeScreenSkeleton />
      </SafeAreaView>
    );
  }

  if (errorSummary && !summary) {
    if (errorState === "offline") {
      return (
        <SafeAreaView
          style={{ flex: 1, backgroundColor: palette.background }}
          edges={["top"]}
        >
          <OfflineView onRetry={onRefresh} />
        </SafeAreaView>
      );
    }

    if (errorState === "server") {
      return (
        <SafeAreaView
          style={{ flex: 1, backgroundColor: palette.background }}
          edges={["top"]}
        >
          <ServerErrorView onRetry={onRefresh} />
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: palette.background }}
        edges={["top"]}
      >
        <ServerErrorView onRetry={onRefresh} />
      </SafeAreaView>
    );
  }

  const { progress, streak, badges, weakTopics } = summary!;
  const tests = examData?.tests ?? [];
  const totalExams = examData?.total ?? 0;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: palette.background }}
      edges={["top"]}
    >
      <HomeHeader level={progress.level} avatarUrl={avatarUrl} />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: scrollBottomPadding }}
      >
        <HomeProgressHero progress={progress} onContinue={onContinueLearning} />
        <HomeQuickStats progress={progress} streak={streak} />
        <View className="h-1" />
        <HomeBadgesSection badges={badges ?? []} />
        {weakTopics?.length ? (
          <HomeWeakTopicsSection topics={weakTopics} />
        ) : null}
        <HomeRecentExamsSection
          tests={tests}
          total={totalExams}
          loading={loadingExams}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
