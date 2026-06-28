import type { RefreshTokensResponse } from "@/src/features/auth/types/auth.types";
import { getAcceptLanguage } from "@/src/lib/api-client";
import { useAuthStore } from "@/src/store/auth.store";
import {
  isAuthError,
  isNetworkOrOfflineError,
  normalizeApiError,
} from "@/src/utils/network/errors";
import { API_CONFIG, STORAGE_KEYS } from "@/src/utils/constants";
import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
  isAxiosError,
} from "axios";
import * as SecureStore from "expo-secure-store";
import { api } from "./axios";

type RetriedConfig = InternalAxiosRequestConfig & { _retry?: boolean };

/** Concurrent 401 responses share one refresh + rotation (matches web `$api`). */
let refreshPromise: Promise<string> | null = null;

let onLogoutCallback: (() => void | Promise<void>) | null = null;

export function setLogoutCallback(cb: (() => void | Promise<void>) | null) {
  onLogoutCallback = cb;
}

const PUBLIC_AUTH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/guest",
  "/auth/oauth",
  "/auth/telegram",
  "/auth/phone/",
  "/auth/refresh",
  "/auth/logout",
] as const;

function combinedRequestUrl(config: InternalAxiosRequestConfig): string {
  const base = config.baseURL ?? api.defaults.baseURL ?? "";
  const path = config.url ?? "";
  return `${base}${path}`;
}

function shouldSkipRefreshForUrl(config: InternalAxiosRequestConfig): boolean {
  const url = combinedRequestUrl(config);
  return PUBLIC_AUTH_PATHS.some((p) => url.includes(p));
}

function setRequestBearerAndLanguage(
  config: InternalAxiosRequestConfig,
  accessToken: string
) {
  const authHeader = `Bearer ${accessToken}`;
  const lang = getAcceptLanguage();
  if (typeof config.headers?.set === "function") {
    config.headers.set("Authorization", authHeader);
    config.headers.set("Accept-Language", lang);
    return;
  }
  Object.assign(config.headers as Record<string, string>, {
    Authorization: authHeader,
    "Accept-Language": lang,
  });
}

function setApiDefaultBearer(accessToken: string) {
  const common = api.defaults.headers.common;
  if (typeof common === "object" && common !== null) {
    (common as Record<string, string>).Authorization = `Bearer ${accessToken}`;
  }
}

const getRefreshToken = () =>
  SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);

/** Uses plain axios so this never loops through interceptors (avoids refresh-on-refresh). */
async function refreshTokensByBody(
  refreshToken: string
): Promise<RefreshTokensResponse> {
  const { data } = await axios.post<RefreshTokensResponse>(
    `${API_CONFIG.BASE_URL}/auth/refresh`,
    { refreshToken },
    {
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": getAcceptLanguage(),
      },
    }
  );
  return data;
}

async function refreshAccessTokenChain(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const rt = await getRefreshToken();
    if (!rt) throw new Error("No refresh token");

    const data = await refreshTokensByBody(rt);
    const store = useAuthStore.getState();

    await store.setAccessToken(data.accessToken);
    await store.setRefreshToken(data.refreshToken);

    if (data.user) {
      await store.setUser({
        id: data.user.id,
        displayName: data.user.displayName,
        email: data.user.email,
        phoneNumber: data.user.phoneNumber,
        avatarUrl: data.user.avatarUrl,
        provider: data.user.provider,
        isGuest: data.user.isGuest,
      });
    }

    setApiDefaultBearer(data.accessToken);

    return data.accessToken;
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

async function logoutFromInterceptor() {
  if (onLogoutCallback) await Promise.resolve(onLogoutCallback());
  else await useAuthStore.getState().logout();
}

api.interceptors.request.use(
  async (config) => {
    const lang = getAcceptLanguage();
    if (typeof config.headers.set === "function") {
      config.headers.set("Accept-Language", lang);
    } else {
      (config.headers as Record<string, string>)["Accept-Language"] = lang;
    }

    const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      if (typeof config.headers.set === "function") {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        (config.headers as Record<string, string>).Authorization =
          `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(normalizeApiError(error))
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { config?: RetriedConfig }) => {
    if (!isAxiosError(error) || !error.config) {
      return Promise.reject(normalizeApiError(error));
    }

    const originalRequest = error.config as RetriedConfig;
    const status = error.response?.status;

    if (status !== 401) {
      return Promise.reject(normalizeApiError(error));
    }

    if (shouldSkipRefreshForUrl(originalRequest)) {
      return Promise.reject(normalizeApiError(error));
    }

    if (originalRequest._retry) {
      await logoutFromInterceptor();
      return Promise.reject(normalizeApiError(error));
    }

    originalRequest._retry = true;

    try {
      const accessToken = await refreshAccessTokenChain();
      setRequestBearerAndLanguage(originalRequest, accessToken);
      return api(originalRequest);
    } catch (refreshError) {
      const normalizedRefresh = normalizeApiError(refreshError);

      if (isNetworkOrOfflineError(normalizedRefresh)) {
        return Promise.reject(normalizedRefresh);
      }

      if (isAuthError(normalizedRefresh)) {
        await logoutFromInterceptor();
      }

      return Promise.reject(normalizeApiError(error));
    }
  }
);
