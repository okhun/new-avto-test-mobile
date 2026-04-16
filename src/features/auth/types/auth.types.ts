export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  password: string;
  displayName: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface GetMeResponse {
  id: string;
  username: string;
  coins: number;
  gamesPlayed: number;
  gamesWon: number;
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
