import React from "react";
import { Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const SPRING = { damping: 15, stiffness: 400 };

interface ScalePressableProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  style?: object;
  disabled?: boolean;
}

export function ScalePressable({
  children,
  onPress,
  className,
  style,
  disabled,
}: ScalePressableProps) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.97, SPRING);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, SPRING);
      }}
      className={className}
      style={style}
      disabled={disabled}
    >
      <Animated.View style={animStyle}>{children}</Animated.View>
    </Pressable>
  );
}
