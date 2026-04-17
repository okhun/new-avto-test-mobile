import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#137fec";
const BACKGROUND_LIGHT = "#f6f7f8";
const TEXT_DARK = "#0d141b";
const TEXT_SECONDARY = "#4c739a";
const CARD_BG = "#ffffff";
const springConfig = { damping: 15, stiffness: 400 };

function ScalePressable({
  children,
  onPress,
  className,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
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
      className={className}
      style={style}
    >
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </Pressable>
  );
}

export default function HomeTabScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: BACKGROUND_LIGHT }}
      edges={["top"]}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top App Bar */}
        <View className="flex-row items-center justify-between bg-[#f6f7f8] px-4 pb-2 pt-4">
          <View className="flex-row flex-1 items-center">
            <View
              className="h-10 w-10 shrink-0 rounded-full border-2 bg-slate-200"
              style={{ borderColor: `${PRIMARY}33` }}
            >
              <View className="h-full w-full items-center justify-center rounded-full bg-slate-300">
                <MaterialIcons name="person" size={22} color={TEXT_SECONDARY} />
              </View>
            </View>
            <View className="flex-1 px-2">
              <Text
                className="text-lg font-bold leading-tight tracking-tight"
                style={{ color: TEXT_DARK }}
              >
                Dashboard
              </Text>
              <Text
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: TEXT_SECONDARY }}
              >
                Ready for a quiz?
              </Text>
            </View>
          </View>
          <Pressable className="h-12 w-12 items-center justify-center">
            <MaterialIcons name="notifications" size={24} color={TEXT_DARK} />
          </Pressable>
        </View>

        {/* Stats Overview */}
        <View className="flex-row flex-wrap gap-3 px-4 py-4">
          <View
            className="min-w-[158px] flex-1 flex-col gap-2 rounded-xl border border-slate-100 p-5 shadow-sm"
            style={{ backgroundColor: CARD_BG }}
          >
            <View className="flex-row items-center gap-2">
              <MaterialIcons
                name="assignment-turned-in"
                size={20}
                color={PRIMARY}
              />
              <Text
                className="text-sm font-medium"
                style={{ color: TEXT_SECONDARY }}
              >
                Tests Taken
              </Text>
            </View>
            <Text
              className="text-2xl font-bold leading-tight"
              style={{ color: TEXT_DARK }}
            >
              12
            </Text>
          </View>
          <View
            className="min-w-[158px] flex-1 flex-col gap-2 rounded-xl border border-slate-100 p-5 shadow-sm"
            style={{ backgroundColor: CARD_BG }}
          >
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="insights" size={20} color={PRIMARY} />
              <Text
                className="text-sm font-medium"
                style={{ color: TEXT_SECONDARY }}
              >
                Avg. Score
              </Text>
            </View>
            <Text
              className="text-2xl font-bold leading-tight"
              style={{ color: TEXT_DARK }}
            >
              85%
            </Text>
          </View>
        </View>

        {/* CTA */}
        <View className="px-4 py-3">
          <ScalePressable
            onPress={() => {}}
            style={{ backgroundColor: PRIMARY }}
            className="flex-1  rounded-xl px-5 py-4 shadow-lg"
          >
            <View className="flex-row items-center justify-center gap-3">
              <MaterialIcons name="play-circle" size={24} color="#ffffff" />
              <Text className="text-base font-bold text-white">
                Start New Test
              </Text>
            </View>
          </ScalePressable>
        </View>

        {/* Section Header */}
        <View className="flex-row items-center justify-between px-4 pb-2 pt-6">
          <Text
            className="text-[20px] font-bold leading-tight tracking-tight"
            style={{ color: TEXT_DARK }}
          >
            Available Tickets
          </Text>
          <Pressable>
            <Text className="text-sm font-semibold" style={{ color: PRIMARY }}>
              See All
            </Text>
          </Pressable>
        </View>

        {/* Ticket List */}
        <View className="gap-2 px-4 pb-10">
          {/* Ticket 1 - Completed (90%) */}
          <View
            className="min-h-[80px] flex-row items-center justify-between rounded-xl border border-slate-100 px-4 py-3 shadow-sm"
            style={{ backgroundColor: CARD_BG }}
          >
            <View className="flex-row flex-1 items-center gap-4">
              <View className="h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100">
                <MaterialIcons name="check-circle" size={24} color="#22c55e" />
              </View>
              <View className="flex-1 justify-center">
                <Text
                  className="text-base font-bold leading-normal"
                  style={{ color: TEXT_DARK }}
                  numberOfLines={1}
                >
                  Ticket #1
                </Text>
                <Text
                  className="text-sm font-normal leading-normal"
                  style={{ color: TEXT_SECONDARY }}
                  numberOfLines={1}
                >
                  Completed • Score: 18/20
                </Text>
              </View>
            </View>
            <View className="shrink-0 rounded-lg bg-green-100 px-2 py-1">
              <Text className="text-sm font-bold text-green-600">90%</Text>
            </View>
          </View>

          {/* Ticket 2 - Completed (80%) */}
          <View
            className="min-h-[80px] flex-row items-center justify-between rounded-xl border border-slate-100 px-4 py-3 shadow-sm"
            style={{ backgroundColor: CARD_BG }}
          >
            <View className="flex-row flex-1 items-center gap-4">
              <View
                className="h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${PRIMARY}1A` }}
              >
                <MaterialIcons name="check-circle" size={24} color={PRIMARY} />
              </View>
              <View className="flex-1 justify-center">
                <Text
                  className="text-base font-bold leading-normal"
                  style={{ color: TEXT_DARK }}
                  numberOfLines={1}
                >
                  Ticket #2
                </Text>
                <Text
                  className="text-sm font-normal leading-normal"
                  style={{ color: TEXT_SECONDARY }}
                  numberOfLines={1}
                >
                  Completed • Score: 16/20
                </Text>
              </View>
            </View>
            <View
              className="shrink-0 rounded-lg px-2 py-1"
              style={{ backgroundColor: `${PRIMARY}1A` }}
            >
              <Text className="text-sm font-bold" style={{ color: PRIMARY }}>
                80%
              </Text>
            </View>
          </View>

          {/* Ticket 3 - New/Active */}
          <View
            className="min-h-[80px] flex-row items-center justify-between rounded-xl border-2 px-4 py-3 shadow-md"
            style={{
              backgroundColor: CARD_BG,
              borderColor: `${PRIMARY}33`,
            }}
          >
            <View className="flex-row flex-1 items-center gap-4">
              <View
                className="h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: PRIMARY }}
              >
                <MaterialIcons name="bolt" size={24} color="#ffffff" />
              </View>
              <View className="flex-1 justify-center">
                <View className="flex-row items-center gap-2">
                  <Text
                    className="text-base font-bold leading-normal"
                    style={{ color: TEXT_DARK }}
                    numberOfLines={1}
                  >
                    Ticket #3
                  </Text>
                  <View
                    className="rounded px-1.5 py-0.5"
                    style={{ backgroundColor: PRIMARY }}
                  >
                    <Text className="text-[10px] font-bold uppercase text-white">
                      New
                    </Text>
                  </View>
                </View>
                <Text
                  className="text-sm font-normal leading-normal"
                  style={{ color: TEXT_SECONDARY }}
                  numberOfLines={1}
                >
                  Current Ticket • 20 Questions
                </Text>
              </View>
            </View>
            <MaterialIcons
              name="arrow-forward-ios"
              size={14}
              color={TEXT_SECONDARY}
            />
          </View>

          {/* Ticket 4 - Locked */}
          <View className="min-h-[80px] flex-row items-center justify-between rounded-xl border border-dashed border-slate-200 bg-slate-100/50 px-4 py-3">
            <View className="flex-row flex-1 items-center gap-4 opacity-60">
              <View className="h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-200">
                <MaterialIcons name="lock" size={24} color={TEXT_SECONDARY} />
              </View>
              <View className="flex-1 justify-center">
                <Text
                  className="text-base font-bold leading-normal"
                  style={{ color: TEXT_DARK }}
                  numberOfLines={1}
                >
                  Ticket #4
                </Text>
                <Text
                  className="text-sm font-normal leading-normal"
                  style={{ color: TEXT_SECONDARY }}
                  numberOfLines={1}
                >
                  Unlock at Level 5
                </Text>
              </View>
            </View>
            <MaterialIcons name="lock" size={20} color="#cbd5e1" />
          </View>

          {/* Ticket 5 - Locked */}
          <View className="min-h-[80px] flex-row items-center justify-between rounded-xl border border-dashed border-slate-200 bg-slate-100/50 px-4 py-3">
            <View className="flex-row flex-1 items-center gap-4 opacity-60">
              <View className="h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-200">
                <MaterialIcons name="lock" size={24} color={TEXT_SECONDARY} />
              </View>
              <View className="flex-1 justify-center">
                <Text
                  className="text-base font-bold leading-normal"
                  style={{ color: TEXT_DARK }}
                  numberOfLines={1}
                >
                  Ticket #5
                </Text>
                <Text
                  className="text-sm font-normal leading-normal"
                  style={{ color: TEXT_SECONDARY }}
                  numberOfLines={1}
                >
                  Unlock at Level 6
                </Text>
              </View>
            </View>
            <MaterialIcons name="lock" size={20} color="#cbd5e1" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
