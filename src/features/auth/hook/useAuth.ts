import { api } from "@/services/api/axios";
import {
  getMe,
  guestLogin,
  login,
  logout,
  register,
} from "@/src/features/auth/api/auth.api";
import type {
  AuthResponse,
  GetMeResponse,
  GuestLoginDto,
  LoginDto,
  RegisterDto,
} from "@/src/features/auth/types/auth.types";
import { useAuthStore } from "@/src/store/auth.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function handleAuthSuccess(response: { data: AuthResponse }) {
  const { accessToken, refreshToken } = response.data;
  const store = useAuthStore.getState();

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
