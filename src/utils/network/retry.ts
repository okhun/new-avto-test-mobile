import { ApiError, isNetworkOrOfflineError, normalizeApiError } from "@/src/utils/network/errors";

export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (isNetworkOrOfflineError(error)) return false;
  const normalized = normalizeApiError(error);
  if (normalized instanceof ApiError && normalized.status >= 400 && normalized.status < 500) {
    return false;
  }
  return failureCount < 2;
}

export function shouldRetryMutation(failureCount: number, error: unknown): boolean {
  if (isNetworkOrOfflineError(error)) return false;
  return failureCount < 1;
}
