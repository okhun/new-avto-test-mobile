import AsyncStorage from "@react-native-async-storage/async-storage";
import { submitAnswer } from "@/src/features/practice/api/practice.api";
import type { SubmitAnswerResult } from "@/src/features/practice/types/practice.types";

const QUEUE_KEY = "autotest_sync_queue";

export type PendingSubmitPayload = {
  id: string;
  testId: string;
  questionId: string;
  answerId: string;
  timeSpentSeconds: number;
  createdAt: number;
  retryCount: number;
};

type QueueListener = (count: number) => void;

let listeners: QueueListener[] = [];

function notify(count: number) {
  listeners.forEach((fn) => fn(count));
}

async function readQueue(): Promise<PendingSubmitPayload[]> {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PendingSubmitPayload[];
  } catch {
    return [];
  }
}

async function writeQueue(items: PendingSubmitPayload[]): Promise<void> {
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(items));
  notify(items.length);
}

export function subscribeSyncQueue(listener: QueueListener): () => void {
  listeners.push(listener);
  void readQueue().then((q) => listener(q.length));
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export async function getPendingCount(): Promise<number> {
  const queue = await readQueue();
  return queue.length;
}

export async function enqueueSubmit(
  payload: Omit<PendingSubmitPayload, "id" | "createdAt" | "retryCount">
): Promise<PendingSubmitPayload> {
  const queue = await readQueue();
  const existing = queue.find(
    (item) =>
      item.testId === payload.testId &&
      item.questionId === payload.questionId
  );

  if (existing) return existing;

  const item: PendingSubmitPayload = {
    ...payload,
    id: `${payload.testId}:${payload.questionId}:${Date.now()}`,
    createdAt: Date.now(),
    retryCount: 0,
  };

  queue.push(item);
  await writeQueue(queue);
  return item;
}

export async function removeFromQueue(id: string): Promise<void> {
  const queue = await readQueue();
  await writeQueue(queue.filter((item) => item.id !== id));
}

export async function processSyncQueue(): Promise<{
  synced: number;
  failed: number;
}> {
  const queue = await readQueue();
  if (!queue.length) return { synced: 0, failed: 0 };

  let synced = 0;
  let failed = 0;
  const remaining: PendingSubmitPayload[] = [];

  for (const item of queue) {
    try {
      await submitAnswer(item.testId, {
        questionId: item.questionId,
        answerId: item.answerId,
        timeSpentSeconds: item.timeSpentSeconds,
      });
      synced += 1;
    } catch {
      if (item.retryCount >= 5) {
        failed += 1;
        continue;
      }
      remaining.push({ ...item, retryCount: item.retryCount + 1 });
    }
  }

  await writeQueue(remaining);
  return { synced, failed };
}

export async function clearSyncQueue(): Promise<void> {
  await writeQueue([]);
}

export type { SubmitAnswerResult };
