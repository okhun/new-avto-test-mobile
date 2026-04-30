import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CONV } from "../constants/theme";

type Props = {
  onSend: (text: string) => void;
  disabled?: boolean;
  sending?: boolean;
  placeholder?: string;
};

export function ChatInputBar({
  onSend,
  disabled,
  sending,
  placeholder = "Xabar yozing…",
}: Props) {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const insets = useSafeAreaInsets();

  const submit = () => {
    const t = text.trim();
    if (!t || disabled || sending) return;
    onSend(t);
    setText("");
  };

  const canSend = text.trim().length > 0 && !disabled && !sending;

  return (
    <View
      className="flex-row items-end gap-2 border-t border-slate-200 bg-white px-3 pt-2"
      style={{
        paddingBottom: Math.max(insets.bottom, 12),
      }}
    >
      <TextInput
        className="max-h-28 min-h-[44px] flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] leading-snug"
        style={{ color: CONV.TEXT }}
        placeholder={t("write_message")}
        placeholderTextColor="#94a3b8"
        multiline
        maxLength={5000}
        editable={!disabled && !sending}
        value={text}
        onChangeText={setText}
      />
      <Pressable
        onPress={submit}
        disabled={!canSend}
        className="mb-0.5 h-11 w-11 items-center justify-center rounded-full"
        style={{
          backgroundColor: canSend ? CONV.PRIMARY : "#cbd5e1",
        }}
      >
        {sending ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <MaterialIcons name="send" size={22} color="#ffffff" />
        )}
      </Pressable>
    </View>
  );
}
