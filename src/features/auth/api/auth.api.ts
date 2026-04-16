import { api } from "@/services/api";
import type {
  GetMeResponse,
  GuestLoginDto,
  LoginDto,
  LoginResponse,
  RegisterDto,
  SocialAuthCallbackDto,
  SocialAuthUrlResponse,
} from "@/src/features/auth/types/auth.types";

export const login = (data: LoginDto) =>
  api.post<LoginResponse>("/auth/login", data);

export const register = (data: RegisterDto) =>
  api.post<LoginResponse>("/auth/register", data);

export const guestLogin = (data: GuestLoginDto) =>
  api.post<LoginResponse>("/auth/guest", data);

export const logout = () => api.post<void>("/auth/logout");

export const getMe = () => api.get<GetMeResponse>("/auth/me");

export const getGoogleAuthUrl = () =>
  api.get<SocialAuthUrlResponse>("/auth/google");

export const googleCallback = (data: SocialAuthCallbackDto) =>
  api.post<LoginResponse>("/auth/google/callback", data);

export const getTelegramAuthUrl = () =>
  api.get<SocialAuthUrlResponse>("/auth/telegram");

export const telegramCallback = (data: SocialAuthCallbackDto) =>
  api.post<LoginResponse>("/auth/telegram/callback", data);
