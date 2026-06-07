import { api } from "@/services/api/axios";
import { oauthLogin, telegramAuth } from "@/src/features/auth/api/auth.api";
import type { GetMeResponse } from "@/src/features/auth/types/auth.types";
import { useAuthStore } from "@/src/store/auth.store";
import { GOOGLE_CONFIG } from "@/src/utils/constants";
import * as Application from "expo-application";
import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useMemo } from "react";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

type SocialAuthResult =
  | { ok: true }
  | { ok: false; reason: "cancel" | "error"; message?: string };

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

function buildTelegramPayload(url: string) {
  const parsed = Linking.parse(url);
  const query = parsed.queryParams ?? {};

  const idRaw = query.id;
  const authDateRaw = query.auth_date;
  const hashRaw = query.hash;
  const firstNameRaw = query.first_name;

  const id = Number(idRaw);
  const auth_date = Number(authDateRaw);
  const hash = typeof hashRaw === "string" ? hashRaw : "";
  const first_name = typeof firstNameRaw === "string" ? firstNameRaw : "";

  if (
    !Number.isFinite(id) ||
    !Number.isFinite(auth_date) ||
    !hash ||
    !first_name
  ) {
    throw new Error("Telegram javobi noto'g'ri formatda keldi");
  }

  return {
    id,
    first_name,
    last_name: typeof query.last_name === "string" ? query.last_name : "",
    username: typeof query.username === "string" ? query.username : "",
    photo_url: typeof query.photo_url === "string" ? query.photo_url : "",
    auth_date,
    hash,
  };
}

export function useSocialAuth() {
  const redirectUri = useMemo(() => AuthSession.makeRedirectUri(), []);

  const googleExpoClientId = GOOGLE_CONFIG.EXPO_CLIENT_ID;
  const googleWebClientId = GOOGLE_CONFIG.WEB_CLIENT_ID ?? googleExpoClientId;
  const [googleRequest, , promptGoogleAsync] = Google.useAuthRequest({
    responseType: "token",
    scopes: ["openid", "profile", "email"],
    clientId: googleWebClientId,
    redirectUri,
  });

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

      const googleAccessToken =
        result.authentication?.accessToken ?? result.params?.access_token;
      if (!googleAccessToken) {
        return {
          ok: false,
          reason: "error",
          message: "Google access token olinmadi",
        };
      }

      const deviceId = await resolveDeviceId();
      const { data } = await oauthLogin({
        provider: "google",
        accessToken: googleAccessToken,
        deviceId,
      });

      await persistAuthAndUser(data.accessToken, data.refreshToken);
      return { ok: true };
    } catch (error) {
      return { ok: false, reason: "error", message: parseSocialError(error) };
    }
  }, [googleRequest, promptGoogleAsync]);

  const loginWithTelegram = useCallback(async (): Promise<SocialAuthResult> => {
    try {
      const botId = process.env.EXPO_PUBLIC_TELEGRAM_BOT_ID;
      console.log("botId", botId);
      if (!botId) {
        return {
          ok: false,
          reason: "error",
          message: "Telegram bot ID topilmadi",
        };
      }
      const telegramAllowedDomain = "https://avto-test.uz";
      console.log("redirectUri", redirectUri);
      const authUrl =
        "https://oauth.telegram.org/auth" +
        `?bot_id=${encodeURIComponent(botId)}` +
        `&origin=${encodeURIComponent(telegramAllowedDomain)}` + // <-- Verified domain goes here
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        "&embed=1";

      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUri
      );

      if (result.type !== "success" || !result.url) {
        return { ok: false, reason: "cancel" };
      }

      const payload = buildTelegramPayload(result.url);
      const { data } = await telegramAuth(payload);
      await persistAuthAndUser(data.accessToken, data.refreshToken);
      return { ok: true };
    } catch (error) {
      return { ok: false, reason: "error", message: parseSocialError(error) };
    }
  }, [redirectUri]);

  return {
    loginWithGoogle,
    loginWithTelegram,
  };
}
