import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY = "#137fec";
const springConfig = { damping: 15, stiffness: 400 };

// --- Enhanced Native Shadows ---
const shadows = StyleSheet.create({
  card: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
    }),
  },
  hero: {
    ...Platform.select({
      ios: {
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
      android: { elevation: 8 },
    }),
  },
});

function ScalePressable({ children, onPress, className, style }: any) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(0.96, springConfig))}
      onPressOut={() => (scale.value = withSpring(1, springConfig))}
      className={className}
    >
      <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
    </Pressable>
  );
}

export default function HomeTabScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={["top"]}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header Section */}
        <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
          <View>
            <Text className="text-slate-500 text-sm font-medium">
              Welcome back,
            </Text>
            <Text className="text-slate-900 text-2xl font-black tracking-tight">
              Diyorbek 👋
            </Text>
          </View>
          <ScalePressable className="h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-sm">
            <MaterialIcons
              name="notifications-none"
              size={26}
              color="#1e293b"
            />
          </ScalePressable>
        </View>

        {/* Motivational Hero Card - Readiness Score */}
        <Animated.View entering={FadeInDown.delay(100)} className="px-6 py-4">
          <View
            style={[shadows.hero]}
            className="rounded-[32px] bg-blue-600 p-6 overflow-hidden"
          >
            {/* Background Decorative Circles */}
            <View className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
            <View className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-black/5" />

            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-blue-100 text-sm font-bold uppercase tracking-widest">
                  Readiness Score
                </Text>
                <Text className="text-white text-4xl font-black mt-1">84%</Text>
                <Text className="text-blue-100 text-xs mt-2 font-medium">
                  You're doing great! Just 6% more to reach "Exam Ready" status.
                </Text>
              </View>
              <View className="h-24 w-24 items-center justify-center rounded-full border-[6px] border-blue-400/30">
                <View className="h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
                  <MaterialCommunityIcons
                    name="shield-check"
                    size={32}
                    color={PRIMARY}
                  />
                </View>
              </View>
            </View>

            <ScalePressable className="mt-6 rounded-2xl bg-white py-4 shadow-sm">
              <Text className="text-center text-blue-600 font-black text-base">
                Continue Learning
              </Text>
            </ScalePressable>
          </View>
        </Animated.View>

        {/* Stats Grid */}
        <View className="flex-row px-6 gap-4">
          <View
            style={shadows.card}
            className="flex-1 rounded-3xl bg-white p-5 border border-slate-50"
          >
            <View className="h-10 w-10 rounded-xl bg-orange-50 items-center justify-center mb-3">
              <MaterialCommunityIcons name="fire" size={24} color="#f97316" />
            </View>
            <Text className="text-slate-400 text-xs font-bold uppercase">
              Streak
            </Text>
            <Text className="text-slate-900 text-xl font-black">7 Days</Text>
          </View>
          <View
            style={shadows.card}
            className="flex-1 rounded-3xl bg-white p-5 border border-slate-50"
          >
            <View className="h-10 w-10 rounded-xl bg-green-50 items-center justify-center mb-3">
              <MaterialCommunityIcons
                name="bullseye-arrow"
                size={24}
                color="#22c55e"
              />
            </View>
            <Text className="text-slate-400 text-xs font-bold uppercase">
              Accuracy
            </Text>
            <Text className="text-slate-900 text-xl font-black">92.4%</Text>
          </View>
        </View>

        {/* Categories / Topics */}
        <View className="mt-8">
          <View className="flex-row items-center justify-between px-6 mb-4">
            <Text className="text-slate-900 text-xl font-black tracking-tight">
              Study Topics
            </Text>
            <Pressable>
              <Text className="text-blue-600 font-bold">View All</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
          >
            {[
              { label: "Signs", icon: "traffic-light", color: "#3b82f6" },
              { label: "Rules", icon: "book-open-variant", color: "#8b5cf6" },
              { label: "First Aid", icon: "medical-bag", color: "#ef4444" },
              { label: "Penalties", icon: "gavel", color: "#f59e0b" },
            ].map((item, i) => (
              <Animated.View key={i} entering={FadeInRight.delay(i * 100)}>
                <ScalePressable className="mr-4 items-center">
                  <View
                    style={shadows.card}
                    className="h-20 w-20 rounded-[28px] bg-white items-center justify-center mb-2 border border-slate-50"
                  >
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={30}
                      color={item.color}
                    />
                  </View>
                  <Text className="text-slate-600 text-xs font-bold">
                    {item.label}
                  </Text>
                </ScalePressable>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Tickets Section */}
        <View className="px-6 mt-8">
          <Text className="text-slate-900 text-xl font-black tracking-tight mb-4">
            Exam Tickets
          </Text>

          {/* Active Ticket */}
          <ScalePressable
            style={shadows.card}
            className="bg-white rounded-[28px] p-4 flex-row items-center border border-blue-100 mb-4"
          >
            <View className="h-16 w-16 rounded-2xl bg-blue-600 items-center justify-center">
              <MaterialCommunityIcons name="play" size={32} color="white" />
            </View>
            <View className="flex-1 ml-4">
              <View className="flex-row items-center">
                <Text className="text-slate-900 font-black text-lg">
                  Ticket #3
                </Text>
                <View className="ml-2 bg-blue-100 px-2 py-0.5 rounded-md">
                  <Text className="text-blue-600 text-[10px] font-black uppercase">
                    Active
                  </Text>
                </View>
              </View>
              <Text className="text-slate-500 text-sm font-medium">
                Resume your current test
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
          </ScalePressable>

          {/* Completed Ticket */}
          <View
            style={shadows.card}
            className="bg-white rounded-[28px] p-4 flex-row items-center border border-slate-50 mb-4"
          >
            <View className="h-16 w-16 rounded-2xl bg-green-50 items-center justify-center">
              <MaterialCommunityIcons
                name="check-decagram"
                size={32}
                color="#22c55e"
              />
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-slate-900 font-black text-lg">
                Ticket #1
              </Text>
              <Text className="text-slate-400 text-sm font-medium">
                Passed • Score: 20/20
              </Text>
            </View>
            <View className="bg-green-100 h-10 w-10 rounded-full items-center justify-center">
              <Text className="text-green-700 font-black text-xs">100%</Text>
            </View>
          </View>

          {/* Locked Ticket */}
          <View className="bg-slate-50/50 rounded-[28px] p-4 flex-row items-center border border-dashed border-slate-200">
            <View className="h-16 w-16 rounded-2xl bg-slate-100 items-center justify-center opacity-50">
              <MaterialCommunityIcons name="lock" size={28} color="#94a3b8" />
            </View>
            <View className="flex-1 ml-4 opacity-50">
              <Text className="text-slate-900 font-black text-lg">
                Ticket #4
              </Text>
              <Text className="text-slate-400 text-sm font-medium">
                Unlock after 5 more tests
              </Text>
            </View>
            <MaterialIcons name="lock-outline" size={20} color="#CBD5E1" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
