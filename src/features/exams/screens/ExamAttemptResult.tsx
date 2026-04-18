import type { TestResponse } from "@/src/features/practice/types/practice.types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef } from "react";
import { FlatList, ListRenderItem, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ExamResultActions } from "../components/result/ExamResultActions";
import { ExamResultHeader } from "../components/result/ExamResultHeader";
import { ExamResultQuestionCard } from "../components/result/ExamResultQuestionCard";
import { ExamResultSkeleton } from "../components/result/ExamResultSkeleton";
import {
  MistakeNavigator,
  type NavigatorItem,
} from "../components/result/MistakeNavigator";

import { useExamResult } from "../hook/useExams";

const BG = "#f4f5f7";
const TEXT_MUTED = "#64748b";

/** Approximate row height for scrollToIndex (cards vary; good enough to land near target). */
const EST_ITEM_HEIGHT = 440;

export default function ExamAttemptResult() {
  const router = useRouter();
  const { attemptId } = useLocalSearchParams<{ attemptId: string }>();
  const id = attemptId ?? "";

  const { data: attempt, isPending, isError } = useExamResult(id);

  const listRef = useRef<FlatList<TestResponse>>(null);

  const sortedResponses = useMemo(() => {
    const list = attempt?.responses ?? [];
    return [...list].sort((a, b) => a.questionOrder - b.questionOrder);
  }, [attempt]);

  const incorrectCount = useMemo(
    () => sortedResponses.filter((r) => r.isCorrect === false).length,
    [sortedResponses]
  );

  const navigatorItems: NavigatorItem[] = useMemo(
    () =>
      sortedResponses.map((r) => ({
        order: r.questionOrder,
        isMistake: r.isCorrect === false,
        isAnswered: r.selectedAnswerId !== null,
      })),
    [sortedResponses]
  );

  const titleLabel = useMemo(() => {
    if (!attempt) return "Imtihon";
    if (attempt.ticketId) return `Ticket · ${attempt.ticketId}`;
    return "Imtihon";
  }, [attempt]);

  const retakeLabel = attempt?.ticketId ? "ticket" : "imtihon";

  const scoreLabel = useMemo(() => {
    if (!attempt) return undefined;
    return `${attempt.correctAnswers}/${attempt.totalQuestions} · Ball: ${attempt.score}%`;
  }, [attempt]);

  const onBack = useCallback(() => {
    router.replace("/(tabs)/exams");
  }, [router]);

  const onRetake = useCallback(() => {
    if (attempt?.ticketId) {
      router.replace(`/tickets/${attempt.ticketId}`);
    } else {
      router.replace("/exams/start");
    }
  }, [attempt?.ticketId, router]);

  const scrollToOrder = useCallback(
    (order: number) => {
      const index = sortedResponses.findIndex((r) => r.questionOrder === order);
      if (index < 0) return;
      listRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.05,
      });
    },
    [sortedResponses]
  );

  const renderItem: ListRenderItem<TestResponse> = useCallback(
    ({ item }) => (
      <View className="px-4">
        <ExamResultQuestionCard
          questionOrder={item.questionOrder}
          questionText={item.question.text}
          imageUrl={item.question.imageUrl}
          answers={item.question.answers ?? []}
          selectedAnswerId={item.selectedAnswerId}
          isCorrect={item.isCorrect}
          explanation={item.question.explanation ?? ""}
        />
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item: TestResponse) => item.id, []);

  const getItemLayout = useCallback(
    (_: ArrayLike<TestResponse> | null | undefined, index: number) => ({
      length: EST_ITEM_HEIGHT,
      offset: EST_ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  const onScrollToIndexFailed = useCallback(
    (info: {
      index: number;
      highestMeasuredFrameIndex: number;
      averageItemLength: number;
    }) => {
      const wait = new Promise((r) => setTimeout(r, 400));
      wait.then(() => {
        listRef.current?.scrollToIndex({
          index: info.index,
          animated: true,
          viewPosition: 0.05,
        });
      });
    },
    []
  );

  if (isPending) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top"]}>
        <ExamResultSkeleton />
      </SafeAreaView>
    );
  }

  if (isError || !attempt) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center px-8"
        style={{ backgroundColor: BG }}
        edges={["top"]}
      >
        <MaterialIcons name="search-off" size={48} color="#94a3b8" />
        <Text
          className="mt-4 text-center text-base"
          style={{ color: TEXT_MUTED }}
        >
          Natija topilmadi
        </Text>
        <Pressable onPress={onBack} className="mt-6">
          <Text className="text-base font-semibold text-[#137fec]">
            Imtihonlar tarixiga qaytish
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top"]}>
      <ExamResultHeader
        titleLabel={titleLabel}
        incorrectCount={incorrectCount}
        totalQuestions={attempt.totalQuestions}
        reviewedCount={attempt.totalQuestions}
        progressPercent={100}
        isPassed={attempt.isPassed}
        scoreLabel={scoreLabel}
        onBack={onBack}
      />

      {!sortedResponses.length ? (
        <View className="flex-1 px-4 pt-4">
          <Text
            className="py-8 text-center text-base"
            style={{ color: TEXT_MUTED }}
          >
            Savollar mavjud emas
          </Text>
          <ExamResultActions
            onBackToExams={onBack}
            onRetake={onRetake}
            retakeLabel={retakeLabel}
          />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={sortedResponses}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          onScrollToIndexFailed={onScrollToIndexFailed}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
          ListHeaderComponent={
            <View className="mb-2 px-4 pt-4">
              <MistakeNavigator
                items={navigatorItems}
                mistakeCount={incorrectCount}
                onSelectOrder={scrollToOrder}
              />
            </View>
          }
          ListFooterComponent={
            <View className="px-4">
              <ExamResultActions
                onBackToExams={onBack}
                onRetake={onRetake}
                retakeLabel={retakeLabel}
              />
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
