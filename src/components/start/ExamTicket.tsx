import { ImagePreview } from "@/src/components/ui/ImagePreview";
import "@/src/config/reanimated";
import { getExamResult } from "@/src/features/practice/api/practice.api";
import {
  ANSWER_LABELS,
  FEEDBACK_DELAY_MS,
  SCREEN_WIDTH,
} from "@/src/features/practice/constants/theme";
import {
  useStartTicket,
  useSubmitAnswer,
} from "@/src/features/practice/hook/usePractice";
import type {
  Answer,
  ExamHistoryEntry,
  SubmitAnswerResult,
  TestAttempt,
  TestResponse,
} from "@/src/features/practice/types/practice.types";
import { TestMode } from "@/src/features/practice/types/practice.types";
import { playAnswerFeedbackSound } from "@/src/features/practice/utils/playAnswerFeedbackSound";
import { usePreferencesStore } from "@/src/store/preferences.store";
import { useTheme } from "@/src/theme";
import { API_CONFIG } from "@/src/utils/constants";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter, useSegments } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Share,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AnswerOption, type FeedbackKind } from "./AnswerOption";
import { ConfirmButton } from "./ConfirmButton";
import { ExamFailModal } from "./ExamFailModal";
import { ExamSuccessModal } from "./ExamSuccessModal";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { QuestionNumberBar } from "./QuestionNumberBar";

const IMAGE_HEIGHT = (SCREEN_WIDTH - 32) * (9 / 16);

const EXAM_DURATION_SECONDS = 25 * 60;
const TEN_MINUTES_SECONDS = 10 * 60;
const FIVE_MINUTES_SECONDS = 5 * 60;

function examHistoryToAttempt(entry: ExamHistoryEntry): TestAttempt {
  return {
    id: entry.id,
    startedAt: entry.startedAt,
    completedAt: entry.completedAt,
    status: entry.status as TestAttempt["status"],
    totalQuestions: entry.totalQuestions,
    correctAnswers: entry.correctAnswers,
    wrongAnswers: entry.wrongAnswers,
    skippedQuestions: entry.skippedQuestions,
    score: entry.score,
    timeSpentSeconds: entry.timeSpentSeconds,
    timeLimitSeconds: entry.timeLimitSeconds,
    passingScore: entry.passingScore,
    responses: (entry.responses ?? []).map((r) => ({ ...r })),
  };
}

function mergeSubmitIntoAttempt(
  attempt: TestAttempt,
  result: SubmitAnswerResult
): TestAttempt {
  const responses = attempt.responses.map((r) => ({ ...r }));
  const idx = responses.findIndex((r) => r.id === result.id);
  if (idx !== -1) {
    const t = responses[idx]!;
    t.selectedAnswerId = result.selectedAnswerId;
    t.isCorrect = result.isCorrect;
    t.isSkipped = result.isSkipped;
    t.timeSpentSeconds = result.timeSpentSeconds;
    t.answeredAt = result.answeredAt;
    t.questionOrder = result.questionOrder;
  }
  return { ...attempt, responses };
}

// ─── Main Screen ──────────────────────────────────────────
export default function ExamTicketScreen() {
  const { t } = useTranslation();
  const { palette, isDark } = useTheme();
  const soundEffectsEnabled = usePreferencesStore((s) => s.soundEffectsEnabled);
  const { mutateAsync: startTicketAsync } = useStartTicket();
  const { mutateAsync: submitAnswerAsync, isPending: isSubmitting } =
    useSubmitAnswer();
  const router = useRouter();
  const segments = useSegments();
  const isExamMode = segments[0] === "exams";

  const params = useLocalSearchParams<{ id?: string; ticketNumber?: string }>();
  const ticketId = params.id ?? "";
  const ticketLabel = params.ticketNumber
    ? `${t("ticket")} #${params.ticketNumber}`
    : t("exam");

  const [attempt, setAttempt] = useState<TestAttempt | null>(null);
  const [isStarting, setIsStarting] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, SubmitAnswerResult>>(
    {}
  );
  const [feedbackQId, setFeedbackQId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [nowMs, setNowMs] = useState(Date.now());
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [examSnapshot, setExamSnapshot] = useState({
    correctAnswers: 0,
    totalQuestions: 20,
    passingScore: 18,
  });

  const listRef = useRef<FlatList<TestResponse>>(null);
  const currentIndexRef = useRef(0);
  const qStart = useRef(Date.now());

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const responses = useMemo(() => {
    const r = attempt?.responses ?? [];
    return [...r].sort((a, b) => a.questionOrder - b.questionOrder);
  }, [attempt]);

  const total = responses.length;
  const answeredCount = useMemo(
    () =>
      responses.filter(
        (r) => r.isCorrect !== null || r.isSkipped || r.answeredAt !== null
      ).length,
    [responses]
  );

  const progress = total > 0 ? (answeredCount / total) * 100 : 0;

  const currentResponse = responses[currentIndex];
  const isCurrentAnswered = currentResponse
    ? !!(
        results[currentResponse.questionId] ||
        currentResponse.selectedAnswerId != null ||
        currentResponse.isSkipped ||
        currentResponse.answeredAt != null ||
        currentResponse.isCorrect !== null
      )
    : false;
  const showConfirm = !!selectedAnswerId && !isCurrentAnswered && !feedbackQId;

  const remainingSeconds = useMemo(() => {
    if (!isExamMode || !attempt?.startedAt) return null;
    const startMs = new Date(attempt.startedAt).getTime();
    const limitSec = attempt.timeLimitSeconds ?? EXAM_DURATION_SECONDS;
    const endMs = startMs + limitSec * 1000;
    return Math.max(0, Math.floor((endMs - nowMs) / 1000));
  }, [isExamMode, attempt, nowMs]);

  const remainingLabel = useMemo(() => {
    if (!isExamMode) return null;
    const sec = remainingSeconds ?? EXAM_DURATION_SECONDS;
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, [isExamMode, remainingSeconds]);

  const timerTone = useMemo(() => {
    if (!isExamMode || remainingSeconds === null) return "default" as const;
    if (remainingSeconds <= FIVE_MINUTES_SECONDS) return "danger" as const;
    if (remainingSeconds <= TEN_MINUTES_SECONDS) return "warn" as const;
    return "default" as const;
  }, [isExamMode, remainingSeconds]);

  const timerStyles = useMemo(() => {
    if (timerTone === "danger")
      return {
        wrap: {
          backgroundColor: isDark ? "rgba(220,38,38,0.18)" : "#fef2f2",
          borderColor: isDark ? "rgba(248,113,113,0.45)" : "#fecaca",
        },
        text: isDark ? "#fca5a5" : "#dc2626",
        icon: isDark ? "#fca5a5" : "#dc2626",
      };
    if (timerTone === "warn")
      return {
        wrap: {
          backgroundColor: isDark ? "rgba(245,158,11,0.15)" : "#fffbeb",
          borderColor: isDark ? "rgba(251,191,36,0.35)" : "#fde68a",
        },
        text: isDark ? "#fbbf24" : "#d97706",
        icon: isDark ? "#fbbf24" : "#d97706",
      };
    return {
      wrap: {
        backgroundColor: palette.iconSurface,
        borderColor: palette.border,
      },
      text: palette.primary,
      icon: palette.primary,
    };
  }, [timerTone, isDark, palette]);

  // ── Start attempt on mount ──
  useEffect(() => {
    if (!isExamMode && !ticketId) return;
    let cancelled = false;
    setIsStarting(true);

    const payload = isExamMode
      ? { mode: TestMode.EXAM as const }
      : { mode: TestMode.TICKET as const, ticketId };

    startTicketAsync(payload)
      .then((raw) => {
        if (cancelled) return;
        const data: TestAttempt = (raw as { data?: TestAttempt }).data ?? raw;
        const sorted = [...(data.responses ?? [])].sort(
          (a, b) => a.questionOrder - b.questionOrder
        );
        setAttempt({ ...data, responses: sorted.map((r) => ({ ...r })) });

        const first = sorted.findIndex(
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
  }, [ticketId, isExamMode, startTicketAsync]);

  // ── Exam countdown ──
  useEffect(() => {
    if (!isExamMode || !attempt) return;
    const t = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(t);
  }, [isExamMode, attempt?.id]);

  // ── Reset selection on question change ──
  useEffect(() => {
    if (!feedbackQId) {
      setSelectedAnswerId(null);
      setShowExplanation(false);
      qStart.current = Date.now();
    }
  }, [currentIndex, feedbackQId]);

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

  const exitToList = useCallback(() => {
    if (isExamMode) {
      router.replace("/(tabs)/exams");
    } else {
      router.replace("/(tabs)/tickets");
    }
  }, [isExamMode, router]);

  const refetchAttempt = useCallback(async (attemptId: string) => {
    const data = await getExamResult(attemptId);
    const next = examHistoryToAttempt(data);
    next.responses.sort((a, b) => a.questionOrder - b.questionOrder);
    setAttempt(next);

    const sorted = next.responses;
    const idxView = currentIndexRef.current;
    const currentOrder =
      sorted[idxView]?.questionOrder ?? sorted[0]?.questionOrder ?? 0;
    const idxAfter = sorted.findIndex(
      (r) =>
        r.selectedAnswerId === null &&
        !r.isSkipped &&
        r.questionOrder > currentOrder
    );
    const firstUnanswered = sorted.findIndex(
      (r) => r.selectedAnswerId === null && !r.isSkipped
    );
    const nextIdx =
      idxAfter !== -1 ? idxAfter : firstUnanswered !== -1 ? firstUnanswered : 0;
    setCurrentIndex(nextIdx);
    setTimeout(
      () => listRef.current?.scrollToIndex({ index: nextIdx, animated: true }),
      100
    );
  }, []);

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

      const merged = mergeSubmitIntoAttempt(attempt, result);
      setAttempt(merged);

      setResults((prev) => ({ ...prev, [resp.questionId]: result }));
      setFeedbackQId(resp.questionId);

      if (soundEffectsEnabled && !result.isSkipped) {
        void playAnswerFeedbackSound(
          result.isCorrect ? "correct" : "incorrect"
        );
      }

      const finishExam =
        isExamMode &&
        result.isExamFinished &&
        result.testStatus === "completed";

      if (finishExam) {
        const correct = merged.responses.filter(
          (r) => r.isCorrect === true
        ).length;
        const passingNum = merged.passingScore
          ? parseInt(merged.passingScore, 10)
          : 18;
        setExamSnapshot({
          correctAnswers: correct,
          totalQuestions: merged.totalQuestions ?? merged.responses.length,
          passingScore: passingNum,
        });
      }

      setTimeout(() => {
        setFeedbackQId(null);
        setSelectedAnswerId(null);

        if (finishExam) {
          if (result.failed) {
            setShowFailModal(true);
          } else {
            setShowSuccessModal(true);
          }
          return;
        }

        const afterMerge = merged.responses;
        const currentOrder = resp.questionOrder;
        const nextInOrder = afterMerge.findIndex(
          (r) =>
            r.selectedAnswerId === null &&
            !r.isSkipped &&
            r.questionOrder > currentOrder
        );

        if (nextInOrder !== -1) {
          const targetOrder = afterMerge[nextInOrder]!.questionOrder;
          const flatIdx = responses.findIndex(
            (r) => r.questionOrder === targetOrder
          );
          if (flatIdx >= 0) goTo(flatIdx);
        } else {
          const firstUn = afterMerge.findIndex(
            (r) => r.selectedAnswerId === null && !r.isSkipped
          );
          if (firstUn !== -1) goTo(firstUn);
          else if (currentIndex < responses.length - 1) goTo(currentIndex + 1);
        }
      }, FEEDBACK_DELAY_MS);
    } catch (e: unknown) {
      const err = e as {
        response?: { data?: { message?: string | string[] } };
        message?: string;
      };
      const raw = err?.response?.data?.message;
      const message = Array.isArray(raw) ? raw[0] : (raw ?? err?.message ?? "");

      if (message === "Question already answered" && attempt) {
        try {
          await refetchAttempt(attempt.id);
        } catch {
          /* ignore */
        }
        return;
      }
      if (message === "Test is not in progress") {
        exitToList();
      }
    }
  }, [
    attempt,
    selectedAnswerId,
    isSubmitting,
    responses,
    currentIndex,
    submitAnswerAsync,
    goTo,
    isExamMode,
    exitToList,
    refetchAttempt,
    soundEffectsEnabled,
  ]);

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
      const isAnswered = !!submittedId || item.answeredAt != null;
      const showFB = feedbackQId === item.questionId;

      const getFeedback = (a: Answer): FeedbackKind => {
        if (showFB) {
          if (a.id === submittedId && wasCorrect) return "correct";
          if (a.id === submittedId && !wasCorrect) return "incorrect";
          if (!wasCorrect && a.isCorrect) return "reveal";
          return null;
        }
        if (isAnswered) {
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
            <ImagePreview
              uri={`${API_CONFIG.API_URL}/images/${q.imageUrl}.webp`}
              width={SCREEN_WIDTH - 32}
              height={IMAGE_HEIGHT}
            />
          )}

          <View className={q.imageUrl ? "mt-4 gap-1" : "gap-1"}>
            <Text
              className="text-xl font-bold leading-tight tracking-tight"
              style={{ color: palette.foreground }}
            >
              {q.text}
            </Text>
          </View>

          {!isExamMode && !!q.explanation && (
            <Pressable
              onPress={() => setShowExplanation((v) => !v)}
              className="mt-4 flex-row items-center gap-2 self-start rounded-xl border px-3 py-2"
              style={{
                borderColor: isDark ? "rgba(251,191,36,0.35)" : "#fde68a",
                backgroundColor: isDark ? "rgba(251,191,36,0.12)" : "#fffbeb",
              }}
            >
              <MaterialIcons
                name="lightbulb-outline"
                size={20}
                color={isDark ? "#fbbf24" : "#d97706"}
              />
              <Text
                className="text-sm font-bold"
                style={{ color: isDark ? "#fcd34d" : "#92400e" }}
              >
                {showExplanation
                  ? t("hide_explanation")
                  : t("show_explanation")}
              </Text>
              <MaterialIcons
                name={showExplanation ? "expand-less" : "expand-more"}
                size={22}
                color={isDark ? "#fbbf24" : "#92400e"}
              />
            </Pressable>
          )}

          {!isExamMode && showExplanation && !!q.explanation && (
            <View
              className="mt-3 rounded-xl border p-3"
              style={{
                borderColor: palette.border,
                backgroundColor: palette.card,
              }}
            >
              <Text
                className="text-sm leading-relaxed"
                style={{ color: palette.foreground }}
              >
                {q.explanation}
              </Text>
            </View>
          )}

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
                disabled={
                  isAnswered ||
                  showFB ||
                  (!isCurrent && !isAnswered) ||
                  !!showSuccessModal ||
                  !!showFailModal
                }
                onPress={() => {
                  if (!feedbackQId && !showSuccessModal && !showFailModal)
                    setSelectedAnswerId(a.id);
                }}
              />
            ))}
          </View>
        </ScrollView>
      );
    },
    [
      currentIndex,
      selectedAnswerId,
      results,
      feedbackQId,
      isExamMode,
      showExplanation,
      showSuccessModal,
      showFailModal,
      palette,
      isDark,
      t,
    ]
  );

  if (isStarting) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: palette.background }}
        edges={["top"]}
      >
        <LoadingSkeleton />
      </SafeAreaView>
    );
  }

  if ((!isExamMode && !ticketId) || !attempt || responses.length === 0) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: palette.background }}
        edges={["top"]}
      >
        <View className="flex-1 items-center justify-center gap-4">
          <MaterialIcons
            name="error-outline"
            size={48}
            color={palette.chevron}
          />
          <Text
            className="text-base font-medium"
            style={{ color: palette.muted }}
          >
            {isExamMode ? t("exam_not_loaded") : t("ticket_not_found")}
          </Text>
          <Pressable
            onPress={exitToList}
            className="rounded-xl px-6 py-3"
            style={{ backgroundColor: palette.primary }}
          >
            <Text className="font-bold" style={{ color: palette.switchThumb }}>
              {t("back")}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const headerTitle = isExamMode ? t("exam") : ticketLabel;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: palette.background }}
      edges={["top"]}
    >
      <View
        className="flex-row items-center justify-between px-4 py-3"
        style={{
          backgroundColor: `${palette.background}CC`,
          borderBottomWidth: 1,
          borderBottomColor: palette.border,
        }}
      >
        <Pressable
          onPress={exitToList}
          className="h-10 w-10 items-center justify-center rounded-full active:opacity-70"
          hitSlop={8}
        >
          <MaterialIcons name="close" size={24} color={palette.foreground} />
        </Pressable>
        <Text
          className="flex-1 text-center text-lg font-bold leading-tight tracking-tight"
          style={{ color: palette.foreground }}
          numberOfLines={1}
        >
          {headerTitle}
        </Text>
        {isExamMode && remainingLabel ? (
          <View
            className="flex-row items-center gap-1 rounded-xl border px-2.5 py-1.5"
            style={timerStyles.wrap}
          >
            <MaterialIcons name="timer" size={20} color={timerStyles.icon} />
            <Text
              className="text-base font-bold tabular-nums"
              style={{ color: timerStyles.text }}
            >
              {remainingLabel}
            </Text>
          </View>
        ) : (
          <View className="h-10 w-10" />
        )}
      </View>

      <View className="gap-2 px-4 pb-2 pt-2">
        <View className="flex-row items-center justify-between">
          <Text
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: palette.foreground }}
          >
            {t("progress")}
          </Text>
          <Text
            className="text-sm font-bold"
            style={{ color: palette.primary }}
          >
            {answeredCount}/{total}
          </Text>
        </View>
        <View
          className="h-2 w-full overflow-hidden rounded-full"
          style={{ backgroundColor: palette.divider }}
        >
          <View
            className="h-full rounded-full"
            style={{ width: `${progress}%`, backgroundColor: palette.primary }}
          />
        </View>
      </View>

      <QuestionNumberBar
        responses={responses}
        currentIndex={currentIndex}
        results={results}
        onPress={goTo}
      />

      <FlatList
        ref={listRef}
        data={responses}
        renderItem={renderQuestion}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        scrollEnabled={!feedbackQId && !showSuccessModal && !showFailModal}
        getItemLayout={(_, i) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * i,
          index: i,
        })}
        extraData={[
          currentIndex,
          selectedAnswerId,
          results,
          feedbackQId,
          showExplanation,
          showSuccessModal,
          showFailModal,
          palette.foreground,
          isDark,
        ]}
      />

      {showConfirm && (
        <ConfirmButton onPress={handleConfirm} isSubmitting={isSubmitting} />
      )}

      {isExamMode && (
        <>
          <ExamSuccessModal
            visible={showSuccessModal}
            correctAnswers={examSnapshot.correctAnswers}
            totalQuestions={examSnapshot.totalQuestions}
            onContinue={() => {
              setShowSuccessModal(false);
              router.replace("/(tabs)");
            }}
            onResults={() => {
              setShowSuccessModal(false);
              if (attempt?.id) {
                router.replace(`/exams/result/${attempt.id}`);
              } else {
                router.replace("/(tabs)/exams");
              }
            }}
            onShare={async () => {
              try {
                await Share.share({
                  message: `Men ${examSnapshot.correctAnswers}/${examSnapshot.totalQuestions} savoldan to'g'ri yechdim!`,
                });
              } catch {
                /* cancelled */
              }
            }}
          />
          <ExamFailModal
            visible={showFailModal}
            correctAnswers={examSnapshot.correctAnswers}
            totalQuestions={examSnapshot.totalQuestions}
            passingScore={examSnapshot.passingScore}
            onReviewMistakes={() => {
              setShowFailModal(false);
              if (attempt?.id) {
                router.replace(`/exams/result/${attempt.id}`);
              } else {
                router.replace("/(tabs)/exams");
              }
            }}
            onTryAgain={() => {
              setShowFailModal(false);
              router.replace("/exams/start");
            }}
            onBackToStudy={() => {
              setShowFailModal(false);
              router.replace("/(tabs)/tickets");
            }}
          />
        </>
      )}
    </SafeAreaView>
  );
}
