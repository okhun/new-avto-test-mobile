import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import type { ConversationMessage } from "../types/conversation.types";
import { formatMessageTime } from "../utils/format";

type Props = {
  message: ConversationMessage;
};

export function MessageBubble({ message }: Props) {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const isUser = message.senderType === "user";

  const bubbleBg = isUser ? palette.primary : palette.iconSurface;
  const textColor = isUser ? palette.switchThumb : palette.foreground;
  const timeColor = isUser ? "rgba(255,255,255,0.72)" : palette.muted;

  return (
    <View className={`mb-3 max-w-[88%] ${isUser ? "self-end" : "self-start"}`}>
      <View
        className="rounded-2xl px-3.5 py-2.5"
        style={{
          backgroundColor: bubbleBg,
          borderBottomRightRadius: isUser ? 4 : 16,
          borderBottomLeftRadius: isUser ? 16 : 4,
          borderWidth: isUser ? 0 : 1,
          borderColor: isUser ? "transparent" : palette.border,
        }}
      >
        {!isUser && (
          <View className="mb-1 flex-row items-center gap-1">
            <MaterialIcons
              name="headset-mic"
              size={14}
              color={palette.primary}
            />
            <Text
              className="text-[11px] font-bold"
              style={{ color: palette.primary }}
            >
              {t("support")}
            </Text>
          </View>
        )}
        <Text className="text-[15px] leading-snug" style={{ color: textColor }}>
          {message.message}
        </Text>
        <Text className="mt-1.5 text-[10px]" style={{ color: timeColor }}>
          {formatMessageTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
}
