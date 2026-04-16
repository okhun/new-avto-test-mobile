import { api } from "@/services/api/axios";
import {
  getMe,
  guestLogin,
  login,
  logout,
  register,
} from "@/src/features/auth/api/auth.api";
import type {
  GuestLoginDto,
  LoginDto,
  LoginResponse,
  RegisterDto,
} from "@/src/features/auth/types/auth.types";
import { useAuthStore } from "@/src/store/auth.store";
import type { ProfileResponse } from "@/src/types/auth.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function handleAuthSuccess(response: { data: LoginResponse }) {
  const { accessToken, refreshToken } = response.data;
  const store = useAuthStore.getState();

  store.setAccessToken(accessToken);
  store.setRefreshToken(refreshToken);

  try {
    const { data } = await api.get<ProfileResponse>("/auth/me");
    if (data) {
      store.setUser({
        id: data.id,
        username: data.username,
        coins: data.coins,
        gamesPlayed: data.gamesPlayed,
        gamesWon: data.gamesWon,
      });
    }
  } catch {
    await store.logout();
  }
}

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginDto) => login(data),
    onSuccess: handleAuthSuccess,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterDto) => register(data),
    onSuccess: handleAuthSuccess,
  });
};

export const useGuestLogin = () => {
  return useMutation({
    mutationFn: (data: GuestLoginDto) => guestLogin(data),
    onSuccess: handleAuthSuccess,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSettled: async () => {
      await useAuthStore.getState().logout();
      queryClient.clear();
    },
  });
};

export const useGetMe = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => getMe(),
    enabled: isAuthenticated,
  });
};
