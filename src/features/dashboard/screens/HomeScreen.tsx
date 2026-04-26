import { HomeBadgesSection } from "@/src/features/dashboard/components/HomeBadgesSection";
import { HomeHeader } from "@/src/features/dashboard/components/HomeHeader";
import { HomeProgressHero } from "@/src/features/dashboard/components/HomeProgressHero";
import { HomeQuickStats } from "@/src/features/dashboard/components/HomeQuickStats";
import { HomeRecentExamsSection } from "@/src/features/dashboard/components/HomeRecentExamsSection";
import { HomeScreenSkeleton } from "@/src/features/dashboard/components/HomeScreenSkeleton";
import { HomeWeakTopicsSection } from "@/src/features/dashboard/components/HomeWeakTopicsSection";
import { useAuthStore } from "@/src/store/auth.store";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useExamHistory, useGemificationSummary } from "../hook/useDashboard";

const PRIMARY = "#137fec";

export default function HomeScreen() {
  const router = useRouter();
  const displayName = useAuthStore((s) => s.user?.displayName);

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
      <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
        <HomeScreenSkeleton />
      </SafeAreaView>
    );
  }

  if (errorSummary || !summary) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 px-6" edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <MaterialIcons name="cloud-off" size={48} color="#cbd5e1" />
          <Text className="mt-3 text-center text-base text-slate-600">
            Ma&apos;lumot yuklanmadi. Internetni tekshiring.
          </Text>
          <Pressable
            onPress={() => refetchSummary()}
            className="mt-5 rounded-2xl px-6 py-3"
            style={{ backgroundColor: PRIMARY }}
          >
            <Text className="font-bold text-white">Qayta yuklash</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const { progress, streak, badges, weakTopics } = summary;
  const tests = examData?.tests ?? [];
  const totalExams = examData?.total ?? 0;

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <HomeHeader displayName={displayName} />
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
