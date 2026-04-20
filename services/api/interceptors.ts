import { STORAGE_KEYS } from "@/src/utils/constants";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { api } from "./axios";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}> = [];

let onLogoutCallback: (() => void) | null = null;

export function setLogoutCallback(cb: () => void) {
  onLogoutCallback = cb;
}

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const getAccessToken = async () =>
  await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);

const getRefreshToken = () =>
  SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);

const setAccessToken = (token: string) =>
  SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);

const clearTokens = async () => {
  await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
  await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
  await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
};

api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        );

        const newAccessToken = response.data.accessToken;
        await setAccessToken(newAccessToken);
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        await clearTokens();
        onLogoutCallback?.();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
