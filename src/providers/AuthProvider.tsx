import { api } from "@/services/api/axios";
import "@/services/api/interceptors";
import { setLogoutCallback } from "@/services/api/interceptors";
import type { GetMeResponse, User } from "@/src/features/auth/types/auth.types";
import { useAuthStore } from "@/src/store/auth.store";
import React, { createContext, useContext, useEffect, useRef } from "react";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const store = useAuthStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    setLogoutCallback(() => {
      useAuthStore.getState().logout();
    });
  }, []);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    bootstrapAuth();
  }, []);

  async function bootstrapAuth() {
    const hasStored = await store.loadStoredAuth();

    if (hasStored) {
      try {
        const { data } = await api.get<GetMeResponse>("/users/me");
        if (data) {
          store.setUser({
            id: data.id,
            email: data.email,
            phoneNumber: data.phoneNumber,
            avatarUrl: data.avatarUrl ?? null,
            provider: data.provider,
            isGuest: data.isGuest,
            displayName: data.displayName,
          });
        }
      } catch {
        await store.logout();
      }
    } else {
      store.setLoading(false);
    }
  }

  const login = async (accessToken: string, refreshToken: string) => {
    store.setAccessToken(accessToken);
    store.setRefreshToken(refreshToken);

    try {
      const { data } = await api.get<GetMeResponse>("/users/me");
      if (data) {
        store.setUser({
          id: data.id,
          email: data.email,
          phoneNumber: data.phoneNumber,
          avatarUrl: data.avatarUrl ?? null,
          provider: data.provider,
          isGuest: data.isGuest,
          displayName: data.displayName,
        });
      }
    } catch {
      await store.logout();
    }
  };

  const value: AuthContextValue = {
    user: store.user as User | null,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login,
    logout: store.logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return ctx;
}
