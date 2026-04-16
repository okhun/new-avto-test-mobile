import { api } from "@/services/api/axios";
import {
  getGoogleAuthUrl,
  getTelegramAuthUrl,
  googleCallback,
  telegramCallback,
} from "@/src/features/auth/api/auth.api";
import {
  useGuestLogin,
  useLogin,
  useRegister,
} from "@/src/features/auth/hook/useAuth";
import type { GetMeResponse } from "@/src/features/auth/types/auth.types";
import { useAuthStore } from "@/src/store/auth.store";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Application from "expo-application";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const springConfig = { damping: 15, stiffness: 300 };

function ScaleButton({
  children,
  onPress,
  className,
  disabled,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.6 : 1,
  }));

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={() => {
        if (!disabled) scale.value = withSpring(0.97, springConfig);
      }}
      onPressOut={() => (scale.value = withSpring(1, springConfig))}
      className={className}
    >
      <Animated.View style={style}>{children}</Animated.View>
    </Pressable>
  );
}

interface FormErrors {
  displayName?: string;
  email?: string;
  password?: string;
}

function validateLogin(email: string, password: string): FormErrors | null {
  const errors: FormErrors = {};
  const trimmed = email.trim();

  if (!trimmed) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    errors.email = "Please enter a valid email";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 4) {
    errors.password = "Password must be at least 4 characters";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

function validateRegister(
  displayName: string,
  email: string,
  password: string
): FormErrors | null {
  const errors: FormErrors = {};

  if (!displayName.trim()) {
    errors.displayName = "Display name is required";
  } else if (displayName.trim().length < 2) {
    errors.displayName = "Display name must be at least 2 characters";
  }

  const loginErrors = validateLogin(email, password);
  if (loginErrors) {
    Object.assign(errors, loginErrors);
  }

  if (password && password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

function extractApiError(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosErr = error as {
      response?: { data?: { message?: string | string[] }; status?: number };
    };
    const msg = axiosErr.response?.data?.message;
    if (Array.isArray(msg)) return msg[0];
    if (typeof msg === "string") return msg;
    if (axiosErr.response?.status === 409) return "Account already exists";
    if (axiosErr.response?.status === 401) return "Invalid credentials";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}

export default function AuthScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [socialLoading, setSocialLoading] = useState<
    "google" | "telegram" | null
  >(null);

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const guestLoginMutation = useGuestLogin();

  const usernameRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const isFormLoading = loginMutation.isPending || registerMutation.isPending;
  const isGuestLoading = guestLoginMutation.isPending;
  const isAnyLoading = isFormLoading || isGuestLoading || !!socialLoading;

  const clearErrors = useCallback(() => {
    setErrors({});
    setServerError("");
  }, []);

  const switchTab = (newTab: "login" | "register") => {
    setTab(newTab);
    clearErrors();
    setPassword("");
  };

  const handleLogin = () => {
    Keyboard.dismiss();
    clearErrors();

    const validationErrors = validateLogin(email, password);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    loginMutation.mutate(
      { email: email.trim(), password },
      {
        onSuccess: () => router.replace("/(tabs)"),
        onError: (error) => setServerError(extractApiError(error)),
      }
    );
  };

  const handleRegister = () => {
    Keyboard.dismiss();
    clearErrors();

    const validationErrors = validateRegister(displayName, email, password);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    registerMutation.mutate(
      {
        email: email.trim(),
        password,
        displayName: displayName.trim(),
      },
      {
        onSuccess: () => router.replace("/(tabs)"),
        onError: (error) => setServerError(extractApiError(error)),
      }
    );
  };

  const handleSocialAuth = async (provider: "google" | "telegram") => {
    if (isAnyLoading) return;
    setSocialLoading(provider);
    setServerError("");

    try {
      const getUrl =
        provider === "google" ? getGoogleAuthUrl : getTelegramAuthUrl;
      const callback =
        provider === "google" ? googleCallback : telegramCallback;

      const { data: urlData } = await getUrl();
      const redirectUrl = Linking.createURL("auth/callback");

      const result = await WebBrowser.openAuthSessionAsync(
        urlData.url,
        redirectUrl
      );

      if (result.type === "success" && result.url) {
        const parsed = Linking.parse(result.url);
        const code = parsed.queryParams?.code as string | undefined;

        if (code) {
          const response = await callback({
            code,
            state: parsed.queryParams?.state as string | undefined,
          });
          const store = useAuthStore.getState();
          store.setAccessToken(response.data.accessToken);
          store.setRefreshToken(response.data.refreshToken);
          try {
            const { data: meData } = await api.get<GetMeResponse>("/auth/me");
            if (meData) {
              store.setUser({
                id: meData.id,
                email: meData.email,
                phoneNumber: meData.phoneNumber,
                avatarUrl: meData.avatarUrl ?? null,
                provider: meData.provider,
                isGuest: meData.isGuest,
                displayName: meData.displayName,
              });
            }
          } catch {
            await store.logout();
          }
          router.replace("/(tabs)");
        } else {
          setServerError(
            "Authentication failed. No authorization code received."
          );
        }
      }
    } catch (error) {
      setServerError(extractApiError(error));
    } finally {
      setSocialLoading(null);
    }
  };

  const handleGuestLogin = async () => {
    if (isAnyLoading) return;
    clearErrors();

    let deviceId = "unknown";
    try {
      if (Platform.OS === "ios") {
        deviceId = (await Application.getIosIdForVendorAsync()) ?? "unknown";
      } else {
        deviceId = Application.getAndroidId() ?? "unknown";
      }
    } catch {
      deviceId = `fallback-${Date.now()}`;
    }

    guestLoginMutation.mutate(
      { deviceId, platform: Platform.OS as "ios" | "android" },
      {
        onSuccess: () => router.replace("/(tabs)"),
        onError: (error) =>
          Alert.alert("Guest Login Failed", extractApiError(error)),
      }
    );
  };

  return (
    <View className="flex-1 bg-[#f9fafb]">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6">
          {/* Header */}
          <View className="items-center pt-12 pb-6">
            <Text className="text-3xl font-bold text-[#0d141b]">Auto Test</Text>
            <Text className="mt-1 text-sm text-gray-400">
              Learn. Practice. Pass.
            </Text>
          </View>

          {/* Tabs */}
          <View className="mb-6 flex-row rounded-xl bg-gray-100 p-1">
            <Pressable
              onPress={() => switchTab("login")}
              className={`flex-1 items-center rounded-lg py-3 ${
                tab === "login" ? "bg-white" : ""
              }`}
            >
              <Text
                className={`font-semibold ${
                  tab === "login" ? "text-black" : "text-gray-400"
                }`}
              >
                Login
              </Text>
            </Pressable>
            <Pressable
              onPress={() => switchTab("register")}
              className={`flex-1 items-center rounded-lg py-3 ${
                tab === "register" ? "bg-white" : ""
              }`}
            >
              <Text
                className={`font-semibold ${
                  tab === "register" ? "text-black" : "text-gray-400"
                }`}
              >
                Register
              </Text>
            </Pressable>
          </View>

          {/* Server error */}
          {serverError ? (
            <View className="mb-4 rounded-xl bg-red-50 px-4 py-3">
              <Text className="text-sm font-medium text-red-600">
                {serverError}
              </Text>
            </View>
          ) : null}

          {/* Form */}
          <View className="gap-4">
            {tab === "register" && (
              <View>
                <TextInput
                  placeholder="Display name"
                  value={displayName}
                  onChangeText={(t) => {
                    setDisplayName(t);
                    if (errors.displayName)
                      setErrors((e) => ({ ...e, displayName: undefined }));
                  }}
                  returnKeyType="next"
                  onSubmitEditing={() => usernameRef.current?.focus()}
                  editable={!isAnyLoading}
                  className={`rounded-xl border bg-white px-4 py-4 text-sm ${
                    errors.displayName ? "border-red-400" : "border-gray-200"
                  }`}
                  placeholderTextColor="#9ca3af"
                />
                {errors.displayName ? (
                  <Text className="mt-1 px-1 text-xs text-red-500">
                    {errors.displayName}
                  </Text>
                ) : null}
              </View>
            )}

            <View>
              <TextInput
                ref={usernameRef}
                placeholder="Email or username"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (errors.email)
                    setErrors((e) => ({ ...e, email: undefined }));
                }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="username"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                editable={!isAnyLoading}
                className={`rounded-xl border bg-white px-4 py-4 text-sm ${
                  errors.email ? "border-red-400" : "border-gray-200"
                }`}
                placeholderTextColor="#9ca3af"
              />
              {errors.email ? (
                <Text className="mt-1 px-1 text-xs text-red-500">
                  {errors.email}
                </Text>
              ) : null}
            </View>

            <View>
              <View className="relative">
                <TextInput
                  ref={passwordRef}
                  placeholder="Password"
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    if (errors.password)
                      setErrors((e) => ({ ...e, password: undefined }));
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  textContentType="password"
                  returnKeyType="go"
                  onSubmitEditing={
                    tab === "login" ? handleLogin : handleRegister
                  }
                  editable={!isAnyLoading}
                  className={`rounded-xl border bg-white px-4 py-4 pr-12 text-sm ${
                    errors.password ? "border-red-400" : "border-gray-200"
                  }`}
                  placeholderTextColor="#9ca3af"
                />
                <Pressable
                  onPress={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-0 bottom-0 justify-center"
                  hitSlop={8}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#9ca3af"
                  />
                </Pressable>
              </View>
              {errors.password ? (
                <Text className="mt-1 px-1 text-xs text-red-500">
                  {errors.password}
                </Text>
              ) : null}
            </View>

            {/* Submit */}
            <ScaleButton
              className="mt-2 items-center rounded-xl bg-blue-500 py-4"
              onPress={tab === "login" ? handleLogin : handleRegister}
              disabled={isAnyLoading}
            >
              {isFormLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text className="font-semibold text-white">
                  {tab === "login" ? "Login" : "Create Account"}
                </Text>
              )}
            </ScaleButton>
          </View>

          {/* Divider */}
          <View className="my-6 flex-row items-center gap-4">
            <View className="h-px flex-1 bg-gray-200" />
            <Text className="text-xs font-medium text-gray-400">
              or continue with
            </Text>
            <View className="h-px flex-1 bg-gray-200" />
          </View>

          {/* Social */}
          <View className="gap-3">
            <ScaleButton
              className="flex-row items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-4"
              onPress={() => handleSocialAuth("google")}
              disabled={isAnyLoading}
            >
              <View className="flex-row items-center justify-center gap-3">
                {socialLoading === "google" ? (
                  <ActivityIndicator color="#4285F4" size="small" />
                ) : (
                  <Ionicons name="logo-google" size={20} color="#4285F4" />
                )}
                <Text className="font-medium text-black">
                  Continue with Google
                </Text>
              </View>
            </ScaleButton>

            <ScaleButton
              className="flex-row items-center justify-center gap-3 rounded-xl bg-[#229ED9] py-4"
              onPress={() => handleSocialAuth("telegram")}
              disabled={isAnyLoading}
            >
              <View className="flex-row items-center justify-center gap-3">
                {socialLoading === "telegram" ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Ionicons name="paper-plane" size={20} color="white" />
                )}
                <Text className="font-medium text-white">
                  Continue with Telegram
                </Text>
              </View>
            </ScaleButton>
          </View>

          {/* Guest */}
          <View className="mt-auto items-center pb-10 pt-6">
            <ScaleButton onPress={handleGuestLogin} disabled={isAnyLoading}>
              {isGuestLoading ? (
                <ActivityIndicator color="#3b82f6" size="small" />
              ) : (
                <Text className="text-sm font-semibold text-blue-500 underline">
                  Continue as Guest
                </Text>
              )}
            </ScaleButton>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
