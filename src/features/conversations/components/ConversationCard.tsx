import { ScalePressable } from "@/src/components/ui/ScalePressable";
import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import type {
  Conversation,
  ConversationStatus,
  ConversationType,
} from "../types/conversation.types";
import { formatConversationTime } from "../utils/format";

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

const STATUS_LIGHT: Record<ConversationStatus, { bg: string; text: string }> = {
  open: { bg: "#dbeafe", text: "#1d4ed8" },
  pending: { bg: "#fef3c7", text: "#b45309" },
  closed: { bg: "#f1f5f9", text: "#64748b" },
};

const STATUS_DARK: Record<ConversationStatus, { bg: string; text: string }> = {
  open: { bg: "rgba(37, 99, 235, 0.28)", text: "#93c5fd" },
  pending: { bg: "rgba(245, 158, 11, 0.22)", text: "#fcd34d" },
  closed: { bg: "rgba(148, 163, 184, 0.2)", text: "#cbd5e1" },
};

export function ConversationCard({ conversation, onPress }: Props) {
  const { t } = useTranslation();
  const { palette, isDark } = useTheme();

  const TYPE_LABEL: Record<ConversationType, string> = {
    support: t("support"),
    contact: t("contact"),
    report: t("report_issue"),
  };

  const tokenMap = isDark ? STATUS_DARK : STATUS_LIGHT;
  const stRaw = tokenMap[conversation.status] ?? tokenMap.open;
  const stLabel =
    conversation.status === "open"
      ? t("open")
      : conversation.status === "pending"
        ? t("pending")
        : t("closed");

  const typeLabel = TYPE_LABEL[conversation.type] ?? conversation.type;
  const preview = lastPreview(conversation);
  const timeLabel = formatConversationTime(conversation.updatedAt);

  return (
    <ScalePressable
      onPress={onPress}
      style={{
        backgroundColor: palette.card,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: palette.border,
        marginBottom: 12,
      }}
    >
      <View className="flex-row items-start justify-between gap-2">
        <View className="min-w-0 flex-1 flex-row items-start gap-3">
          <View
            className="h-11 w-11 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${palette.primary}18` }}
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
              color={palette.primary}
            />
          </View>
          <View className="min-w-0 flex-1">
            <Text
              className="text-base font-bold leading-tight"
              style={{ color: palette.foreground }}
              numberOfLines={2}
            >
              {conversation.subject}
            </Text>
            <Text
              className="mt-1 text-xs font-semibold"
              style={{ color: palette.chevron }}
            >
              {typeLabel}
            </Text>
          </View>
        </View>
        <View className="items-end gap-1">
          <Text
            className="text-[11px] font-medium"
            style={{ color: palette.chevron }}
          >
            {timeLabel}
          </Text>
          <View
            className="rounded-full px-2 py-0.5"
            style={{ backgroundColor: stRaw.bg }}
          >
            <Text
              className="text-[10px] font-bold uppercase tracking-wide"
              style={{ color: stRaw.text }}
            >
              {stLabel}
            </Text>
          </View>
        </View>
      </View>
      <Text
        className="mt-3 text-sm leading-snug"
        style={{ color: palette.muted }}
        numberOfLines={2}
      >
        {preview}
      </Text>
    </ScalePressable>
  );
}
