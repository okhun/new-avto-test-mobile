import { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface PulseProps {
  w: number | `${number}%`;
  h: number;
  r?: number;
  style?: object;
  /** Skeleton fill; defaults to a light gray. */
  color?: string;
}

export function Pulse({ w, h, r = 8, style, color = "#e2e8f0" }: PulseProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const anim = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width: w as any,
          height: h,
          borderRadius: r,
          backgroundColor: color,
        },
        anim,
        style,
      ]}
    />
  );
}
