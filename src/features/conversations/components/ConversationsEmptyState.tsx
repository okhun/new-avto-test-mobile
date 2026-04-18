import { ScalePressable } from "@/src/components/ui/ScalePressable";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Text, View } from "react-native";
import { CONV } from "../constants/theme";

type Props = {
  onCreateTicket: () => void;
};

export function ConversationsEmptyState({ onCreateTicket }: Props) {
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
        Hozircha murojaat yo&apos;q
      </Text>
      <Text className="mt-2 text-center text-sm leading-relaxed text-slate-500">
        Texnik yoki dastur bo&apos;yicha savolingiz bo&apos;lsa, yangi murojaat
        oching — jamoamiz tez orada javob beradi.
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
          Murojaat yaratish
        </Text>
      </ScalePressable>
    </View>
  );
}
