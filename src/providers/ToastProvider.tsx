import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/src/theme";

export type ToastType = "info" | "success" | "error";

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  show: (message: string, type?: ToastType) => void;
  info: (message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { palette } = useTheme();
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastItem | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idRef = useRef(0);

  const hide = useCallback(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => setToast(null));
  }, [opacity]);

  const show = useCallback(
    (message: string, type: ToastType = "info") => {
      if (timerRef.current) clearTimeout(timerRef.current);
      idRef.current += 1;
      setToast({ id: idRef.current, message, type });
      opacity.setValue(0);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
      timerRef.current = setTimeout(hide, 2800);
    },
    [hide, opacity]
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      show,
      info: (message) => show(message, "info"),
      success: (message) => show(message, "success"),
      error: (message) => show(message, "error"),
    }),
    [show]
  );

  const bg =
    toast?.type === "success"
      ? "#166534"
      : toast?.type === "error"
        ? "#b91c1c"
        : palette.card;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="box-none"
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: insets.bottom + 16,
            opacity,
            zIndex: 9999,
          }}
        >
          <Pressable
            onPress={hide}
            className="rounded-2xl border px-4 py-3 shadow-lg"
            style={{
              backgroundColor: bg,
              borderColor: palette.border,
            }}
          >
            <Text
              className="text-center text-sm font-semibold"
              style={{ color: palette.switchThumb }}
            >
              {toast.message}
            </Text>
          </Pressable>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
