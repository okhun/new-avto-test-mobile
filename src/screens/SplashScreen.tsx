import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface SplashScreenProps {
  onFinish: () => void;
}

const PRIMARY = "#258cf4";
const CHARCOAL = "#1a1a1a";

function usePulseDot(delayMs: number) {
  const opacity = useSharedValue(0.3);
  const translateY = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delayMs,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0.3, { duration: 600 })
        ),
        -1,
        false
      )
    );

    translateY.value = withDelay(
      delayMs,
      withRepeat(
        withSequence(
          withTiming(-4, { duration: 300 }),
          withTiming(0, { duration: 300 })
        ),
        -1,
        false
      )
    );
  }, []);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}

function PulseDot({ delayMs }: { delayMs: number }) {
  const animatedStyle = usePulseDot(delayMs);

  return (
    <Animated.View
      style={animatedStyle}
      className="h-2 w-2 rounded-full bg-blue-500"
    />
  );
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const scale = useSharedValue(0.9);

  useEffect(() => {
    // Logo breathing animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-between px-6">
        {/* CENTER */}
        <View className="flex-1 items-center justify-center">
          <Animated.View
            style={logoStyle}
            className="mb-6 items-center justify-center"
          >
            <View
              className="h-32 w-32 items-center justify-center rounded-[40px]"
              style={{ backgroundColor: `${PRIMARY}15` }}
            >
              <MaterialCommunityIcons
                name="steering"
                size={72}
                color={PRIMARY}
              />
            </View>
          </Animated.View>

          <Text className="text-4xl font-extrabold text-[#1a1a1a]">
            Auto Test
          </Text>

          <Text className="mt-2 text-sm text-gray-400">
            Learn. Practice. Pass.
          </Text>
        </View>

        {/* BOTTOM */}
        <View className="items-center pb-14">
          <View className="flex-row items-center gap-2">
            <PulseDot delayMs={0} />
            <PulseDot delayMs={150} />
            <PulseDot delayMs={300} />
          </View>

          <Text className="mt-4 text-sm text-gray-400">
            Loading questions...
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
