import { api } from "@/services/api/axios";
import {
  telegramBotPoll,
  telegramBotStart,
  telegramExchange,
} from "@/src/features/auth/api/auth.api";
import type { GetMeResponse } from "@/src/features/auth/types/auth.types";
import { useAuthStore } from "@/src/store/auth.store";
import { API_CONFIG } from "@/src/utils/constants";
import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useCallback } from "react";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

const TELEGRAM_AUTH_TIMEOUT_MS = 180_000;
const TELEGRAM_POLL_INTERVAL_MS = 2_000;

export type TelegramAuthResult =
  | { ok: true }
  | { ok: false; reason: "cancel" | "error" | "timeout"; message?: string };

function parseError(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (error && typeof error === "object" && "response" in error) {
    const axiosErr = error as {
      response?: { data?: { message?: string | string[] } };
    };
    const msg = axiosErr.response?.data?.message;
    if (Array.isArray(msg) && msg.length > 0) return String(msg[0]);
    if (typeof msg === "string" && msg.trim()) return msg;
  }
  return "Telegram orqali kirish amalga oshmadi";
}

async function persistAuthAndUser(accessToken: string, refreshToken: string) {
  const store = useAuthStore.getState();
  await store.setAccessToken(accessToken);
  await store.setRefreshToken(refreshToken);

  try {
    const { data } = await api.get<GetMeResponse>("/users/me");
    await store.setUser({
      id: data.id,
      email: data.email,
      phoneNumber: data.phoneNumber,
      avatarUrl: data.avatarUrl ?? null,
      provider: data.provider,
      isGuest: data.isGuest,
      displayName: data.displayName,
    });
  } catch {
    await store.logout();
    throw new Error("Foydalanuvchi ma'lumotini olishda xatolik");
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function buildOidcRedirectUri(): string {
  const scheme =
    process.env.EXPO_PUBLIC_TELEGRAM_REDIRECT_SCHEME || "avtotestmobile";
  return AuthSession.makeRedirectUri({ scheme, path: "auth" });
}

function parseOAuthParams(url: string): { code?: string; error?: string } {
  const { queryParams } = Linking.parse(url);
  return {
    code:
      typeof queryParams?.code === "string" ? queryParams.code : undefined,
    error:
      typeof queryParams?.error === "string" ? queryParams.error : undefined,
  };
}

async function exchangeCodeAndPersist(
  code: string,
): Promise<TelegramAuthResult> {
  const { data } = await telegramExchange({ code });
  await persistAuthAndUser(data.accessToken, data.refreshToken);
  return { ok: true };
}

/**
 * Android: native bot flow (open Telegram → tap Start → poll backend).
 * Avoids broken OIDC deep-link handoff when Telegram opens externally.
 */
async function loginWithTelegramBot(): Promise<TelegramAuthResult> {
  const { data: start } = await telegramBotStart();
  if (!start?.nonce || !start?.botUrl) {
    return {
      ok: false,
      reason: "error",
      message: "Telegram login boshlanmadi",
    };
  }

  try {
    await Linking.openURL(start.botUrl);
  } catch {
    await WebBrowser.openBrowserAsync(start.botUrl);
  }

  const deadline = Date.now() + TELEGRAM_AUTH_TIMEOUT_MS;
  while (Date.now() < deadline) {
    await delay(TELEGRAM_POLL_INTERVAL_MS);

    const { data } = await telegramBotPoll(start.nonce);

    if (data.status === "ready" && data.accessToken && data.refreshToken) {
      await persistAuthAndUser(data.accessToken, data.refreshToken);
      return { ok: true };
    }

    if (data.status === "expired") {
      return {
        ok: false,
        reason: "error",
        message: "Telegram login muddati tugadi, qayta urinib ko'ring",
      };
    }
  }

  return {
    ok: false,
    reason: "timeout",
    message: "Telegram orqali kirish vaqti tugadi",
  };
}

/** iOS: Telegram OIDC via in-app auth session (works reliably on iOS). */
async function loginWithTelegramOidc(): Promise<TelegramAuthResult> {
  const redirectUri = buildOidcRedirectUri();
  const authUrl =
    `${API_CONFIG.BASE_URL}/auth/telegram/login` +
    `?platform=mobile&redirect=${encodeURIComponent(redirectUri)}`;

  const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

  if (result.type === "cancel" || result.type === "dismiss") {
    return { ok: false, reason: "cancel" };
  }

  if (result.type !== "success" || !result.url) {
    return {
      ok: false,
      reason: "error",
      message: "Telegram login amalga oshmadi",
    };
  }

  const { code, error } = parseOAuthParams(result.url);
  if (error) {
    return { ok: false, reason: "error", message: error };
  }
  if (!code) {
    return {
      ok: false,
      reason: "error",
      message: "Telegram kod olinmadi",
    };
  }

  return exchangeCodeAndPersist(code);
}

/**
 * Telegram login — platform-specific strategy:
 * - **Android**: bot + polling (no OIDC deep link; survives Telegram app handoff)
 * - **iOS**: OIDC auth session (in-app browser returns code directly)
 *
 * Both paths reuse the same backend user records and JWT issuance.
 */
export function useTelegramAuth() {
  const loginWithTelegram =
    useCallback(async (): Promise<TelegramAuthResult> => {
      try {
        if (Platform.OS === "android") {
          return await loginWithTelegramBot();
        }
        return await loginWithTelegramOidc();
      } catch (err) {
        return { ok: false, reason: "error", message: parseError(err) };
      }
    }, []);

  return { loginWithTelegram };
}
