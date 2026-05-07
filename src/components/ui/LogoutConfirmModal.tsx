import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, View } from "react-native";

type LogoutConfirmModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function LogoutConfirmModal({
  visible,
  onCancel,
  onConfirm,
}: LogoutConfirmModalProps) {
  const { t } = useTranslation();
  const { palette, isDark } = useTheme();

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View
          className="w-full max-w-md rounded-2xl border p-5"
          style={{ backgroundColor: palette.card, borderColor: palette.border }}
        >
          <View className="items-center">
            <View
              className="mb-3 h-14 w-14 items-center justify-center rounded-full"
              style={{
                backgroundColor: isDark ? "rgba(239,68,68,0.18)" : "#fef2f2",
              }}
            >
              <MaterialIcons
                name="logout"
                size={28}
                color={palette.dangerForeground}
              />
            </View>
            <Text
              className="text-center text-lg font-bold"
              style={{ color: palette.foreground }}
            >
              {t("logout")}
            </Text>
            <Text
              className="mt-2 text-center text-sm"
              style={{ color: palette.muted }}
            >
              {t("are_you_sure_you_want_to_logout")}
            </Text>
          </View>

          <View className="mt-5 flex-row gap-3">
            <Pressable
              onPress={onCancel}
              className="flex-1 items-center justify-center rounded-xl border py-3"
              style={{
                borderColor: palette.border,
                backgroundColor: palette.card,
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: palette.muted }}
              >
                {t("cancel")}
              </Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              className="flex-1 items-center justify-center rounded-xl py-3"
              style={{ backgroundColor: palette.dangerBg }}
            >
              <Text
                className="text-sm font-bold"
                style={{ color: palette.dangerForeground }}
              >
                {t("logout")}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
