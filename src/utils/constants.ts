export const API_CONFIG = {
  BASE_URL:
    process.env.EXPO_PUBLIC_API_URL || "https://api.avto-test.uz/api/v1",
  TIMEOUT: 10000,
  API_URL: process.env.EXPO_PUBLIC_API_URL_MAIN || "https://api.avto-test.uz",
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: "autotest_auth_token",
  USER_DATA: "autotest_user_data",
  SETTINGS: "autotest_settings",
  REFRESH_TOKEN: "autotest_refresh_token",
};

export const GOOGLE_CONFIG = {
  EXPO_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID ?? "dfgdfgdfdf",
  IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? "sdfsd",
  ANDROID_CLIENT_ID:
    process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? "sdfsd",
  WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "sdfsd",
};
