import NetInfo from "@react-native-community/netinfo";
import { api } from "@/services/api/axios";
import type { GetMeResponse } from "@/src/features/auth/types/auth.types";
import { useAuthStore } from "@/src/store/auth.store";
import {
  isAuthError,
  isNetworkOrOfflineError,
  normalizeApiError,
} from "@/src/utils/network/errors";

export type BootstrapResult =
  | { status: "authenticated"; source: "remote" | "cache" }
  | { status: "unauthenticated" }
  | { status: "session_expired" };

async function isDeviceOnline(): Promise<boolean> {
  const state = await NetInfo.fetch();
  if (state.isConnected === false) return false;
  if (state.isInternetReachable === false) return false;
  return true;
}

export async function bootstrapAuthSession(): Promise<BootstrapResult> {
  const store = useAuthStore.getState();
  const hasStored = await store.loadStoredAuth();
  const online = await isDeviceOnline();

  if (!hasStored) {
    store.setLoading(false);
    return { status: "unauthenticated" };
  }

  if (!online) {
    store.setLoading(false);
    return { status: "authenticated", source: "cache" };
  }

  try {
    const { data } = await api.get<GetMeResponse>("/users/me");
    if (data) {
      await store.setUser({
        id: data.id,
        email: data.email,
        phoneNumber: data.phoneNumber,
        avatarUrl: data.avatarUrl ?? null,
        provider: data.provider,
        isGuest: data.isGuest,
        displayName: data.displayName,
      });
      return { status: "authenticated", source: "remote" };
    }
    store.setLoading(false);
    return { status: "unauthenticated" };
  } catch (error) {
    const normalized = normalizeApiError(error);

    if (isNetworkOrOfflineError(normalized)) {
      store.setLoading(false);
      return { status: "authenticated", source: "cache" };
    }

    if (isAuthError(normalized)) {
      await store.logout();
      return { status: "session_expired" };
    }

    store.setLoading(false);
    return { status: "authenticated", source: "cache" };
  }
}

export async function refreshUserProfileIfOnline(): Promise<void> {
  const online = await isDeviceOnline();
  if (!online) return;

  const store = useAuthStore.getState();
  if (!store.isAuthenticated) return;

  try {
    const { data } = await api.get<GetMeResponse>("/users/me");
    if (data) {
      await store.setUser({
        id: data.id,
        email: data.email,
        phoneNumber: data.phoneNumber,
        avatarUrl: data.avatarUrl ?? null,
        provider: data.provider,
        isGuest: data.isGuest,
        displayName: data.displayName,
      });
    }
  } catch (error) {
    if (isAuthError(normalizeApiError(error))) {
      await store.logout();
    }
  }
}
