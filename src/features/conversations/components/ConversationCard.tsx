import { ScalePressable } from "@/src/components/ui/ScalePressable";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Text, View } from "react-native";
import { CONV } from "../constants/theme";
import type {
  Conversation,
  ConversationStatus,
  ConversationType,
} from "../types/conversation.types";
import { formatConversationTime } from "../utils/format";

const TYPE_LABEL: Record<ConversationType, string> = {
  support: "Qo'llab-quvvatlash",
  contact: "Aloqa",
  report: "Xabar",
};

const STATUS_STYLE: Record<
  ConversationStatus,
  { label: string; bg: string; text: string }
> = {
  open: { label: "Ochiq", bg: "#dbeafe", text: "#1d4ed8" },
  pending: { label: "Kutilmoqda", bg: "#fef3c7", text: "#b45309" },
  closed: { label: "Yopilgan", bg: "#f1f5f9", text: "#64748b" },
};

function lastPreview(c: Conversation): string {
  const msgs = c.messages ?? [];
  if (!msgs.length) return c.subject || "Xabar yo'q";
  const last = msgs[msgs.length - 1];
  return last?.message ?? "";
}

type Props = {
  conversation: Conversation;
  onPress: () => void;
};

export function ConversationCard({ conversation, onPress }: Props) {
  const typeLabel = TYPE_LABEL[conversation.type] ?? conversation.type;
  const st = STATUS_STYLE[conversation.status] ?? STATUS_STYLE.open;
  const preview = lastPreview(conversation);
  const timeLabel = formatConversationTime(conversation.updatedAt);

  return (
    <ScalePressable
      onPress={onPress}
      style={{
        backgroundColor: CONV.CARD,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: CONV.BORDER,
        marginBottom: 12,
      }}
    >
      <View className="flex-row items-start justify-between gap-2">
        <View className="min-w-0 flex-1 flex-row items-start gap-3">
          <View
            className="h-11 w-11 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${CONV.PRIMARY}18` }}
          >
            <MaterialIcons
              name={
                conversation.type === "support"
                  ? "support-agent"
                  : conversation.type === "report"
                    ? "flag"
                    : "mail-outline"
              }
              size={22}
              color={CONV.PRIMARY}
            />
          </View>
          <View className="min-w-0 flex-1">
            <Text
              className="text-base font-bold leading-tight"
              style={{ color: CONV.TEXT }}
              numberOfLines={2}
            >
              {conversation.subject}
            </Text>
            <Text className="mt-1 text-xs font-semibold text-slate-400">
              {typeLabel}
            </Text>
          </View>
        </View>
        <View className="items-end gap-1">
          <Text className="text-[11px] font-medium text-slate-400">
            {timeLabel}
          </Text>
          <View
            className="rounded-full px-2 py-0.5"
            style={{ backgroundColor: st.bg }}
          >
            <Text
              className="text-[10px] font-bold uppercase tracking-wide"
              style={{ color: st.text }}
            >
              {st.label}
            </Text>
          </View>
        </View>
      </View>
      <Text
        className="mt-3 text-sm leading-snug text-slate-600"
        numberOfLines={2}
      >
        {preview}
      </Text>
    </ScalePressable>
  );
}
