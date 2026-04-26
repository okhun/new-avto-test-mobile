import {
  useGuestLogin,
  useLogin,
  useRegister,
} from "@/src/features/auth/hook/useAuth";
import { useSocialAuth } from "@/src/features/auth/hook/useSocialAuth";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Application from "expo-application";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
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
    >
      <Animated.View
        style={style}
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
        setServerError(result.message ?? "Google login amalga oshmadi");
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
      if (result.reason === "error") {
        setServerError(result.message ?? "Telegram login amalga oshmadi");
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
        onError: (e) => Alert.alert("Error", extractApiError(e)),
      }
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      {/* Decorative Background Elements */}
      <View className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-50 opacity-50" />
      <View className="absolute top-1/2 -left-20 h-40 w-40 rounded-full bg-indigo-50 opacity-40" />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-8 pt-16 pb-10">
          {/* Header */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(600)}
            className="mb-10 items-center"
          >
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-blue-400">
              <Ionicons name="car-sport" size={32} color="white" />
            </View>
            <Text className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
              Auto Test
            </Text>
            <Text className="text-base text-slate-500">
              Master your driving theory
            </Text>
          </Animated.View>

          {/* Tab Switcher */}
          <View className="mb-8 flex-row rounded-2xl bg-slate-100 p-1.5">
            {(["login", "register"] as const).map((t) => (
              <Pressable
                key={t}
                onPress={() => switchTab(t)}
                className={`flex-1 items-center rounded-xl py-3 ${tab === t ? "bg-white " : ""}`}
              >
                <Text
                  className={`text-sm font-bold ${tab === t ? "text-blue-600" : "text-slate-500"}`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
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
              <View className="flex-row items-center gap-2 rounded-xl bg-red-50 p-4 border border-red-100">
                <Ionicons name="alert-circle" size={18} color="#dc2626" />
                <Text className="flex-1 text-sm font-medium text-red-600">
                  {serverError}
                </Text>
              </View>
            )}

            {tab === "register" && (
              <View>
                <Text className="mb-1.5 ml-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Full Name
                </Text>
                <TextInput
                  placeholder="John Doe"
                  value={displayName}
                  onChangeText={(t) => {
                    setDisplayName(t);
                    setErrors((e) => ({ ...e, displayName: undefined }));
                  }}
                  className={`rounded-2xl border-2 bg-slate-50 px-5 py-4 text-slate-900 ${errors.displayName ? "border-red-200" : "border-transparent focus:border-blue-500"}`}
                  placeholderTextColor="#94a3b8"
                />
              </View>
            )}

            <View>
              <Text className="mb-1.5 ml-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                Email Address
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
                className={`rounded-2xl border-2 bg-slate-50 px-5 py-4 text-slate-900 ${errors.email ? "border-red-200" : "border-transparent focus:border-blue-500"}`}
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View>
              <Text className="mb-1.5 ml-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                Password
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
                  className={`rounded-2xl border-2 bg-slate-50 px-5 py-4 pr-14 text-slate-900 ${errors.password ? "border-red-200" : "border-transparent focus:border-blue-500"}`}
                  placeholderTextColor="#94a3b8"
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-0 bottom-0 justify-center"
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={22}
                    color="#64748b"
                  />
                </Pressable>
              </View>
            </View>

            <ScaleButton
              onPress={tab === "login" ? handleLogin : handleRegister}
              disabled={isAnyLoading}
              className="mt-2 rounded-2xl bg-blue-600 py-4 shadow-blue-200"
            >
              {isFormLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-lg font-bold text-white">
                  {tab === "login" ? "Sign In" : "Create Account"}
                </Text>
              )}
            </ScaleButton>
          </Animated.View>

          {/* Divider */}
          <View className="my-10 flex-row items-center">
            <View className="h-[1px] flex-1 bg-slate-100" />
            <Text className="px-4 text-xs font-bold uppercase tracking-widest text-slate-400">
              Social Login
            </Text>
            <View className="h-[1px] flex-1 bg-slate-100" />
          </View>

          {/* Social Buttons */}
          <View className="flex-row gap-4">
            <ScaleButton
              onPress={handleGoogleLogin}
              disabled={isAnyLoading}
              className="flex-1 flex-row items-center rounded-2xl border border-slate-200 bg-white py-4"
            >
              {socialLoading === "google" ? (
                <ActivityIndicator color="#4285F4" />
              ) : (
                <>
                  <Ionicons name="logo-google" size={20} color="#4285F4" />
                  <Text className="ml-2 font-bold text-slate-700">Google</Text>
                </>
              )}
            </ScaleButton>

            <ScaleButton
              onPress={handleTelegramLogin}
              disabled={isAnyLoading}
              className="flex-1 flex-row items-center rounded-2xl bg-[#229ED9] py-4"
            >
              {socialLoading === "telegram" ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="paper-plane" size={20} color="white" />
                  <Text className="ml-2 font-bold text-white">Telegram</Text>
                </>
              )}
            </ScaleButton>
          </View>

          {/* Footer */}
          <View className="mt-auto items-center pt-12">
            <ScaleButton onPress={handleGuestLogin} disabled={isAnyLoading}>
              <View className="flex-row items-center bg-slate-50 px-6 py-3 rounded-full">
                {isGuestLoading ? (
                  <ActivityIndicator color="#3b82f6" size="small" />
                ) : (
                  <>
                    <Ionicons
                      name="person-outline"
                      size={16}
                      color="#3b82f6"
                      className="mr-2"
                    />
                    <Text className="text-sm font-bold text-blue-600">
                      Continue as Guest
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
