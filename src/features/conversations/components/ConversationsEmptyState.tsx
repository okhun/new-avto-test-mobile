import { ScalePressable } from "@/src/components/ui/ScalePressable";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { CONV } from "../constants/theme";

type Props = {
  onCreateTicket: () => void;
};

export function ConversationsEmptyState({ onCreateTicket }: Props) {
  const { t } = useTranslation();
  return (
    <View className="flex-1 items-center justify-center px-8 pb-24">
      <View
        className="mb-5 h-20 w-20 items-center justify-center rounded-3xl"
        style={{ backgroundColor: `${CONV.PRIMARY}14` }}
      >
        <MaterialIcons name="forum" size={44} color={CONV.PRIMARY} />
      </View>
      <Text
        className="text-center text-lg font-bold"
        style={{ color: CONV.TEXT }}
      >
        {t("no_conversations_yet")}
      </Text>
      <Text className="mt-2 text-center text-sm leading-relaxed text-slate-500">
        {t("no_conversations_yet_description")}
      </Text>
      <ScalePressable
        onPress={onCreateTicket}
        style={{
          marginTop: 24,
          backgroundColor: CONV.PRIMARY,
          paddingHorizontal: 28,
          paddingVertical: 14,
          borderRadius: 14,
        }}
      >
        <Text className="text-base font-bold text-white">
          {t("create_conversation")}
        </Text>
      </ScalePressable>
    </View>
  );
}
