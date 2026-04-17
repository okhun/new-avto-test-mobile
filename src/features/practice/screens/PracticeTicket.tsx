import "@/src/config/reanimated";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStartTicket, useSubmitAnswer } from "../hook/usePractice";
import type {
  Answer,
  SubmitAnswerResult,
  TestAttempt,
  TestResponse,
} from "../types/practice.types";
import { TestMode } from "../types/practice.types";

// ─── Constants ────────────────────────────────────────────
const PRIMARY = "#137fec";
const BG = "#f6f7f8";
const TEXT_DARK = "#0d141b";
const CARD_BG = "#ffffff";
const SUCCESS = "#22c55e";
const ERROR = "#ef4444";
const SPRING = { damping: 15, stiffness: 400 };
const { width: SW } = Dimensions.get("window");
const Q_BTN = 40;
const Q_GAP = 8;
const LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const FEEDBACK_DELAY = 1200;

// ─── ScalePressable ───────────────────────────────────────
function ScalePressable({
  children,
  onPress,
  style,
  disabled,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: object;
  disabled?: boolean;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.97, SPRING);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, SPRING);
      }}
      style={style}
      disabled={disabled}
    >
      <Animated.View style={animStyle}>{children}</Animated.View>
    </Pressable>
  );
}

// ─── Skeleton Pulse ───────────────────────────────────────
function Pulse({
  w,
  h,
  r = 8,
  style,
}: {
  w: number | `${number}%`;
  h: number;
  r?: number;
  style?: object;
}) {
  const opacity = useSharedValue(0.3);
  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);
  const anim = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View
      style={[
        {
          width: w as any,
          height: h,
          borderRadius: r,
          backgroundColor: "#e2e8f0",
        },
        anim,
        style,
      ]}
    />
  );
}

function LoadingSkeleton() {
  const imgH = (SW - 32) * (9 / 16);
  return (
    <View className="flex-1" style={{ backgroundColor: BG }}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pulse w={40} h={40} r={20} />
        <Pulse w={120} h={24} />
        <Pulse w={40} h={40} r={20} />
      </View>
      <View className="gap-2 px-4 pb-4 pt-2">
        <View className="flex-row justify-between">
          <Pulse w={120} h={14} />
          <Pulse w={40} h={14} />
        </View>
        <Pulse w={"100%"} h={8} r={4} />
      </View>
      <View className="flex-row gap-2 px-4 py-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Pulse key={i} w={Q_BTN} h={Q_BTN} r={Q_BTN / 2} />
        ))}
      </View>
      <View className="px-4 pt-2">
        <Pulse w={"100%"} h={imgH} r={12} />
      </View>
      <View className="gap-2 px-4 pt-4">
        <Pulse w={"90%"} h={22} />
        <Pulse w={"70%"} h={22} />
        <Pulse w={"50%"} h={16} style={{ marginTop: 4 }} />
      </View>
      <View className="gap-3 px-4 pt-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Pulse key={i} w={"100%"} h={60} r={12} />
        ))}
      </View>
    </View>
  );
}

// ─── Question Number Bar ──────────────────────────────────
type QStatus = "unanswered" | "correct" | "incorrect" | "active";

const STATUS_STYLE: Record<
  QStatus,
  { bg: string; text: string; border: string }
> = {
  active: { bg: PRIMARY, text: "#fff", border: PRIMARY },
  correct: { bg: SUCCESS, text: "#fff", border: SUCCESS },
  incorrect: { bg: ERROR, text: "#fff", border: ERROR },
  unanswered: { bg: "#f1f5f9", text: "#64748b", border: "#e2e8f0" },
};

function getQStatus(
  r: TestResponse,
  idx: number,
  currentIdx: number,
  results: Record<string, SubmitAnswerResult>
): QStatus {
  const res = results[r.questionId];
  if (res) return res.isCorrect ? "correct" : "incorrect";
  if (r.selectedAnswerId != null) return r.isCorrect ? "correct" : "incorrect";
  if (idx === currentIdx) return "active";
  return "unanswered";
}

function QuestionNumberBar({
  responses,
  currentIndex,
  results,
  onPress,
}: {
  responses: TestResponse[];
  currentIndex: number;
  results: Record<string, SubmitAnswerResult>;
  onPress: (i: number) => void;
}) {
  const ref = useRef<ScrollView>(null);

  useEffect(() => {
    const offset = currentIndex * (Q_BTN + Q_GAP) - SW / 2 + Q_BTN / 2 + 16;
    ref.current?.scrollTo({ x: Math.max(0, offset), animated: true });
  }, [currentIndex]);

  return (
    <ScrollView
      ref={ref}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: Q_GAP,
      }}
    >
      {responses.map((r, i) => {
        const st = getQStatus(r, i, currentIndex, results);
        const c = STATUS_STYLE[st];
        const cur = i === currentIndex;
        return (
          <Pressable
            key={r.id}
            onPress={() => onPress(i)}
            style={{
              width: Q_BTN,
              height: Q_BTN,
              borderRadius: Q_BTN / 2,
              backgroundColor: c.bg,
              borderWidth: cur && st !== "active" ? 2.5 : 1.5,
              borderColor: cur && st !== "active" ? PRIMARY : c.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: "700", color: c.text }}>
              {r.questionOrder}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

// ─── Answer Option ────────────────────────────────────────
type FeedbackKind = null | "correct" | "incorrect" | "reveal";

function AnswerOption({
  answer,
  label,
  isSelected,
  feedback,
  disabled,
  onPress,
}: {
  answer: Answer;
  label: string;
  isSelected: boolean;
  feedback: FeedbackKind;
  disabled: boolean;
  onPress: () => void;
}) {
  let border = "#e2e8f0";
  let bg = CARD_BG;
  let circle = "transparent";
  let cBorder = "#cbd5e1";
  let cText = TEXT_DARK;

  if (feedback === "correct") {
    border = SUCCESS;
    bg = `${SUCCESS}15`;
    circle = SUCCESS;
    cBorder = SUCCESS;
    cText = "#fff";
  } else if (feedback === "incorrect") {
    border = ERROR;
    bg = `${ERROR}15`;
    circle = ERROR;
    cBorder = ERROR;
    cText = "#fff";
  } else if (feedback === "reveal") {
    border = SUCCESS;
    bg = `${SUCCESS}0A`;
    circle = SUCCESS;
    cBorder = SUCCESS;
    cText = "#fff";
  } else if (isSelected) {
    border = PRIMARY;
    bg = `${PRIMARY}0D`;
    circle = PRIMARY;
    cBorder = PRIMARY;
    cText = "#fff";
  }

  const icon =
    feedback === "correct" || feedback === "reveal"
      ? "check"
      : feedback === "incorrect"
        ? "close"
        : null;

  return (
    <ScalePressable
      onPress={onPress}
      disabled={disabled}
      style={{
        width: "100%",
        borderRadius: 12,
        padding: 16,
        borderWidth: 2,
        borderColor: border,
        backgroundColor: bg,
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        opacity: disabled && !feedback && !isSelected ? 0.5 : 1,
      }}
    >
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: circle,
          borderWidth: circle === "transparent" ? 2 : 0,
          borderColor: cBorder,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon ? (
          <MaterialIcons name={icon} size={16} color="#fff" />
        ) : (
          <Text style={{ fontSize: 12, fontWeight: "700", color: cText }}>
            {label}
          </Text>
        )}
      </View>
      <Text
        numberOfLines={3}
        style={{
          flex: 1,
          fontSize: 15,
          color: TEXT_DARK,
          fontWeight: isSelected || feedback ? "600" : "500",
          lineHeight: 22,
        }}
      >
        {answer.text}
      </Text>
      {feedback === "correct" && (
        <MaterialIcons name="check-circle" size={22} color={SUCCESS} />
      )}
      {feedback === "incorrect" && (
        <MaterialIcons name="cancel" size={22} color={ERROR} />
      )}
    </ScalePressable>
  );
}

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

  const responses = attempt?.responses ?? [];
  const total = responses.length;
  const answered = responses.filter(
    (r) => r.selectedAnswerId || results[r.questionId]
  ).length;
  const progress = total > 0 ? (answered / total) * 100 : 0;
  const imgH = (SW - 32) * (9 / 16);

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
              listRef.current?.scrollToIndex({ index: first, animated: false }),
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

  // ── Navigation helpers ──
  const goTo = useCallback((i: number) => {
    setCurrentIndex(i);
    listRef.current?.scrollToIndex({ index: i, animated: true });
  }, []);

  const onScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const i = Math.round(e.nativeEvent.contentOffset.x / SW);
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
      }, FEEDBACK_DELAY);
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
          style={{ width: SW }}
          contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {q.imageUrl && (
            <View className="overflow-hidden rounded-xl border border-slate-200 shadow-md">
              <Image
                source={{ uri: q.imageUrl }}
                style={{
                  width: SW - 32,
                  height: imgH,
                  backgroundColor: "#e2e8f0",
                }}
                resizeMode="cover"
              />
            </View>
          )}

          <View className={q.imageUrl ? "mt-4 gap-1" : "gap-1"}>
            <Text
              className="text-xl font-bold leading-tight tracking-tight"
              style={{ color: TEXT_DARK }}
            >
              {q.text}
            </Text>
          </View>

          <View className="mt-5 gap-3">
            {answers.map((a, i) => (
              <AnswerOption
                key={a.id}
                answer={a}
                label={LABELS[i] ?? String(i + 1)}
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
    [currentIndex, selectedAnswerId, results, feedbackQId, imgH]
  );

  // ── Loading ──
  if (isStarting) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top"]}>
        <LoadingSkeleton />
      </SafeAreaView>
    );
  }

  // ── Error / empty ──
  if (!attempt || responses.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top"]}>
        <View className="flex-1 items-center justify-center gap-4">
          <MaterialIcons name="error-outline" size={48} color="#94a3b8" />
          <Text className="text-base font-medium text-slate-500">
            Could not load ticket
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="rounded-xl px-6 py-3"
            style={{ backgroundColor: PRIMARY }}
          >
            <Text className="font-bold text-white">Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const cur = responses[currentIndex];
  const curAnswered = cur
    ? !!(results[cur.questionId] || cur.selectedAnswerId)
    : false;
  const showConfirm = !!selectedAnswerId && !curAnswered && !feedbackQId;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={["top"]}>
      {/* Header */}
      <View
        className="flex-row items-center justify-between border-b border-slate-200 px-4 py-3"
        style={{ backgroundColor: `${BG}CC` }}
      >
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full active:opacity-70"
          hitSlop={8}
        >
          <MaterialIcons name="close" size={24} color={TEXT_DARK} />
        </Pressable>
        <Text
          className="flex-1 text-center text-lg font-bold leading-tight tracking-tight"
          style={{ color: TEXT_DARK }}
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
            style={{ color: TEXT_DARK }}
          >
            Progress
          </Text>
          <Text className="text-sm font-bold" style={{ color: PRIMARY }}>
            {answered}/{total}
          </Text>
        </View>
        <View className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <View
            className="h-full rounded-full"
            style={{ width: `${progress}%`, backgroundColor: PRIMARY }}
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
          length: SW,
          offset: SW * i,
          index: i,
        })}
        extraData={[currentIndex, selectedAnswerId, results, feedbackQId]}
      />

      {/* Confirm button — slides up when an answer is selected */}
      {showConfirm && (
        <Animated.View
          entering={SlideInDown.duration(300).springify()}
          exiting={SlideOutDown.duration(200)}
          className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-4 pb-8"
          style={{ backgroundColor: `${BG}F2` }}
        >
          <ScalePressable
            onPress={handleConfirm}
            disabled={isSubmitting}
            style={{
              width: "100%",
              height: 56,
              backgroundColor: PRIMARY,
              borderRadius: 12,
              shadowColor: PRIMARY,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 8,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <View className="flex-row items-center justify-center gap-2">
                <Text className="text-base font-bold text-white">
                  Confirm & Next
                </Text>
                <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
              </View>
            )}
          </ScalePressable>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}
