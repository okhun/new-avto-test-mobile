import { queryClient } from "@/src/lib/query-client";
import {
  getPendingCount,
  processSyncQueue,
} from "@/src/services/sync/sync-queue.service";
import { isNetworkOrOfflineError } from "@/src/utils/network/errors";

type SyncListener = (status: SyncStatus) => void;

export type SyncStatus = "idle" | "syncing" | "success" | "failed";

let isProcessing = false;
let listeners: SyncListener[] = [];
let status: SyncStatus = "idle";

function setStatus(next: SyncStatus) {
  status = next;
  listeners.forEach((fn) => fn(next));
}

export function subscribeSyncStatus(listener: SyncListener): () => void {
  listeners.push(listener);
  listener(status);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export async function runBackgroundSync(): Promise<void> {
  if (isProcessing) return;

  const pending = await getPendingCount();
  if (pending === 0) {
    await refreshStaleQueries();
    return;
  }

  isProcessing = true;
  setStatus("syncing");

  try {
    const result = await processSyncQueue();
    await refreshStaleQueries();

    if (result.failed > 0) {
      setStatus("failed");
    } else if (result.synced > 0) {
      setStatus("success");
    } else {
      setStatus("idle");
    }
  } catch (error) {
    if (!isNetworkOrOfflineError(error)) {
      setStatus("failed");
    } else {
      setStatus("idle");
    }
  } finally {
    isProcessing = false;
    setTimeout(() => setStatus("idle"), 2500);
  }
}

async function refreshStaleQueries(): Promise<void> {
  await Promise.allSettled([
    queryClient.invalidateQueries({ queryKey: ["gemificationSummary"] }),
    queryClient.invalidateQueries({ queryKey: ["examHistory"] }),
    queryClient.invalidateQueries({ queryKey: ["practice", "tickets-history"] }),
    queryClient.invalidateQueries({ queryKey: ["auth", "me"] }),
    queryClient.invalidateQueries({ queryKey: ["userBadges"] }),
    queryClient.invalidateQueries({ queryKey: ["leaderboard"] }),
    queryClient.invalidateQueries({ queryKey: ["myRank"] }),
  ]);
}

export function getSyncStatus(): SyncStatus {
  return status;
}
