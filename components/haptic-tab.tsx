import * as Haptics from "expo-haptics";
import { Pressable } from "react-native";

export function HapticTab(props: any) {
  return (
    <Pressable
      {...props}
      onPressIn={(e) => {
        // safer iOS check
        const isIOS = process.env.EXPO_OS === "ios";

        if (isIOS) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        props.onPressIn?.(e);
      }}
    />
  );
}
