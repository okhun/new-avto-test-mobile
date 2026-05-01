import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  onSend: (text: string) => void;
  disabled?: boolean;
  sending?: boolean;
  placeholder?: string;
};

export function ChatInputBar({ onSend, disabled, sending }: Props) {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const [text, setText] = useState("");
  const insets = useSafeAreaInsets();

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled || sending) return;
    onSend(trimmed);
    setText("");
  };

  const canSend = text.trim().length > 0 && !disabled && !sending;

  return (
    <View
      className="flex-row items-end gap-2 border-t px-3 pt-2"
      style={{
        paddingBottom: Math.max(insets.bottom, 12),
        backgroundColor: palette.card,
        borderTopColor: palette.border,
      }}
    >
      <TextInput
        className="max-h-28 min-h-[44px] flex-1 rounded-2xl border px-4 py-3 text-[15px] leading-snug"
        style={{
          color: palette.foreground,
          borderColor: palette.border,
          backgroundColor: palette.iconSurface,
        }}
        placeholder={t("write_message")}
        placeholderTextColor={palette.muted}
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
          backgroundColor: canSend ? palette.primary : palette.radioOff,
        }}
      >
        {sending ? (
          <ActivityIndicator color={palette.switchThumb} size="small" />
        ) : (
          <MaterialIcons
            name="send"
            size={22}
            color={canSend ? palette.switchThumb : palette.muted}
          />
        )}
      </Pressable>
    </View>
  );
}
