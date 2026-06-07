import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Icon + label area inside the tab bar (excludes bottom safe area). */
export const TAB_BAR_CONTENT_HEIGHT = Platform.OS === "ios" ? 52 : 58;

/** Minimum space above the Android system navigation bar (gesture / 3-button). */
const ANDROID_MIN_BOTTOM_INSET = 28;

export function getTabBarBottomInset(
  insets: { bottom: number },
  platform: typeof Platform.OS = Platform.OS
): number {
  if (platform === "android") {
    return Math.max(insets.bottom, ANDROID_MIN_BOTTOM_INSET);
  }
  return Math.max(insets.bottom, 20);
}

export function useTabBarMetrics() {
  const insets = useSafeAreaInsets();
  const bottomInset = getTabBarBottomInset(insets);
  const height = TAB_BAR_CONTENT_HEIGHT + bottomInset;

  return {
    height,
    bottomInset,
    contentHeight: TAB_BAR_CONTENT_HEIGHT,
    /** ScrollView / FlatList padding on tab screens with an overlay tab bar. */
    scrollBottomPadding: height + 16,
    /** List padding when a floating primary button sits above the tab bar. */
    floatingActionListPadding: height + 80,
    /** `bottom` offset for a floating action anchored above the tab bar. */
    floatingActionBottom: height + 8,
  };
}
