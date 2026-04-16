// User entity from backend
export interface User {
  id: string;
  username: string;
  coins: number;
  gamesPlayed: number;
  gamesWon: number;
  isOnline?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Auth response from backend
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Register DTO
export interface RegisterDto {
  username: string;
  password: string;
}

// Login DTO
export interface LoginDto {
  username: string;
  password: string;
}

// Guest login DTO
export interface GuestLoginDto {
  deviceId: string;
  deviceFingerprint?: string;
  platform?: "android" | "ios" | "web";
}

// Profile response (user without password)
export type ProfileResponse = Omit<User, "password">;
