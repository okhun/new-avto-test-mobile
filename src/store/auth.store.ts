import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { STORAGE_KEYS } from "../utils/constants";

export enum AuthProvider {
  GOOGLE = "google",
  FACEBOOK = "facebook",
  APPLE = "apple",
}
export interface PlayerProfile {
  id: string;
  displayName: string;
  email: string | null;
  avatarUrl: string | null;
  accountType: string;
  coins: number;
  gems: number;
  level: number;
  xp: number;
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    winRate: number;
    rating: number;
    rankTier: number;
  };
  linkedProviders: AuthProvider[];
}
interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  coins: number;
  gamesPlayed?: number;
  gamesWon?: number;
}

interface AuthState {
  // State
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  setUser: (user: User) => void;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  // Actions
  setUser: (user) => {
    set({ user, isAuthenticated: true, isLoading: false });
    // Persist user data
    SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  },

  setAccessToken: (accessToken: string) => {
    SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, accessToken);
  },

  setRefreshToken: (refreshToken: string) => {
    SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error, isLoading: false }),

  logout: async () => {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    set({
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
    });
  },

  loadStoredAuth: async (): Promise<boolean> => {
    try {
      set({ isLoading: true });
      const accessToken = await SecureStore.getItemAsync(
        STORAGE_KEYS.AUTH_TOKEN
      );
      console.log("accessToken", accessToken);
      const userData = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);
      if (accessToken && userData) {
        const user = JSON.parse(userData) as User;
        set({
          user,
          isAuthenticated: true,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to load stored auth:", error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));
