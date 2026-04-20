import { api } from "@/services/api";
import type {
  AuthResponse,
  GetMeResponse,
  GuestLoginDto,
  LoginDto,
  RegisterDto,
  SocialAuthCallbackDto,
  SocialAuthUrlResponse,
  UpdateProfileDto,
} from "@/src/features/auth/types/auth.types";
import { API_CONFIG, STORAGE_KEYS } from "@/src/utils/constants";
import * as SecureStore from "expo-secure-store";

export const login = (data: LoginDto) =>
  api.post<AuthResponse>("/auth/login", data);

export const register = (data: RegisterDto) =>
  api.post<AuthResponse>("/auth/register", data);

export const guestLogin = (data: GuestLoginDto) =>
  api.post<AuthResponse>("/auth/guest", data);

export const logout = () => api.post<void>("/auth/logout");

export const getMe = () => api.get<GetMeResponse>("/users/me");

export const getMeData = () =>
  api.get<GetMeResponse>("/users/me").then((res) => res.data);

export const updateProfile = (data: UpdateProfileDto) =>
  api.patch<GetMeResponse>("/users/me", data).then((res) => res.data);

/** Multipart upload — uses fetch so RN FormData works reliably with the API. */
export async function uploadAvatarMultipart(file: {
  uri: string;
  name: string;
  type: string;
}): Promise<{ avatarUrl: string }> {
  const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
  const formData = new FormData();
  formData.append("file", {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as unknown as Blob);

  const res = await fetch(`${API_CONFIG.BASE_URL}/users/avatar/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  const text = await res.text();
  let json: Record<string, unknown> = {};
  try {
    json = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    /* ignore */
  }

  if (!res.ok) {
    const raw = json.message;
    const msg = Array.isArray(raw)
      ? String(raw[0])
      : typeof raw === "string"
        ? raw
        : "Yuklash muvaffaqiyatsiz";
    throw new Error(msg);
  }

  const data = json.data as Record<string, unknown> | undefined;
  const avatarUrl =
    (typeof json.avatarUrl === "string" && json.avatarUrl) ||
    (data && typeof data.avatarUrl === "string" && data.avatarUrl) ||
    (typeof json.url === "string" && json.url);

  if (!avatarUrl) {
    throw new Error("Server javobida avatar manzili yo'q");
  }
  return { avatarUrl };
}

export const deleteMyAccount = () =>
  api.delete("/users/me").then(() => undefined);

export const getGoogleAuthUrl = () =>
  api.get<SocialAuthUrlResponse>("/auth/google");

export const googleCallback = (data: SocialAuthCallbackDto) =>
  api.post<AuthResponse>("/auth/google/callback", data);

export const getTelegramAuthUrl = () =>
  api.get<SocialAuthUrlResponse>("/auth/telegram");

export const telegramCallback = (data: SocialAuthCallbackDto) =>
  api.post<AuthResponse>("/auth/telegram/callback", data);
