import { ScalePressable } from "@/src/components/ui/ScalePressable";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { COLORS } from "../constants/theme";

interface ConfirmButtonProps {
  onPress: () => void;
  isSubmitting: boolean;
}

export function ConfirmButton({ onPress, isSubmitting }: ConfirmButtonProps) {
  return (
    <Animated.View
      entering={SlideInDown.duration(300).springify()}
      exiting={SlideOutDown.duration(200)}
      className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-4 pb-8"
      style={{ backgroundColor: `${COLORS.BG}F2` }}
    >
      <ScalePressable
        onPress={onPress}
        disabled={isSubmitting}
        style={{
          width: "100%",
          height: 56,
          backgroundColor: COLORS.PRIMARY,
          borderRadius: 12,
          shadowColor: COLORS.PRIMARY,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <View className="flex-row items-center justify-center gap-2">
            <Text className="text-base font-bold text-white">
              Confirm & Next
            </Text>
            <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
          </View>
        )}
      </ScalePressable>
    </Animated.View>
  );
}
