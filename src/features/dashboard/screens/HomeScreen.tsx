import { HomeBadgesSection } from "@/src/features/dashboard/components/HomeBadgesSection";
import { HomeHeader } from "@/src/features/dashboard/components/HomeHeader";
import { HomeProgressHero } from "@/src/features/dashboard/components/HomeProgressHero";
import { HomeQuickStats } from "@/src/features/dashboard/components/HomeQuickStats";
import { HomeRecentExamsSection } from "@/src/features/dashboard/components/HomeRecentExamsSection";
import { HomeScreenSkeleton } from "@/src/features/dashboard/components/HomeScreenSkeleton";
import { HomeWeakTopicsSection } from "@/src/features/dashboard/components/HomeWeakTopicsSection";
import { useAuthStore } from "@/src/store/auth.store";
import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTabBarMetrics } from "@/src/utils/tab-bar";
import { useExamHistory, useGemificationSummary } from "../hook/useDashboard";

export default function HomeScreen() {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const { scrollBottomPadding } = useTabBarMetrics();
  const router = useRouter();
  const avatarUrl = useAuthStore((s) => s.user?.avatarUrl);

  const {
    data: summary,
    isPending: loadingSummary,
    isError: errorSummary,
    refetch: refetchSummary,
  } = useGemificationSummary();
  const {
    data: examData,
    isPending: loadingExams,
    refetch: refetchExams,
  } = useExamHistory({ page: 1, limit: 5 });

  useFocusEffect(
    useCallback(() => {
      refetchSummary();
      refetchExams();
    }, [refetchSummary, refetchExams])
  );

  const onContinueLearning = useCallback(() => {
    router.push("/(tabs)/tickets");
  }, [router]);

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

  if (errorSummary || !summary) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: palette.background }}
        className="px-6"
        edges={["top"]}
      >
        <View className="flex-1 items-center justify-center">
          <MaterialIcons name="cloud-off" size={48} color={palette.chevron} />
          <Text
            className="mt-3 text-center text-base"
            style={{ color: palette.muted }}
          >
            {t("data_not_loaded")}
          </Text>
          <Pressable
            onPress={() => refetchSummary()}
            className="mt-5 rounded-2xl px-6 py-3"
            style={{ backgroundColor: palette.primary }}
          >
            <Text className="font-bold" style={{ color: palette.switchThumb }}>
              {t("try_again_loading")}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const { progress, streak, badges, weakTopics } = summary;
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
