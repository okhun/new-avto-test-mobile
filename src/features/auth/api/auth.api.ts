import { api } from "@/services/api";
import type {
  AuthResponse,
  GetMeResponse,
  GuestLoginDto,
  LoginDto,
  RegisterDto,
  SocialAuthCallbackDto,
  SocialAuthUrlResponse,
} from "@/src/features/auth/types/auth.types";

export const login = (data: LoginDto) =>
  api.post<AuthResponse>("/auth/login", data);

export const register = (data: RegisterDto) =>
  api.post<AuthResponse>("/auth/register", data);

export const guestLogin = (data: GuestLoginDto) =>
  api.post<AuthResponse>("/auth/guest", data);

export const logout = () => api.post<void>("/auth/logout");

export const getMe = () => api.get<GetMeResponse>("/users/me");

export const getGoogleAuthUrl = () =>
  api.get<SocialAuthUrlResponse>("/auth/google");

export const googleCallback = (data: SocialAuthCallbackDto) =>
  api.post<AuthResponse>("/auth/google/callback", data);

export const getTelegramAuthUrl = () =>
  api.get<SocialAuthUrlResponse>("/auth/telegram");

export const telegramCallback = (data: SocialAuthCallbackDto) =>
  api.post<AuthResponse>("/auth/telegram/callback", data);
