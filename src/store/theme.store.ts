import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import type { StateStorage } from "zustand/middleware";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemePreference = "light" | "dark" | "system";

type ThemeState = {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  resetTheme: () => void;
};

const memoryFallback = new Map<string, string>();

/**
 * Uses AsyncStorage when the native bridge is available.
 * Falls back to an in-memory map when it is not (e.g. mismatched Expo/native build,
 * or "Native module is null" errors) so setTheme never rejects.
 */
function createResilientStorage(): StateStorage {
  return {
    getItem: async (name: string): Promise<string | null> => {
      try {
        const value = await AsyncStorage.getItem(name);
        if (value != null) return value;
      } catch {
        /* AsyncStorage unavailable */
      }
      return memoryFallback.get(name) ?? null;
    },
    setItem: async (name: string, value: string): Promise<void> => {
      try {
        await AsyncStorage.setItem(name, value);
        memoryFallback.delete(name);
      } catch {
        memoryFallback.set(name, value);
      }
    },
    removeItem: async (name: string): Promise<void> => {
      try {
        await AsyncStorage.removeItem(name);
      } catch {
        /* ignore */
      }
      memoryFallback.delete(name);
    },
  };
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system" as ThemePreference,
      setTheme: (theme: ThemePreference) => set({ theme }),
      resetTheme: () => set({ theme: "system" }),
    }),
    {
      name: "theme-preference",
      storage: createJSONStorage(() => createResilientStorage()),
    }
  )
);
