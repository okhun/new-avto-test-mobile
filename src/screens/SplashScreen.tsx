import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, Text, View } from "react-native";
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

const PRIMARY = "#258cf4";

// --- Native Shadow approach (No shadow class names) ---
const shadows = StyleSheet.create({
  logoCard: {
    ...Platform.select({
      ios: {
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
});

function PulseDot({ delayMs }: { delayMs: number }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    scale.value = withDelay(
      delayMs,
      withRepeat(
        withSequence(
          withTiming(1.4, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        true
      )
    );
    opacity.value = withDelay(
      delayMs,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0.4, { duration: 600 })
        ),
        -1,
        true
      )
    );
  }, [delayMs, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className="h-1.5 w-1.5 rounded-full bg-blue-500"
    />
  );
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const logoScale = useSharedValue(0.7);
  const logoOpacity = useSharedValue(0);
  const { t } = useTranslation();
  useEffect(() => {
    // Entrance animations
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

  return (
    <View className="flex-1 bg-white">
      {/* Background Decor - Visual "Realistic" Depth */}
      <View className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-50/50" />
      <View className="absolute bottom-10 -left-20 w-96 h-96 rounded-full bg-indigo-50/30" />

      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-between px-8 py-12">
          {/* Top Spacer to push content to center */}
          <View />

          {/* MAIN BRANDING AREA */}
          <View className="items-center">
            <Animated.View
              style={[logoStyle, shadows.logoCard]}
              className="mb-10"
            >
              <View className="h-40 w-40 items-center justify-center rounded-[48px] bg-white border border-slate-50">
                <View
                  className="h-32 w-32 items-center justify-center rounded-[38px]"
                  style={{ backgroundColor: PRIMARY }}
                >
                  <MaterialCommunityIcons
                    name="steering"
                    size={72}
                    color="white"
                  />
                </View>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300).duration(800)}>
              <Text className="text-center text-5xl font-black tracking-tighter text-slate-900">
                Auto<Text style={{ color: PRIMARY }}>Test</Text>
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(500).duration(800)}>
              <Text className="mt-4 text-center text-lg font-bold text-slate-400 tracking-wide">
                {t("learn")} • {t("practice")} • {t("pass_the_exam")}
              </Text>
            </Animated.View>
          </View>

          {/* PROGRESS INDICATOR */}
          <Animated.View
            entering={FadeIn.delay(800)}
            className="items-center w-full"
          >
            <View className="flex-row items-center gap-4 mb-6">
              <PulseDot delayMs={0} />
              <PulseDot delayMs={200} />
              <PulseDot delayMs={400} />
            </View>

            <View className="h-1.5 w-40 bg-slate-100 rounded-full overflow-hidden">
              <Animated.View
                className="h-full bg-blue-500 rounded-full"
                entering={FadeIn.delay(1000)}
                style={{ width: "45%" }}
              />
            </View>

            <Text className="mt-5 text-[11px] font-black uppercase tracking-[3px] text-slate-300">
              {t("starting_engines")}
            </Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};
