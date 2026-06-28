import type { SubmitAnswerResult } from "@/src/features/practice/types/practice.types";
import { enqueueSubmit } from "@/src/services/sync/sync-queue.service";
import {
  isNetworkOrOfflineError,
  normalizeApiError,
} from "@/src/utils/network/errors";

export class QueuedSubmitError extends Error {
  readonly queued = true;
  readonly pendingResult: SubmitAnswerResult;

  constructor(pendingResult: SubmitAnswerResult) {
    super("Answer saved locally and will sync when online");
    this.name = "QueuedSubmitError";
    this.pendingResult = pendingResult;
  }
}

export function buildPendingSubmitResult(params: {
  responseId: string;
  testId: string;
  questionId: string;
  answerId: string;
  timeSpentSeconds: number;
  questionOrder: number;
  testStatus: SubmitAnswerResult["testStatus"];
}): SubmitAnswerResult {
  const now = new Date().toISOString();
  return {
    id: params.responseId,
    createdAt: now,
    updatedAt: now,
    testAttemptId: params.testId,
    questionId: params.questionId,
    selectedAnswerId: params.answerId,
    isCorrect: false,
    isSkipped: false,
    timeSpentSeconds: params.timeSpentSeconds,
    questionOrder: params.questionOrder,
    answeredAt: now,
    testStatus: params.testStatus,
    isExamFinished: false,
    failed: false,
  };
}

export async function submitAnswerWithOfflineSupport(params: {
  testId: string;
  questionId: string;
  answerId: string;
  timeSpentSeconds: number;
  responseId: string;
  questionOrder: number;
  testStatus: SubmitAnswerResult["testStatus"];
}): Promise<SubmitAnswerResult> {
  try {
    const { submitAnswer } = await import(
      "@/src/features/practice/api/practice.api"
    );
    return await submitAnswer(params.testId, {
      questionId: params.questionId,
      answerId: params.answerId,
      timeSpentSeconds: params.timeSpentSeconds,
    });
  } catch (error) {
    const normalized = normalizeApiError(error);
    if (!isNetworkOrOfflineError(normalized)) {
      throw normalized;
    }

    await enqueueSubmit({
      testId: params.testId,
      questionId: params.questionId,
      answerId: params.answerId,
      timeSpentSeconds: params.timeSpentSeconds,
    });

    throw new QueuedSubmitError(buildPendingSubmitResult(params));
  }
}
