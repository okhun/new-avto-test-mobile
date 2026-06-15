import LangSwitcher from "@/components/LangSwitcher";
import {
  useGuestLogin,
  useLogin,
  useRegister,
} from "@/src/features/auth/hook/useAuth";
import { useSocialAuth } from "@/src/features/auth/hook/useSocialAuth";
import { useThemeStore, type ThemePreference } from "@/src/store/theme.store";
import { useTheme, useThemePreference } from "@/src/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Application from "expo-application";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const springConfig = { damping: 15, stiffness: 300 };

function ScaleButton({
  children,
  onPress,
  className,
  wrapperStyle,
  disabled,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  wrapperStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
}) {
  const scale = useSharedValue(1);
  const animatedInner = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.7 : 1,
  }));

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={() => {
        if (!disabled) scale.value = withSpring(0.96, springConfig);
      }}
      onPressOut={() => (scale.value = withSpring(1, springConfig))}
      className={className}
      style={wrapperStyle}
    >
      <Animated.View
        style={animatedInner}
        className="w-full items-center justify-center"
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

interface FormErrors {
  displayName?: string;
  email?: string;
  password?: string;
}

// Logic functions remain identical to your original code
function validateLogin(email: string, password: string): FormErrors | null {
  const errors: FormErrors = {};
  const trimmed = email.trim();
  if (!trimmed) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed))
    errors.email = "Invalid email format";
  if (!password) errors.password = "Password is required";
  else if (password.length < 4) errors.password = "Too short";
  return Object.keys(errors).length > 0 ? errors : null;
}

function validateRegister(
  displayName: string,
  email: string,
  password: string
): FormErrors | null {
  const errors: FormErrors = {};
  if (!displayName.trim()) errors.displayName = "Name is required";
  const loginErrors = validateLogin(email, password);
  if (loginErrors) Object.assign(errors, loginErrors);
  if (password && password.length < 6) errors.password = "Min 6 characters";
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
  }
  return "An unexpected error occurred";
}

export default function AuthScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { palette, isDark } = useTheme();
  const themePreference = useThemePreference();
  const setThemePreference = useThemeStore((s) => s.setTheme);

  const errorBorder = isDark ? "rgba(248,113,113,0.55)" : "#fecaca";
  const orbTR = isDark ? "rgba(96,165,250,0.12)" : "rgba(219,234,254,0.85)";
  const orbBL = isDark ? "rgba(129,140,248,0.14)" : "rgba(224,231,255,0.7)";
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
  const { loginWithGoogle, loginWithTelegram } = useSocialAuth();

  const usernameRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const isFormLoading = loginMutation.isPending || registerMutation.isPending;
  const isGuestLoading = guestLoginMutation.isPending;
  const isAnyLoading = isFormLoading || isGuestLoading || !!socialLoading;

  const clearErrors = useCallback(() => {
    setErrors({});
    setServerError("");
  }, []);

  const selectTheme = (next: ThemePreference) => setThemePreference(next);

  const switchTab = (newTab: "login" | "register") => {
    setTab(newTab);
    clearErrors();
  };

  const handleLogin = () => {
    Keyboard.dismiss();
    clearErrors();
    const validationErrors = validateLogin(email, password);
    if (validationErrors) return setErrors(validationErrors);
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
    if (validationErrors) return setErrors(validationErrors);
    registerMutation.mutate(
      { email: email.trim(), password, displayName: displayName.trim() },
      {
        onSuccess: () => router.replace("/(tabs)"),
        onError: (error) => setServerError(extractApiError(error)),
      }
    );
  };

  const handleGoogleLogin = async () => {
    if (isAnyLoading) return;
    setSocialLoading("google");
    setServerError("");

    try {
      const result = await loginWithGoogle();
      if (result.ok) {
        router.replace("/(tabs)");
        return;
      }
      if (result.reason === "error") {
        setServerError(result.message ?? t("google_login_failed"));
      }
    } catch (e) {
      setServerError(extractApiError(e));
    } finally {
      setSocialLoading(null);
    }
  };

  const handleTelegramLogin = async () => {
    if (isAnyLoading) return;
    setSocialLoading("telegram");
    setServerError("");

    try {
      const result = await loginWithTelegram();
      if (result.ok) {
        router.replace("/(tabs)");
        return;
      }
      // "cancel" is intentionally silent; surface real errors and timeouts.
      if (result.reason === "error" || result.reason === "timeout") {
        setServerError(result.message ?? t("telegram_login_failed"));
      }
    } catch (e) {
      setServerError(extractApiError(e));
    } finally {
      setSocialLoading(null);
    }
  };

  const handleGuestLogin = async () => {
    if (isAnyLoading) return;
    let deviceId = "unknown";
    try {
      deviceId =
        Platform.OS === "ios"
          ? ((await Application.getIosIdForVendorAsync()) ?? "unk")
          : (Application.getAndroidId() ?? "unk");
    } catch {
      deviceId = `fb-${Date.now()}`;
    }
    guestLoginMutation.mutate(
      { deviceId, platform: Platform.OS as "ios" | "android" },
      {
        onSuccess: () => router.replace("/(tabs)"),
        onError: (e) => Alert.alert(t("error"), extractApiError(e)),
      }
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      style={{ backgroundColor: palette.background }}
    >
      <View
        className="absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-70"
        style={{ backgroundColor: orbTR }}
      />
      <View
        className="absolute top-1/2 -left-20 h-40 w-40 rounded-full opacity-60"
        style={{ backgroundColor: orbBL }}
      />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-8 pt-16 pb-10">
          {/* Header */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(600)}
            className="mb-8 items-center"
          >
            <View
              className="h-16 w-16 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: palette.primary,
                shadowColor: palette.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: palette.cardShadowOpacity + 0.12,
                shadowRadius: 12,
                elevation: 6,
              }}
            >
              <Ionicons
                name="car-sport"
                size={32}
                color={palette.switchThumb}
              />
            </View>
            <Text
              className="mt-4 text-3xl font-extrabold tracking-tight"
              style={{ color: palette.foreground }}
            >
              Avto Test
            </Text>
            <Text className="text-base" style={{ color: palette.muted }}>
              {t("master_your_driving_theory")}
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(150).duration(600)}
            className="mb-8 rounded-2xl border p-4"
            style={{
              borderColor: palette.border,
              backgroundColor: palette.card,
            }}
          >
            <View className="mb-3 flex-row items-center justify-between">
              <Text
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: palette.chevron }}
              >
                {t("language")}
              </Text>
              <Text
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: palette.chevron }}
              >
                {t("appearance")}
              </Text>
            </View>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <LangSwitcher className="w-full max-w-none" />
              </View>
              <View
                className="flex-row rounded-2xl border p-1"
                style={{
                  borderColor: palette.border,
                  backgroundColor: palette.iconSurface,
                }}
              >
                <Pressable
                  onPress={() => selectTheme("light")}
                  className="h-9 w-9 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor:
                      themePreference === "light"
                        ? palette.card
                        : "transparent",
                  }}
                >
                  <Ionicons
                    name="sunny"
                    size={18}
                    color={
                      themePreference === "light"
                        ? palette.primary
                        : palette.muted
                    }
                  />
                </Pressable>
                <Pressable
                  onPress={() => selectTheme("dark")}
                  className="h-9 w-9 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor:
                      themePreference === "dark" ? palette.card : "transparent",
                  }}
                >
                  <Ionicons
                    name="moon"
                    size={18}
                    color={
                      themePreference === "dark"
                        ? palette.primary
                        : palette.muted
                    }
                  />
                </Pressable>
                <Pressable
                  onPress={() => selectTheme("system")}
                  className="h-9 w-9 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor:
                      themePreference === "system"
                        ? palette.card
                        : "transparent",
                  }}
                >
                  <Ionicons
                    name="phone-portrait"
                    size={18}
                    color={
                      themePreference === "system"
                        ? palette.primary
                        : palette.muted
                    }
                  />
                </Pressable>
              </View>
            </View>
          </Animated.View>

          {/* Tab Switcher */}
          <View
            className="mb-8 flex-row rounded-2xl p-1.5"
            style={{ backgroundColor: palette.divider }}
          >
            {(["login", "register"] as const).map((tabType) => (
              <Pressable
                key={tabType}
                onPress={() => switchTab(tabType)}
                className="flex-1 items-center rounded-xl py-3"
                style={{
                  backgroundColor:
                    tab === tabType ? palette.card : "transparent",
                }}
              >
                <Text
                  className="text-sm font-bold"
                  style={{
                    color: tab === tabType ? palette.primary : palette.muted,
                  }}
                >
                  {t(`${tabType}`)}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Form Container */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(600)}
            className="gap-y-4"
          >
            {serverError && (
              <View
                className="flex-row items-center gap-2 rounded-xl border p-4"
                style={{
                  backgroundColor: palette.dangerBg,
                  borderColor: isDark ? "rgba(248,113,113,0.35)" : "#fecaca",
                }}
              >
                <Ionicons
                  name="alert-circle"
                  size={18}
                  color={palette.dangerForeground}
                />
                <Text
                  className="flex-1 text-sm font-medium"
                  style={{ color: palette.dangerForeground }}
                >
                  {serverError}
                </Text>
              </View>
            )}

            {tab === "register" && (
              <View>
                <Text
                  className="mb-1.5 ml-1 text-xs font-bold uppercase tracking-wider"
                  style={{ color: palette.chevron }}
                >
                  {t("display_name")}
                </Text>
                <TextInput
                  placeholder="John Doe"
                  value={displayName}
                  onChangeText={(t) => {
                    setDisplayName(t);
                    setErrors((e) => ({ ...e, displayName: undefined }));
                  }}
                  className="rounded-2xl border-2 px-5 py-4"
                  style={{
                    borderColor: errors.displayName
                      ? errorBorder
                      : palette.border,
                    backgroundColor: palette.iconSurface,
                    color: palette.foreground,
                  }}
                  placeholderTextColor={palette.chevron}
                />
              </View>
            )}

            <View>
              <Text
                className="mb-1.5 ml-1 text-xs font-bold uppercase tracking-wider"
                style={{ color: palette.chevron }}
              >
                {t("email_address")}
              </Text>
              <TextInput
                ref={usernameRef}
                placeholder="name@example.com"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  setErrors((e) => ({ ...e, email: undefined }));
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                className="rounded-2xl border-2 px-5 py-4"
                style={{
                  borderColor: errors.email ? errorBorder : palette.border,
                  backgroundColor: palette.iconSurface,
                  color: palette.foreground,
                }}
                placeholderTextColor={palette.chevron}
              />
            </View>

            <View>
              <Text
                className="mb-1.5 ml-1 text-xs font-bold uppercase tracking-wider"
                style={{ color: palette.chevron }}
              >
                {t("password")}
              </Text>
              <View className="relative">
                <TextInput
                  ref={passwordRef}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    setErrors((e) => ({ ...e, password: undefined }));
                  }}
                  secureTextEntry={!showPassword}
                  className="rounded-2xl border-2 px-5 py-4 pr-14"
                  style={{
                    borderColor: errors.password ? errorBorder : palette.border,
                    backgroundColor: palette.iconSurface,
                    color: palette.foreground,
                  }}
                  placeholderTextColor={palette.chevron}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-0 bottom-0 justify-center"
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={22}
                    color={palette.muted}
                  />
                </Pressable>
              </View>
            </View>

            <ScaleButton
              onPress={tab === "login" ? handleLogin : handleRegister}
              disabled={isAnyLoading}
              className="mt-2 rounded-2xl py-4"
              wrapperStyle={{
                backgroundColor: palette.primary,
                borderRadius: 16,
                shadowColor: palette.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: palette.cardShadowOpacity + 0.14,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              {isFormLoading ? (
                <ActivityIndicator color={palette.switchThumb} />
              ) : (
                <Text
                  className="text-lg font-bold"
                  style={{ color: palette.switchThumb }}
                >
                  {tab === "login" ? t("sign_in") : t("create_account")}
                </Text>
              )}
            </ScaleButton>
          </Animated.View>

          {/* Divider */}
          <View className="my-10 flex-row items-center">
            <View
              className="h-[1px] flex-1"
              style={{ backgroundColor: palette.divider }}
            />
            <Text
              className="px-4 text-xs font-bold uppercase tracking-widest"
              style={{ color: palette.muted }}
            >
              {t("social_login")}
            </Text>
            <View
              className="h-[1px] flex-1"
              style={{ backgroundColor: palette.divider }}
            />
          </View>

          {/* Social Buttons */}
          <View className="flex-row gap-4">
            <ScaleButton
              onPress={handleGoogleLogin}
              disabled={isAnyLoading}
              className="flex-1 flex-row items-center rounded-2xl py-4"
              wrapperStyle={{
                flex: 1,
                borderWidth: 1,
                borderColor: palette.border,
                backgroundColor: palette.card,
                borderRadius: 16,
              }}
            >
              {socialLoading === "google" ? (
                <ActivityIndicator color="#4285F4" />
              ) : (
                <>
                  <Ionicons name="logo-google" size={20} color="#4285F4" />
                  <Text
                    className="ml-2 font-bold"
                    style={{ color: palette.foreground }}
                  >
                    Google
                  </Text>
                </>
              )}
            </ScaleButton>

            <ScaleButton
              onPress={handleTelegramLogin}
              disabled={isAnyLoading}
              className="flex-1 flex-row items-center rounded-2xl py-4"
              wrapperStyle={{
                flex: 1,
                backgroundColor: "#229ED9",
                borderRadius: 16,
                shadowColor: palette.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: palette.cardShadowOpacity + 0.08,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              {socialLoading === "telegram" ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Ionicons name="paper-plane" size={20} color="#ffffff" />
                  <Text className="ml-2 font-bold text-white">Telegram</Text>
                </>
              )}
            </ScaleButton>
          </View>

          {/* Footer */}
          <View className="mt-auto items-center pt-12">
            <ScaleButton onPress={handleGuestLogin} disabled={isAnyLoading}>
              <View
                className="flex-row items-center rounded-full px-6 py-3"
                style={{ backgroundColor: palette.iconSurface }}
              >
                {isGuestLoading ? (
                  <ActivityIndicator color={palette.primary} size="small" />
                ) : (
                  <>
                    <Ionicons
                      name="person-outline"
                      size={16}
                      color={palette.primary}
                      className="mr-2"
                    />
                    <Text
                      className="text-sm font-bold"
                      style={{ color: palette.primary }}
                    >
                      {t("continue_as_guest")}
                    </Text>
                  </>
                )}
              </View>
            </ScaleButton>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
