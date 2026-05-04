import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width: SW, height: SH } = Dimensions.get("window");
const SPRING = { damping: 20, stiffness: 200 };
const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2.5;

interface ImagePreviewProps {
  uri: string;
  width: number;
  height: number;
}

export function ImagePreview({ uri, width, height }: ImagePreviewProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Pressable onPress={() => setVisible(true)}>
        <View className="overflow-hidden rounded-xl border border-slate-200 shadow-md">
          <Image
            source={{ uri }}
            style={{
              width,
              height,
              backgroundColor: "#e2e8f0",
              alignSelf: "center",
            }}
            resizeMode="contain"
          />
          <View
            style={styles.expandHint}
            className="flex-row items-center gap-1 rounded-lg"
          >
            <MaterialIcons name="zoom-in" size={16} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 11, fontWeight: "600" }}>
              Tap to zoom
            </Text>
          </View>
        </View>
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setVisible(false)}
      >
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <FullscreenViewer uri={uri} onClose={() => setVisible(false)} />
      </Modal>
    </>
  );
}

function FullscreenViewer({
  uri,
  onClose,
}: {
  uri: string;
  onClose: () => void;
}) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const clampTranslation = useCallback(
    (s: number) => {
      "worklet";
      const maxX = ((s - 1) * SW) / 2;
      const maxY = ((s - 1) * SH) / 2;
      translateX.value = Math.min(Math.max(translateX.value, -maxX), maxX);
      translateY.value = Math.min(Math.max(translateY.value, -maxY), maxY);
    },
    [translateX, translateY]
  );

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      const next = savedScale.value * e.scale;
      scale.value = Math.min(Math.max(next, 0.5), MAX_SCALE);
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withSpring(1, SPRING);
        translateX.value = withSpring(0, SPRING);
        translateY.value = withSpring(0, SPRING);
        savedScale.value = 1;
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else {
        savedScale.value = scale.value;
        clampTranslation(scale.value);
        savedTranslateX.value = translateX.value;
        savedTranslateY.value = translateY.value;
      }
    });

  const pan = Gesture.Pan()
    .minPointers(1)
    .maxPointers(2)
    .onUpdate((e) => {
      if (savedScale.value > 1) {
        translateX.value = savedTranslateX.value + e.translationX;
        translateY.value = savedTranslateY.value + e.translationY;
      }
    })
    .onEnd(() => {
      if (savedScale.value <= 1) {
        translateX.value = withSpring(0, SPRING);
        translateY.value = withSpring(0, SPRING);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
        return;
      }
      clampTranslation(savedScale.value);
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        scale.value = withSpring(1, SPRING);
        translateX.value = withSpring(0, SPRING);
        translateY.value = withSpring(0, SPRING);
        savedScale.value = 1;
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else {
        scale.value = withSpring(DOUBLE_TAP_SCALE, SPRING);
        savedScale.value = DOUBLE_TAP_SCALE;
      }
    });

  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      if (savedScale.value <= 1) {
        runOnJS(onClose)();
      }
    });

  const tapGesture = Gesture.Exclusive(doubleTap, singleTap);
  const composed = Gesture.Simultaneous(pinch, pan, tapGesture);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureHandlerRootView style={styles.fullscreen}>
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.fullscreen, { backgroundColor: "#000" }]}>
          <Animated.Image
            source={{ uri }}
            style={[styles.fullImage, animStyle]}
            resizeMode="contain"
          />
        </Animated.View>
      </GestureDetector>

      <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
        <View className="h-10 w-10 items-center justify-center rounded-full bg-black/50">
          <MaterialIcons name="close" size={24} color="#fff" />
        </View>
      </Pressable>

      <View style={styles.zoomHint} pointerEvents="none">
        <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
          Pinch to zoom · Double-tap to toggle · Tap to close
        </Text>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  expandHint: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  fullscreen: {
    flex: 1,
  },
  fullImage: {
    width: SW,
    height: SH,
  },
  closeBtn: {
    position: "absolute",
    top: 50,
    right: 16,
  },
  zoomHint: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
});
