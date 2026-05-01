import { ScalePressable } from "@/src/components/ui/ScalePressable";
import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

type Props = {
  onCreateTicket: () => void;
};

export function ConversationsEmptyState({ onCreateTicket }: Props) {
  const { t } = useTranslation();
  const { palette } = useTheme();

  return (
    <View className="flex-1 items-center justify-center px-8 pb-24">
      <View
        className="mb-5 h-20 w-20 items-center justify-center rounded-3xl"
        style={{ backgroundColor: `${palette.primary}14` }}
      >
        <MaterialIcons name="forum" size={44} color={palette.primary} />
      </View>
      <Text
        className="text-center text-lg font-bold"
        style={{ color: palette.foreground }}
      >
        {t("no_conversations_yet")}
      </Text>
      <Text
        className="mt-2 text-center text-sm leading-relaxed"
        style={{ color: palette.muted }}
      >
        {t("no_conversations_yet_description")}
      </Text>
      <ScalePressable
        onPress={onCreateTicket}
        style={{
          marginTop: 24,
          backgroundColor: palette.primary,
          paddingHorizontal: 28,
          paddingVertical: 14,
          borderRadius: 14,
        }}
      >
        <Text
          className="text-base font-bold"
          style={{ color: palette.switchThumb }}
        >
          {t("create_conversation")}
        </Text>
      </ScalePressable>
    </View>
  );
}
