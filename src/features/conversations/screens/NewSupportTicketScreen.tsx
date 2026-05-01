import { useCreateSupportConversation } from "@/src/features/conversations/hook/useConversation";
import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SUBJECT_MIN = 3;
const SUBJECT_MAX = 255;
const MSG_MIN = 10;
const MSG_MAX = 5000;

export default function NewSupportTicketScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { palette } = useTheme();
  const { mutateAsync: createTicket, isPending } =
    useCreateSupportConversation();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const subjectOk =
    subject.trim().length >= SUBJECT_MIN &&
    subject.trim().length <= SUBJECT_MAX;
  const msgOk =
    message.trim().length >= MSG_MIN && message.trim().length <= MSG_MAX;
  const canSubmit = subjectOk && msgOk && !isPending;

  const submit = useCallback(async () => {
    setError(null);
    if (!subjectOk) {
      setError(t("subject_min_max", { min: SUBJECT_MIN, max: SUBJECT_MAX }));
      return;
    }
    if (!msgOk) {
      setError(t("message_min_max", { min: MSG_MIN, max: MSG_MAX }));
      return;
    }
    try {
      const conv = await createTicket({
        type: "support",
        subject: subject.trim(),
        message: message.trim(),
      });
      router.replace(`/conversations/${conv.id}`);
    } catch {
      setError(t("error_sending_ticket"));
    }
  }, [createTicket, subject, message, subjectOk, msgOk, router, t]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: palette.background }}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          className="flex-row items-center border-b px-2 pb-3 pt-1"
          style={{
            borderBottomColor: palette.divider,
            backgroundColor: palette.card,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full"
            hitSlop={8}
            style={({ pressed }) =>
              pressed ? { backgroundColor: palette.surfacePressed } : undefined
            }
          >
            <MaterialIcons name="close" size={24} color={palette.foreground} />
          </Pressable>
          <Text
            className="flex-1 text-center text-lg font-bold"
            style={{ color: palette.foreground }}
          >
            {t("new_conversation")}
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1 px-4 pt-4"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <Text
            className="mb-2 text-sm font-semibold"
            style={{ color: palette.foreground }}
          >
            {t("subject")}
          </Text>
          <TextInput
            className="mb-1 rounded-xl border px-4 py-3.5 text-[15px]"
            style={{
              color: palette.foreground,
              borderColor: palette.border,
              backgroundColor: palette.iconSurface,
            }}
            placeholder={t("subject_placeholder")}
            placeholderTextColor={palette.muted}
            value={subject}
            onChangeText={setSubject}
            maxLength={SUBJECT_MAX}
          />
          <Text
            className="mb-4 text-right text-xs"
            style={{ color: palette.chevron }}
          >
            {subject.trim().length}/{SUBJECT_MAX} ·{" "}
            {t("at_least", { min: SUBJECT_MIN })}
          </Text>

          <Text
            className="mb-2 text-sm font-semibold"
            style={{ color: palette.foreground }}
          >
            {t("message")}
          </Text>
          <TextInput
            className="min-h-[160px] rounded-xl border px-4 py-3.5 text-[15px] leading-relaxed"
            style={{
              color: palette.foreground,
              textAlignVertical: "top",
              borderColor: palette.border,
              backgroundColor: palette.iconSurface,
            }}
            placeholder={t("message_placeholder")}
            placeholderTextColor={palette.muted}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={MSG_MAX}
          />
          <Text
            className="mb-4 text-right text-xs"
            style={{ color: palette.chevron }}
          >
            {message.trim().length}/{MSG_MAX} ·{" "}
            {t("at_least", { min: MSG_MIN })}
          </Text>

          {error ? (
            <View
              className="mb-4 rounded-xl border px-3 py-2"
              style={{
                backgroundColor: palette.dangerBg,
                borderColor: `${palette.dangerForeground}44`,
              }}
            >
              <Text
                className="text-sm"
                style={{ color: palette.dangerForeground }}
              >
                {error}
              </Text>
            </View>
          ) : null}

          <Pressable
            onPress={submit}
            disabled={!canSubmit}
            className="flex-row items-center justify-center gap-2 rounded-2xl py-4"
            style={{
              backgroundColor: canSubmit ? palette.primary : palette.radioOff,
            }}
          >
            {isPending ? (
              <ActivityIndicator color={palette.switchThumb} />
            ) : (
              <Text
                className="text-base font-bold"
                style={{
                  color: canSubmit ? palette.switchThumb : palette.muted,
                }}
              >
                {t("send_ticket")}
              </Text>
            )}
          </Pressable>

          <Text
            className="mt-4 text-center text-xs leading-relaxed"
            style={{ color: palette.chevron }}
          >
            {t("saved_conversations_description")}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
