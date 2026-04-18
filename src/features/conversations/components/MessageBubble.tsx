import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Text, View } from "react-native";
import { CONV } from "../constants/theme";
import type { ConversationMessage } from "../types/conversation.types";
import { formatMessageTime } from "../utils/format";

type Props = {
  message: ConversationMessage;
};

export function MessageBubble({ message }: Props) {
  const isUser = message.senderType === "user";

  return (
    <View className={`mb-3 max-w-[88%] ${isUser ? "self-end" : "self-start"}`}>
      <View
        className="rounded-2xl px-3.5 py-2.5"
        style={{
          backgroundColor: isUser ? CONV.USER_BUBBLE : CONV.ADMIN_BUBBLE,
          borderBottomRightRadius: isUser ? 4 : 16,
          borderBottomLeftRadius: isUser ? 16 : 4,
          borderWidth: isUser ? 0 : 1,
          borderColor: isUser ? "transparent" : "#e2e8f0",
        }}
      >
        {!isUser && (
          <View className="mb-1 flex-row items-center gap-1">
            <MaterialIcons name="headset-mic" size={14} color={CONV.PRIMARY} />
            <Text
              className="text-[11px] font-bold"
              style={{ color: CONV.PRIMARY }}
            >
              Qo&apos;llab-quvvatlash
            </Text>
          </View>
        )}
        <Text
          className="text-[15px] leading-snug"
          style={{ color: isUser ? "#ffffff" : CONV.TEXT }}
        >
          {message.message}
        </Text>
        <Text
          className={`mt-1.5 text-[10px] ${isUser ? "text-white/75" : "text-slate-400"}`}
        >
          {formatMessageTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
}
