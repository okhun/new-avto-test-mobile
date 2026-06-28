import { ApiError, isAuthError, isNetworkOrOfflineError, normalizeApiError } from "@/src/utils/network/errors";

export function getQueryErrorState(error: unknown, isOffline: boolean) {
  if (isOffline || isNetworkOrOfflineError(error)) {
    return "offline" as const;
  }

  const normalized = normalizeApiError(error);
  if (normalized instanceof ApiError && normalized.status >= 500) {
    return "server" as const;
  }

  if (isAuthError(normalized)) {
    return "auth" as const;
  }

  return "error" as const;
}
