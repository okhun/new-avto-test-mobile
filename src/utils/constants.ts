export const API_CONFIG = {
  BASE_URL:
    process.env.EXPO_PUBLIC_API_URL || "https://dev-api.avto-test.uz/api/v1",
  TIMEOUT: 10000,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: "autotest_auth_token",
  USER_DATA: "autotest_user_data",
  SETTINGS: "autotest_settings",
  REFRESH_TOKEN: "autotest_refresh_token",
};
