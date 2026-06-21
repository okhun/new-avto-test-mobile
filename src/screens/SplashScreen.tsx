import { useTheme } from "@/src/theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface SplashScreenProps {
  onFinish: () => void;
}

function PulseDot({ delayMs, color }: { delayMs: number; color: string }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    scale.value = withDelay(
      delayMs,
      withRepeat(
        withSequence(
          withTiming(1.4, { duration: 600 }),
          withTiming(1, { duration: 600 }),
        ),
        -1,
        true,
      ),
    );
    opacity.value = withDelay(
      delayMs,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0.4, { duration: 600 }),
        ),
        -1,
        true,
      ),
    );
  }, [delayMs, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      className="h-1.5 w-1.5 rounded-full"
      style={[animatedStyle, { backgroundColor: color }]}
    />
  );
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const logoScale = useSharedValue(0.7);
  const logoOpacity = useSharedValue(0);
  const { t } = useTranslation();
  const { palette, isDark } = useTheme();

  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 12, stiffness: 90 });
    logoOpacity.value = withTiming(1, { duration: 800 });

    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish, logoScale, logoOpacity]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const logoCardShadow = useMemo(
    () =>
      Platform.select({
        ios: {
          shadowColor: palette.primary,
          shadowOffset: { width: 0, height: 15 },
          shadowOpacity: isDark
            ? palette.cardShadowOpacity + 0.18
            : palette.cardShadowOpacity + 0.15,
          shadowRadius: 20,
        },
        android: {
          elevation: 12,
        },
        default: {},
      }) ?? {},
    [palette.primary, palette.cardShadowOpacity, isDark],
  );

  const orbTopRight = isDark
    ? "rgba(96,165,250,0.12)"
    : "rgba(147,197,253,0.35)";
  const orbBottomLeft = isDark
    ? "rgba(129,140,248,0.14)"
    : "rgba(199,210,254,0.4)";

  return (
    <View className="flex-1" style={{ backgroundColor: palette.background }}>
      <View
        className="absolute -top-20 -right-20 h-80 w-80 rounded-full"
        style={{ backgroundColor: orbTopRight }}
      />
      <View
        className="absolute bottom-10 -left-20 h-96 w-96 rounded-full"
        style={{ backgroundColor: orbBottomLeft }}
      />

      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-between px-8 py-12">
          <View />

          <View className="items-center">
            <Animated.View
              style={[logoStyle, logoCardShadow]}
              className="mb-10"
            >
              <View
                className="h-40 w-40 items-center justify-center rounded-[48px] border"
                style={{
                  backgroundColor: palette.card,
                  borderColor: palette.border,
                }}
              >
                <View
                  className="h-32 w-32 items-center justify-center rounded-[38px]"
                  style={{ backgroundColor: palette.primary }}
                >
                  <MaterialCommunityIcons
                    name="steering"
                    size={72}
                    color={palette.switchThumb}
                  />
                </View>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300).duration(800)}>
              <Text
                className="text-center text-5xl font-black tracking-tighter"
                style={{ color: palette.foreground }}
              >
                Avto<Text style={{ color: palette.primary }}>Test</Text>
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(500).duration(800)}>
              <Text
                className="mt-4 text-center text-lg font-bold tracking-wide"
                style={{ color: palette.muted }}
              >
                {t("learn")} • {t("practice")} • {t("pass_the_exam")}
              </Text>
            </Animated.View>
          </View>

          <Animated.View
            entering={FadeIn.delay(800)}
            className="w-full items-center"
          >
            <View className="mb-6 flex-row items-center gap-4">
              <PulseDot delayMs={0} color={palette.primary} />
              <PulseDot delayMs={200} color={palette.primary} />
              <PulseDot delayMs={400} color={palette.primary} />
            </View>

            <View
              className="h-1.5 w-40 overflow-hidden rounded-full"
              style={{ backgroundColor: palette.divider }}
            >
              <Animated.View
                className="h-full rounded-full"
                entering={FadeIn.delay(1000)}
                style={{ width: "45%", backgroundColor: palette.primary }}
              />
            </View>

            <Text
              className="mt-5 text-[11px] font-black uppercase tracking-[3px]"
              style={{ color: palette.chevron }}
            >
              {t("starting_engines")}
            </Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};
