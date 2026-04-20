import type { GetMeResponse } from "@/src/features/auth/types/auth.types";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { STORAGE_KEYS } from "../utils/constants";

interface AuthState {
  // State
  user: GetMeResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  setUser: (user: GetMeResponse) => void;
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
  setUser: async (user) => {
    set({ user, isAuthenticated: true, isLoading: false });
    await SecureStore.setItemAsync(
      STORAGE_KEYS.USER_DATA,
      JSON.stringify(user)
    );
  },

  setAccessToken: async (accessToken: string) => {
    await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, accessToken);
  },

  setRefreshToken: async (refreshToken: string) => {
    await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
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
      const userData = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);
      if (accessToken && userData) {
        const user = JSON.parse(userData) as GetMeResponse;
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
