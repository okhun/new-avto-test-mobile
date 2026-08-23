import { KnowledgeReferenceContent } from "@/src/components/knowledge-reference/KnowledgeReferenceContent";
import type { KnowledgeDetail } from "@/src/features/knowledge-base/types/knowledge-base.types";
import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MAX_HEIGHT = Dimensions.get("window").height * 0.7;

type Props = {
  visible: boolean;
  onClose: () => void;
  detail: KnowledgeDetail | null;
};

export function KnowledgeReferenceSheet({ visible, onClose, detail }: Props) {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <Pressable
          style={StyleSheet.absoluteFill}
          className="bg-slate-900/40"
          accessibilityRole="button"
          accessibilityLabel={t("hide_explanation")}
          onPress={onClose}
        />
        <View
          className="rounded-t-3xl border border-b-0 shadow-lg"
          style={{
            maxHeight: MAX_HEIGHT,
            backgroundColor: palette.card,
            borderColor: palette.border,
            paddingBottom: Math.max(insets.bottom, 16),
          }}
        >
          <View className="relative px-4 pt-3">
            <View className="mb-2 items-center">
              <View
                className="h-1 w-10 rounded-full"
                style={{ backgroundColor: palette.border }}
              />
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={t("hide_explanation")}
              className="absolute right-3 top-2 h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: palette.iconSurface }}
            >
              <MaterialIcons name="close" size={22} color={palette.muted} />
            </Pressable>
          </View>
          <ScrollView
            className="px-4 pt-4"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {detail ? <KnowledgeReferenceContent detail={detail} /> : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
