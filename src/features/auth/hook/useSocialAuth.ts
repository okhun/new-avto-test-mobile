import { api } from "@/services/api/axios";
import {
  googleMobileExchange,
  telegramBotPoll,
  telegramBotStart,
} from "@/src/features/auth/api/auth.api";
import type { GetMeResponse } from "@/src/features/auth/types/auth.types";
import { useAuthStore } from "@/src/store/auth.store";
import { API_CONFIG } from "@/src/utils/constants";
import * as Application from "expo-application";
import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useCallback } from "react";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

type SocialAuthResult =
  | { ok: true }
  | { ok: false; reason: "cancel" | "error" | "timeout"; message?: string };

async function resolveDeviceId(): Promise<string | undefined> {
  try {
    const id =
      Platform.OS === "ios"
        ? await Application.getIosIdForVendorAsync()
        : Application.getAndroidId();
    if (id && id.trim()) return id.trim();
  } catch {
    // fallback below
  }
  return `device-${Platform.OS}-${Date.now()}`;
}

function parseSocialError(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (error && typeof error === "object" && "response" in error) {
    const axiosErr = error as {
      response?: { data?: { message?: string | string[] } };
    };
    const msg = axiosErr.response?.data?.message;
    if (Array.isArray(msg) && msg.length > 0) return String(msg[0]);
    if (typeof msg === "string" && msg.trim()) return msg;
  }
  return "Ijtimoiy login amalga oshmadi";
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

/** Total time to wait for the user to tap "Start" in Telegram and return. */
const TELEGRAM_AUTH_TIMEOUT_MS = 180_000; // 3 minutes
/** How often we ask the backend whether the bot login completed. */
const TELEGRAM_POLL_INTERVAL_MS = 2_000;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useSocialAuth() {
  /**
   * Google login via the backend Passport bridge (same server-side flow as web).
   *
   * Avoids auth.expo.io and native client-ID redirect issues in Expo Go:
   *   1. open `${API}/auth/google/mobile/login?redirect=<deepLink>` in browser
   *   2. backend runs Passport Google OAuth → callback issues one-time code
   *   3. deep link returns `?code=` → exchange for JWT tokens
   */
  const loginWithGoogle = useCallback(async (): Promise<SocialAuthResult> => {
    // Path MUST match an existing expo-router screen (e.g. app/auth.tsx).
    // Android delivers the OAuth deep link to the router before openAuthSessionAsync
    // resolves; an unknown path like "google-auth" flashes the Unmatched Route page.
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: "avtotestmobile",
      path: "auth",
    });

    const authUrl =
      `${API_CONFIG.BASE_URL}/auth/google/mobile/login` +
      `?redirect=${encodeURIComponent(redirectUri)}`;

    if (__DEV__) {
      console.log("[Google Auth] backend bridge, redirectUri:", redirectUri);
    }

    try {
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUri,
      );

      if (result.type === "cancel" || result.type === "dismiss") {
        return { ok: false, reason: "cancel" };
      }

      if (result.type !== "success" || !result.url) {
        return {
          ok: false,
          reason: "error",
          message: "Google login amalga oshmadi",
        };
      }

      const { queryParams } = Linking.parse(result.url);
      const code = queryParams?.code;
      const error = queryParams?.error;

      if (error) {
        return {
          ok: false,
          reason: "error",
          message: typeof error === "string" ? error : "Google auth failed",
        };
      }

      if (typeof code !== "string" || !code) {
        return {
          ok: false,
          reason: "error",
          message: "Google kod olinmadi",
        };
      }

      const { data } = await googleMobileExchange({ code });
      await persistAuthAndUser(data.accessToken, data.refreshToken);
      return { ok: true };
    } catch (error) {
      return { ok: false, reason: "error", message: parseSocialError(error) };
    }
  }, []);

  /**
   * Native Telegram login via the bot (no registered web domain required):
   *   1. ask the backend for a nonce + `t.me/<bot>?start=<nonce>` deep link
   *   2. open Telegram so the user taps "Start"
   *   3. poll the backend until the bot webhook has issued our tokens
   */
  const loginWithTelegram = useCallback(async (): Promise<SocialAuthResult> => {
    try {
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

        if (
          data.status === "ready" &&
          data.accessToken &&
          data.refreshToken
        ) {
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
    } catch (error) {
      return { ok: false, reason: "error", message: parseSocialError(error) };
    }
  }, []);

  return {
    loginWithGoogle,
    loginWithTelegram,
  };
}
