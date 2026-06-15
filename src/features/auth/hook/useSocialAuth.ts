import { api } from "@/services/api/axios";
import {
  oauthLogin,
  telegramBotPoll,
  telegramBotStart,
} from "@/src/features/auth/api/auth.api";
import type { GetMeResponse } from "@/src/features/auth/types/auth.types";
import { useAuthStore } from "@/src/store/auth.store";
import { GOOGLE_CONFIG } from "@/src/utils/constants";
import * as Application from "expo-application";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import Constants, { ExecutionEnvironment } from "expo-constants";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useMemo } from "react";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

/** True when running inside the Expo Go app (not a dev/production build). */
const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

/**
 * Expo Go cannot use native iOS/Android Google client IDs — Google rejects the
 * dynamic `exp://` redirect with Error 400 invalid_request. Use the Web client
 * ID with a stable https://auth.expo.io/@owner/slug redirect instead.
 */
function resolveExpoGoRedirectUri(): string {
  if (GOOGLE_CONFIG.EXPO_REDIRECT_URI) {
    return GOOGLE_CONFIG.EXPO_REDIRECT_URI;
  }
  const owner = Constants.expoConfig?.owner;
  const slug = Constants.expoConfig?.slug;
  if (owner && slug) {
    return `https://auth.expo.io/@${owner}/${slug}`;
  }
  return AuthSession.makeRedirectUri({
    scheme: "avtotestmobile",
    path: "redirect",
  });
}

function buildGoogleAuthRequestConfig() {
  if (isExpoGo) {
    const redirectUri = resolveExpoGoRedirectUri();
    if (__DEV__) {
      console.log(
        "[Google Auth] Expo Go — using Web client ID, redirectUri:",
        redirectUri,
      );
    }
    return {
      clientId: GOOGLE_CONFIG.WEB_CLIENT_ID,
      webClientId: GOOGLE_CONFIG.WEB_CLIENT_ID,
      redirectUri,
    };
  }

  return {
    webClientId: GOOGLE_CONFIG.WEB_CLIENT_ID,
    iosClientId: GOOGLE_CONFIG.IOS_CLIENT_ID,
    androidClientId: GOOGLE_CONFIG.ANDROID_CLIENT_ID,
  };
}

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
  const googleAuthConfig = useMemo(() => buildGoogleAuthRequestConfig(), []);

  // ID-token flow: Google returns an OIDC `id_token` we hand to the backend for
  // cryptographic verification. In Expo Go we force the Web client ID + https
  // redirect; in EAS builds the provider uses the iOS/Android client IDs.
  const [googleRequest, , promptGoogleAsync] =
    Google.useIdTokenAuthRequest(googleAuthConfig);

  const loginWithGoogle = useCallback(async (): Promise<SocialAuthResult> => {
    if (!googleRequest) {
      return {
        ok: false,
        reason: "error",
        message: "Google OAuth sozlamalari topilmadi",
      };
    }

    try {
      const result = await promptGoogleAsync();
      if (result.type !== "success") {
        return { ok: false, reason: "cancel" };
      }

      const idToken = result.params?.id_token;
      if (!idToken) {
        return {
          ok: false,
          reason: "error",
          message: "Google ID token olinmadi",
        };
      }

      const deviceId = await resolveDeviceId();
      const { data } = await oauthLogin({
        provider: "google",
        idToken,
        deviceId,
      });

      await persistAuthAndUser(data.accessToken, data.refreshToken);
      return { ok: true };
    } catch (error) {
      return { ok: false, reason: "error", message: parseSocialError(error) };
    }
  }, [googleRequest, promptGoogleAsync]);

  /**
   * Native Telegram login via the bot (no registered web domain required):
   *   1. ask the backend for a nonce + `t.me/<bot>?start=<nonce>` deep link
   *   2. open Telegram so the user taps "Start"
   *   3. poll the backend until the bot webhook has issued our tokens
   *
   * Works in Expo Go, dev builds and standalone on both iOS and Android, and
   * gracefully falls back to web Telegram if the app isn't installed.
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

      // Open the Telegram app (universal link) if installed, else the browser.
      try {
        await Linking.openURL(start.botUrl);
      } catch {
        await WebBrowser.openBrowserAsync(start.botUrl);
      }

      // Poll until the webhook fulfils the nonce or we hit the timeout. The
      // wall-clock deadline keeps working even if the OS suspends timers while
      // the app is backgrounded in Telegram.
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
        // status === "pending" -> keep polling
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
