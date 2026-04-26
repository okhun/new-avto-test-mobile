export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  displayName: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface GetMeResponse {
  id: string;
  displayName: string;
  email: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
  provider: string | null;
  isGuest: boolean;
}

export interface UpdateProfileDto {
  displayName?: string;
  avatarUrl?: string | null;
}

export interface User {
  id: string;
  createdAt: string; // or Date if you parse it
  updatedAt: string; // or Date
  displayName: string;
  email: string;
  phoneNumber: string | null;
  role: "user" | string;
  isGuest: boolean;
  provider: "google" | "telegram" | "guest" | string;
  providerId: string | null;
  avatarUrl: string | null;
  providerAvatarUrl: string | null;
  isActive: boolean;
  isBlocked: boolean;
  lastLoginAt: string; // or Date
  deviceId: string | null;
  deletedAt: string | null; // or Date
}

export interface GuestLoginDto {
  deviceId: string;
  deviceFingerprint?: string;
  platform?: "android" | "ios" | "web";
}

export interface SocialAuthUrlResponse {
  url: string;
}

export interface SocialAuthCallbackDto {
  code: string;
  state?: string;
}

export interface OAuthLoginDto {
  provider: "google";
  accessToken: string;
  deviceId?: string;
}

export interface TelegramAuthDto {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}
