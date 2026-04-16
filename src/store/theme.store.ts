// NOTE: Requires installation of:
//   npm install zustand @react-native-async-storage/async-storage

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemePreference = 'light' | 'dark' | 'system';

type ThemeState = {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  resetTheme: () => void;
};

// Zustand store for theme management with persistence.
// Theme preference is persisted to AsyncStorage and survives app restarts.
// Default is 'system' which follows the device's appearance setting.
//
// Usage:
//   const theme = useThemeStore((state) => state.theme);
//   useThemeStore.getState().setTheme('dark');
//   useThemeStore.getState().resetTheme(); // resets to 'system'
export const useThemeStore = create<ThemeState>()(
  persist(
    (set: (partial: Partial<ThemeState> | ((state: ThemeState) => Partial<ThemeState>)) => void) => ({
      theme: 'system',
      setTheme: (theme: ThemePreference) => set({ theme }),
      resetTheme: () => set({ theme: 'system' }),
    }),
    {
      name: 'theme-preference',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
