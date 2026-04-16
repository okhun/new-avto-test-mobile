import "@/src/config/reanimated";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#137fec";
const BACKGROUND_LIGHT = "#f6f7f8";
const TEXT_DARK = "#0d141b";
const CARD_BG = "#ffffff";
const springConfig = { damping: 15, stiffness: 400 };

const OPTIONS = [
  { key: "A", text: "The blue bus arriving from the left" },
  { key: "B", text: "The red car turning right" },
  { key: "C", text: "Both vehicles must stop completely" },
  { key: "D", text: "Neither, it's a first-come first-served rule" },
];

const SITUATION_IMAGE_URI =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAzd3CI_Fu6dkF0sJhDsg44r1nMCL_3_3Zmxl04TYRVNscejE-5NBUEj58bf0DQie9w-AAk5ZnFlKJz5IyNh6jUlPnR0aR2fXxL_usmrV6EZV_fiMgePtOqFle454Iui5OofsN2M44KK7vauMcbsPOmp7cotdxg2lbmA4tPJaBgOAO6ktUtyOuFgn9NluLA6VaML2DohGfzbjJIRDlmdTu16lsARARNKgjEusRqkMzSULyVZwGcP1qV7mP0ei-S2aBFdkDLiRpAEuU";

function ScalePressable({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: object;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.98, springConfig);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, springConfig);
      }}
      style={style}
    >
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Pressable>
  );
}

export default function TicketExamScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ ticketId?: string }>();
  const ticketId = params.ticketId ?? "1";

  const [selectedOption, setSelectedOption] = useState<number>(1); // B = index 1
  const currentQuestion = 3;
  const totalQuestions = 10;
  const progressPercent = (currentQuestion / totalQuestions) * 100;

  const minutes = 14;
  const seconds = 42;

  const { width } = Dimensions.get("window");
  const imageHeight = (width - 32) * (9 / 16);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: BACKGROUND_LIGHT }}
      edges={["top"]}
    >
      {/* Sticky header */}
      <View
        className="flex-row items-center justify-between border-b border-slate-200 px-4 py-3"
        style={{ backgroundColor: `${BACKGROUND_LIGHT}CC` }}
      >
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full active:opacity-70"
          hitSlop={8}
        >
          <MaterialIcons name="close" size={24} color={TEXT_DARK} />
        </Pressable>
        <Text
          className="flex-1 text-center text-lg font-bold leading-tight tracking-tight"
          style={{ color: TEXT_DARK }}
        >
          Ticket #{ticketId}
        </Text>
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full active:opacity-70"
          hitSlop={8}
        >
          <MaterialIcons name="help-outline" size={24} color={TEXT_DARK} />
        </Pressable>
      </View>

      {/* Progress */}
      <View className="gap-2 px-4 pb-4 pt-2">
        <View className="flex-row items-center justify-between">
          <Text
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: TEXT_DARK }}
          >
            Current Progress
          </Text>
          <Text className="text-sm font-bold" style={{ color: PRIMARY }}>
            {currentQuestion}/{totalQuestions}
          </Text>
        </View>
        <View className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <View
            className="h-full rounded-full"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: PRIMARY,
            }}
          />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Timer */}
        <View className="flex-row items-center gap-4 px-4 py-2">
          <View
            className="min-w-0 flex-1 flex-col items-center gap-1 rounded-xl p-3 shadow-sm"
            style={{ backgroundColor: CARD_BG }}
          >
            <Text
              className="text-xl font-bold leading-tight"
              style={{ color: PRIMARY }}
            >
              {String(minutes).padStart(2, "0")}
            </Text>
            <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Minutes
            </Text>
          </View>
          <Text className="text-lg font-bold" style={{ color: PRIMARY }}>
            :
          </Text>
          <View
            className="min-w-0 flex-1 flex-col items-center gap-1 rounded-xl p-3 shadow-sm"
            style={{ backgroundColor: CARD_BG }}
          >
            <Text
              className="text-xl font-bold leading-tight"
              style={{ color: PRIMARY }}
            >
              {String(seconds).padStart(2, "0")}
            </Text>
            <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Seconds
            </Text>
          </View>
        </View>

        {/* Main content */}
        <View className="space-y-6 px-4 py-4">
          {/* Situational image */}
          <View className="overflow-hidden rounded-xl border border-slate-200 shadow-md">
            <Image
              source={{ uri: SITUATION_IMAGE_URI }}
              style={{
                width: width - 32,
                height: imageHeight,
                backgroundColor: "#e2e8f0",
              }}
              resizeMode="cover"
              accessibilityLabel="Intersection with red car and blue bus"
            />
          </View>

          {/* Question */}
          <View className="gap-2">
            <Text
              className="text-xl font-bold leading-tight tracking-tight"
              style={{ color: TEXT_DARK }}
            >
              Which vehicle must yield the right-of-way in this intersection
              scenario?
            </Text>
            <Text className="text-sm text-slate-500">
              Select the most appropriate answer according to standard traffic
              regulations.
            </Text>
          </View>

          {/* Answer options */}
          <View className="gap-3 pb-6">
            {OPTIONS.map((opt, index) => {
              const isSelected = selectedOption === index;
              return (
                <ScalePressable
                  key={opt.key}
                  onPress={() => setSelectedOption(index)}
                  style={{
                    width: "100%",
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 2,
                    borderColor: isSelected ? PRIMARY : "#e2e8f0",
                    backgroundColor: isSelected ? `${PRIMARY}0D` : CARD_BG,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: isSelected ? PRIMARY : "transparent",
                      borderWidth: isSelected ? 0 : 2,
                      borderColor: "#cbd5e1",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "700",
                        color: isSelected ? "#ffffff" : TEXT_DARK,
                      }}
                    >
                      {opt.key}
                    </Text>
                  </View>
                  <Text
                    numberOfLines={2}
                    style={{
                      flex: 1,
                      fontSize: 16,
                      color: TEXT_DARK,
                      fontWeight: isSelected ? "600" : "500",
                    }}
                  >
                    {opt.text}
                  </Text>
                </ScalePressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Bottom action - fixed */}
      <View
        className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-4"
        style={{ backgroundColor: `${BACKGROUND_LIGHT}F2` }}
      >
        <ScalePressable
          onPress={() => {}}
          style={{
            width: "100%",
            height: 56,
            backgroundColor: PRIMARY,
            borderRadius: 12,
            shadowColor: PRIMARY,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <View className="flex-row items-center justify-center gap-2">
            <Text className="text-base font-bold text-white">
              Confirm & Next
            </Text>
            <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
          </View>
        </ScalePressable>
        <View className="h-4" />
      </View>
    </SafeAreaView>
  );
}
