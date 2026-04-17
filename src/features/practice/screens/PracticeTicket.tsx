import "@/src/config/reanimated";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { API_CONFIG } from "@/src/utils/constants";
import { AnswerOption, type FeedbackKind } from "../components/AnswerOption";
import { ConfirmButton } from "../components/ConfirmButton";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { QuestionNumberBar } from "../components/QuestionNumberBar";
import {
  ANSWER_LABELS,
  COLORS,
  FEEDBACK_DELAY_MS,
  SCREEN_WIDTH,
} from "../constants/theme";
import { useStartTicket, useSubmitAnswer } from "../hook/usePractice";
import type {
  Answer,
  SubmitAnswerResult,
  TestAttempt,
  TestResponse,
} from "../types/practice.types";
import { TestMode } from "../types/practice.types";

const IMAGE_HEIGHT = (SCREEN_WIDTH - 32) * (9 / 16);

// ─── Main Screen ──────────────────────────────────────────
export default function PracticeTicketScreen() {
  const { mutateAsync: startTicketAsync } = useStartTicket();
  const { mutateAsync: submitAnswerAsync, isPending: isSubmitting } =
    useSubmitAnswer();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; ticketNumber?: string }>();
  const ticketId = params.id ?? "";
  const ticketLabel = params.ticketNumber
    ? `Ticket #${params.ticketNumber}`
    : "Practice";

  // ── State ──
  const [attempt, setAttempt] = useState<TestAttempt | null>(null);
  const [isStarting, setIsStarting] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, SubmitAnswerResult>>(
    {}
  );
  const [feedbackQId, setFeedbackQId] = useState<string | null>(null);

  const listRef = useRef<FlatList<TestResponse>>(null);
  const qStart = useRef(Date.now());

  // ── Derived ──
  const responses = attempt?.responses ?? [];
  const total = responses.length;
  const answeredCount = responses.filter(
    (r) => r.selectedAnswerId || results[r.questionId]
  ).length;
  const progress = total > 0 ? (answeredCount / total) * 100 : 0;

  const currentResponse = responses[currentIndex];
  const isCurrentAnswered = currentResponse
    ? !!(
        results[currentResponse.questionId] || currentResponse.selectedAnswerId
      )
    : false;
  const showConfirm = !!selectedAnswerId && !isCurrentAnswered && !feedbackQId;

  // ── Start ticket on mount ──
  useEffect(() => {
    if (!ticketId) return;
    let cancelled = false;
    setIsStarting(true);

    startTicketAsync({ ticketId, mode: TestMode.TICKET })
      .then((raw) => {
        if (cancelled) return;
        const data: TestAttempt = (raw as any)?.data ?? raw;
        data.responses.sort((a, b) => a.questionOrder - b.questionOrder);
        setAttempt(data);

        const first = data.responses.findIndex(
          (r) => !r.selectedAnswerId && !r.isSkipped
        );
        if (first > 0) {
          setCurrentIndex(first);
          setTimeout(
            () =>
              listRef.current?.scrollToIndex({
                index: first,
                animated: false,
              }),
            150
          );
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsStarting(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ticketId]);

  // ── Reset selection on question change ──
  useEffect(() => {
    if (!feedbackQId) {
      setSelectedAnswerId(null);
      qStart.current = Date.now();
    }
  }, [currentIndex, feedbackQId]);

  // ── Navigation ──
  const goTo = useCallback((i: number) => {
    setCurrentIndex(i);
    listRef.current?.scrollToIndex({ index: i, animated: true });
  }, []);

  const onScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const i = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      if (i >= 0 && i < responses.length) setCurrentIndex(i);
    },
    [responses.length]
  );

  // ── Submit answer ──
  const handleConfirm = useCallback(async () => {
    if (!attempt || !selectedAnswerId || isSubmitting) return;
    const resp = responses[currentIndex];
    if (!resp) return;

    const timeSec = Math.max(
      1,
      Math.floor((Date.now() - qStart.current) / 1000)
    );

    try {
      const result = await submitAnswerAsync({
        testId: attempt.id,
        questionId: resp.questionId,
        answerId: selectedAnswerId,
        timeSpentSeconds: timeSec,
      });

      setResults((prev) => ({ ...prev, [resp.questionId]: result }));
      setFeedbackQId(resp.questionId);

      setTimeout(() => {
        setFeedbackQId(null);
        setSelectedAnswerId(null);

        if (result.isExamFinished) {
          router.back();
          return;
        }

        const next = responses.findIndex(
          (r, i) =>
            i > currentIndex && !r.selectedAnswerId && !results[r.questionId]
        );
        if (next >= 0) goTo(next);
        else if (currentIndex < responses.length - 1) goTo(currentIndex + 1);
      }, FEEDBACK_DELAY_MS);
    } catch {}
  }, [
    attempt,
    selectedAnswerId,
    isSubmitting,
    responses,
    currentIndex,
    results,
    submitAnswerAsync,
    goTo,
    router,
  ]);

  // ── Render a single question page ──
  const renderQuestion = useCallback(
    ({ item, index }: { item: TestResponse; index: number }) => {
      const q = item.question;
      const answers = [...q.answers].sort(
        (a, b) => a.displayOrder - b.displayOrder
      );
      const res = results[item.questionId];
      const isCurrent = index === currentIndex;
      const submittedId = res?.selectedAnswerId ?? item.selectedAnswerId;
      const wasCorrect = res?.isCorrect ?? item.isCorrect;
      const isAnswered = !!submittedId;
      const showFB = feedbackQId === item.questionId;

      const getFeedback = (a: Answer): FeedbackKind => {
        if (showFB) {
          if (a.id === submittedId && wasCorrect) return "correct";
          if (a.id === submittedId && !wasCorrect) return "incorrect";
          if (!wasCorrect && a.isCorrect) return "reveal";
          return null;
        }
        if (isAnswered && !isCurrent) {
          if (a.id === submittedId && wasCorrect) return "correct";
          if (a.id === submittedId && !wasCorrect) return "incorrect";
          if (!wasCorrect && a.isCorrect) return "reveal";
        }
        return null;
      };

      return (
        <ScrollView
          style={{ width: SCREEN_WIDTH }}
          contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {q.imageUrl && (
            <View className="overflow-hidden rounded-xl border border-slate-200 shadow-md">
              <Image
                source={{
                  uri: `${API_CONFIG.API_URL}/images/${q.imageUrl}.${Number(q.imageUrl) > 700 ? "webp" : "png"}`,
                }}
                style={{
                  width: SCREEN_WIDTH - 32,
                  height: IMAGE_HEIGHT,
                  backgroundColor: "#e2e8f0",
                }}
                resizeMode="cover"
              />
            </View>
          )}

          <View className={q.imageUrl ? "mt-4 gap-1" : "gap-1"}>
            <Text
              className="text-xl font-bold leading-tight tracking-tight"
              style={{ color: COLORS.TEXT_DARK }}
            >
              {q.text}
            </Text>
          </View>

          <View className="mt-5 gap-3">
            {answers.map((a, i) => (
              <AnswerOption
                key={a.id}
                answer={a}
                label={ANSWER_LABELS[i] ?? String(i + 1)}
                isSelected={
                  (isCurrent && selectedAnswerId === a.id) ||
                  (!isCurrent && submittedId === a.id)
                }
                feedback={getFeedback(a)}
                disabled={isAnswered || showFB || (!isCurrent && !isAnswered)}
                onPress={() => {
                  if (!feedbackQId) setSelectedAnswerId(a.id);
                }}
              />
            ))}
          </View>
        </ScrollView>
      );
    },
    [currentIndex, selectedAnswerId, results, feedbackQId]
  );

  // ── Loading state ──
  if (isStarting) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: COLORS.BG }}
        edges={["top"]}
      >
        <LoadingSkeleton />
      </SafeAreaView>
    );
  }

  // ── Error / empty ──
  if (!attempt || responses.length === 0) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: COLORS.BG }}
        edges={["top"]}
      >
        <View className="flex-1 items-center justify-center gap-4">
          <MaterialIcons name="error-outline" size={48} color="#94a3b8" />
          <Text className="text-base font-medium text-slate-500">
            Could not load ticket
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="rounded-xl px-6 py-3"
            style={{ backgroundColor: COLORS.PRIMARY }}
          >
            <Text className="font-bold text-white">Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.BG }}
      edges={["top"]}
    >
      {/* Header */}
      <View
        className="flex-row items-center justify-between border-b border-slate-200 px-4 py-3"
        style={{ backgroundColor: `${COLORS.BG}CC` }}
      >
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full active:opacity-70"
          hitSlop={8}
        >
          <MaterialIcons name="close" size={24} color={COLORS.TEXT_DARK} />
        </Pressable>
        <Text
          className="flex-1 text-center text-lg font-bold leading-tight tracking-tight"
          style={{ color: COLORS.TEXT_DARK }}
        >
          {ticketLabel}
        </Text>
        <View className="h-10 w-10" />
      </View>

      {/* Progress */}
      <View className="gap-2 px-4 pb-2 pt-2">
        <View className="flex-row items-center justify-between">
          <Text
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: COLORS.TEXT_DARK }}
          >
            Progress
          </Text>
          <Text className="text-sm font-bold" style={{ color: COLORS.PRIMARY }}>
            {answeredCount}/{total}
          </Text>
        </View>
        <View className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <View
            className="h-full rounded-full"
            style={{ width: `${progress}%`, backgroundColor: COLORS.PRIMARY }}
          />
        </View>
      </View>

      {/* Question number bar */}
      <QuestionNumberBar
        responses={responses}
        currentIndex={currentIndex}
        results={results}
        onPress={goTo}
      />

      {/* Horizontal question pager */}
      <FlatList
        ref={listRef}
        data={responses}
        renderItem={renderQuestion}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        scrollEnabled={!feedbackQId}
        getItemLayout={(_, i) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * i,
          index: i,
        })}
        extraData={[currentIndex, selectedAnswerId, results, feedbackQId]}
      />

      {/* Confirm button — slides up when an answer is selected */}
      {showConfirm && (
        <ConfirmButton onPress={handleConfirm} isSubmitting={isSubmitting} />
      )}
    </SafeAreaView>
  );
}
