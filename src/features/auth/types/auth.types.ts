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

/** Response shape for `POST /auth/refresh` (rotates refresh token). */
export interface RefreshTokensResponse {
  accessToken: string;
  refreshToken: string;
  user?: User;
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
  /** OIDC ID token (preferred, verified server-side). Provide this OR accessToken. */
  idToken?: string;
  /** Legacy access token (validated via userinfo). Provide this OR idToken. */
  accessToken?: string;
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

/**
 * Body for `POST /auth/telegram/mobile/exchange`. The app trades the one-time
 * `code` it received on the deep link (plus the `state` it generated) for the
 * real tokens. Keeps the access/refresh tokens out of the browser URL.
 */
export interface TelegramMobileExchangeDto {
  code: string;
  state: string;
}

/** Response of `POST /auth/telegram/mobile/bot/start` (native bot login). */
export interface TelegramBotStartResponse {
  /** Secret session id; also the `?start=` payload sent to the bot. */
  nonce: string;
  /** `https://t.me/<bot>?start=<nonce>` deep link to open. */
  botUrl: string;
}

/** Response of `GET /auth/telegram/mobile/bot/poll`. */
export interface TelegramBotPollResponse {
  status: "pending" | "ready" | "expired";
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

/**
 * Body for `POST /auth/telegram/exchange` (Telegram OIDC). The app trades the
 * one-time `code` it received on the redirect deep link for the real tokens.
 */
export interface TelegramOidcExchangeDto {
  code: string;
}
