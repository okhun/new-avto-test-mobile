import { isAxiosError } from "axios";

export class OfflineError extends Error {
  readonly isOffline = true;

  constructor(message = "No internet connection") {
    super(message);
    this.name = "OfflineError";
  }
}

export class TimeoutError extends Error {
  readonly isTimeout = true;

  constructor(message = "Request timed out") {
    super(message);
    this.name = "TimeoutError";
  }
}

export class ApiError extends Error {
  readonly status: number;
  readonly data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function isNetworkOrOfflineError(error: unknown): boolean {
  if (error instanceof OfflineError) return true;

  if (!isAxiosError(error)) {
    if (error instanceof Error) {
      const msg = error.message.toLowerCase();
      return (
        msg.includes("network error") ||
        msg.includes("network request failed") ||
        msg.includes("failed to fetch")
      );
    }
    return false;
  }

  if (error.code === "ERR_NETWORK" || error.code === "ECONNABORTED") {
    return true;
  }

  if (!error.response) return true;

  return false;
}

export function isTimeoutError(error: unknown): boolean {
  if (error instanceof TimeoutError) return true;
  return isAxiosError(error) && error.code === "ECONNABORTED";
}

export function isAuthError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 401 || error.status === 403;
  }
  if (isAxiosError(error)) {
    const status = error.response?.status;
    return status === 401 || status === 403;
  }
  return false;
}

export function normalizeApiError(error: unknown): Error {
  if (error instanceof OfflineError || error instanceof ApiError) {
    return error;
  }

  if (isNetworkOrOfflineError(error)) {
    if (isTimeoutError(error)) {
      return new TimeoutError();
    }
    return new OfflineError();
  }

  if (isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as
      | { message?: string | string[] }
      | undefined;
    const raw = data?.message;
    const message = Array.isArray(raw)
      ? raw[0]
      : raw ?? error.message ?? "Request failed";

    if (status) {
      return new ApiError(status, message, data);
    }
  }

  if (error instanceof Error) return error;
  return new Error("Unknown error");
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Unknown error";
}
