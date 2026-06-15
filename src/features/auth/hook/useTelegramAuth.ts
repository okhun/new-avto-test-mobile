import { api } from "@/services/api/axios";
import { telegramExchange } from "@/src/features/auth/api/auth.api";
import type { GetMeResponse } from "@/src/features/auth/types/auth.types";
import { useAuthStore } from "@/src/store/auth.store";
import { API_CONFIG } from "@/src/utils/constants";
import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useCallback } from "react";

WebBrowser.maybeCompleteAuthSession();

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

/**
 * Telegram OpenID Connect (OIDC) login — the single shared Telegram auth used
 * by web and mobile. The backend is the confidential OIDC client; the app only:
 *   1. opens `${API}/auth/telegram/login?platform=mobile&redirect=<deepLink>`
 *      in an in-app auth session,
 *   2. receives a one-time `code` (or `error`) on the deep link,
 *   3. exchanges the code for tokens via `POST /auth/telegram/exchange`.
 *
 * No Telegram domain/scheme registration is needed for the app: only the
 * backend callback URL is registered with Telegram.
 */
export function useTelegramAuth() {
  const loginWithTelegram = useCallback(async (): Promise<TelegramAuthResult> => {
    const scheme = process.env.EXPO_PUBLIC_TELEGRAM_REDIRECT_SCHEME || undefined;
    const redirectUri = AuthSession.makeRedirectUri(
      scheme ? { scheme } : undefined
    );

    const authUrl =
      `${API_CONFIG.BASE_URL}/auth/telegram/login` +
      `?platform=mobile&redirect=${encodeURIComponent(redirectUri)}`;

    try {
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUri
      );

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

      const { queryParams } = Linking.parse(result.url);
      const code = queryParams?.code;
      const error = queryParams?.error;

      if (error) {
        return {
          ok: false,
          reason: "error",
          message: typeof error === "string" ? error : "Telegram auth failed",
        };
      }

      if (typeof code !== "string" || !code) {
        return {
          ok: false,
          reason: "error",
          message: "Telegram kod olinmadi",
        };
      }

      const { data } = await telegramExchange({ code });
      await persistAuthAndUser(data.accessToken, data.refreshToken);
      return { ok: true };
    } catch (err) {
      return { ok: false, reason: "error", message: parseError(err) };
    }
  }, []);

  return { loginWithTelegram };
}
