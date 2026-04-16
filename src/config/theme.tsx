import React from 'react';
import { Appearance, View, ViewProps } from 'react-native';

import { useThemeStore, type ThemePreference } from '@/src/store/theme.store';

// Extended View props with className for NativeWind v4
type ViewWithClassNameProps = ViewProps & {
  className?: string;
};

export type ResolvedTheme = 'light' | 'dark';

// Listen to system appearance changes so "system" mode stays in sync.
// This hook tracks the device's system color scheme (light/dark).
// When user preference is 'system', we use this value.
export function useSystemColorScheme(): ResolvedTheme {
  const [scheme, setScheme] = React.useState<ResolvedTheme>(
    Appearance.getColorScheme() ?? 'light'
  );

  React.useEffect(() => {
    // Listen for system theme changes and update state.
    // This ensures 'system' preference always reflects current device theme.
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setScheme(colorScheme ?? 'light');
    });

    return () => subscription.remove();
  }, []);

  return scheme;
}

// Resolve the active theme based on the persisted preference.
// If preference is 'system', returns the current system theme.
// Otherwise returns the explicitly chosen theme ('light' or 'dark').
export function useResolvedTheme(): ResolvedTheme {
  const preference = useThemeStore((state: { theme: ThemePreference }) => state.theme);
  const systemTheme = useSystemColorScheme();

  return preference === 'system' ? systemTheme : preference;
}

// Apply the resolved theme to NativeWind using the "dark" class strategy.
// 
// How it works:
// 1. Reads theme preference from Zustand store (persisted to AsyncStorage)
// 2. Resolves to actual theme (light/dark) based on preference + system theme
// 3. Applies "dark" class to root View when theme is dark
// 
// NativeWind v4 uses the className to enable dark: variants.
// When className="dark" is present on a parent element, all child elements
// with dark: variants will use their dark mode styles.
// Example: className="bg-background dark:bg-background" will use dark
// color when className="dark" is present on a parent element.
//
// To switch themes later, call: useThemeStore.getState().setTheme('light' | 'dark' | 'system')
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const resolvedTheme = useResolvedTheme();

  // Apply "dark" class to root View when theme is dark.
  // NativeWind v4's class-based dark mode requires this class on a parent
  // for dark: variants to work correctly. This is the primary mechanism
  // for theme switching in NativeWind v4.
  const className = resolvedTheme === 'dark' ? 'dark' : '';
  
  // NativeWind v4 extends React Native components with className prop at runtime.
  // The className prop is properly typed via nativewind-env.d.ts
  return (
    <View className={className}>
      {children}
    </View>
  );
}

// Helper hook to get current theme preference (not resolved).
// Use useResolvedTheme() if you need the actual theme being applied.
export function useThemePreference(): ThemePreference {
  return useThemeStore((state: { theme: ThemePreference }) => state.theme);
}
