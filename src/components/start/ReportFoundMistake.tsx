import { useCreateReportFoundMistake } from "@/src/features/conversations/hook/useConversation";
import { useToast } from "@/src/providers/ToastProvider";
import { useTheme } from "@/src/theme";
import { ApiError } from "@/src/utils/network/errors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const SUBJECT_MIN = 3;
const SUBJECT_MAX = 255;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 5000;

type Props = {
  questionId: string;
  questionOrder: number;
  variant?: "button" | "icon";
};

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError && error.message) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function ReportFoundMistake({
  questionId,
  questionOrder,
  variant = "button",
}: Props) {
  const { t } = useTranslation();
  const toast = useToast();
  const { palette, isDark } = useTheme();
  const { mutateAsync, isPending } = useCreateReportFoundMistake();

  const defaultSubject = useMemo(
    () => t("report_mistake_default_subject", { n: questionOrder }),
    [t, questionOrder],
  );

  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState("");
  const [subjectError, setSubjectError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setSubject(t("report_mistake_default_subject", { n: questionOrder }));
    setMessage("");
    setSubjectError(null);
    setMessageError(null);
  }, [t, questionOrder]);

  useEffect(() => {
    if (open) resetForm();
  }, [questionId, open, resetForm]);

  const openModal = () => {
    resetForm();
    setOpen(true);
  };

  const closeModal = () => {
    if (isPending) return;
    setOpen(false);
  };

  const submit = async () => {
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();
    let valid = true;

    if (!questionId) {
      toast.error(t("report_validation_question_id"));
      return;
    }
    if (trimmedSubject.length < SUBJECT_MIN) {
      setSubjectError(t("contact_validation_subject_required"));
      valid = false;
    } else if (trimmedSubject.length > SUBJECT_MAX) {
      setSubjectError(t("contact_validation_subject_too_long"));
      valid = false;
    } else {
      setSubjectError(null);
    }

    if (trimmedMessage.length < MESSAGE_MIN) {
      setMessageError(t("report_validation_message_min"));
      valid = false;
    } else if (trimmedMessage.length > MESSAGE_MAX) {
      setMessageError(t("contact_validation_message_too_long"));
      valid = false;
    } else {
      setMessageError(null);
    }

    if (!valid) return;

    try {
      await mutateAsync({
        questionId,
        subject: trimmedSubject,
        message: trimmedMessage,
        type: "report",
      });
      toast.success(t("report_mistake_success"));
      setOpen(false);
      setMessage("");
    } catch (e) {
      toast.error(errorMessage(e, t("report_mistake_error_generic")));
    }
  };

  return (
    <>
      {variant === "icon" ? (
        <Pressable
          onPress={openModal}
          accessibilityRole="button"
          accessibilityLabel={t("report_mistake_button")}
          hitSlop={8}
          className="h-10 w-10 items-center justify-center rounded-full active:opacity-70"
        >
          <MaterialIcons name="flag" size={22} color={palette.muted} />
        </Pressable>
      ) : (
        <Pressable
          onPress={openModal}
          accessibilityRole="button"
          accessibilityLabel={t("report_mistake_button")}
          className="mt-5 flex-row items-center justify-center gap-2 rounded-xl border px-3 py-2.5 active:opacity-80"
          style={{
            borderColor: palette.border,
            backgroundColor: palette.card,
          }}
        >
          <MaterialIcons name="outlined-flag" size={18} color={palette.muted} />
          <Text
            className="text-sm font-semibold"
            style={{ color: palette.foreground }}
          >
            {t("report_mistake_button")}
          </Text>
        </Pressable>
      )}

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View className="flex-1 justify-end bg-black/50">
            <Pressable className="flex-1" onPress={closeModal} />
            <View
              className="max-h-[90%] rounded-t-3xl border border-b-0"
              style={{
                backgroundColor: palette.card,
                borderColor: palette.border,
              }}
            >
              <View
                className="flex-row items-start gap-3 border-b px-5 pb-4 pt-5"
                style={{ borderBottomColor: palette.divider }}
              >
                <View
                  className="h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(245,158,11,0.18)"
                      : "#fffbeb",
                  }}
                >
                  <MaterialIcons
                    name="outlined-flag"
                    size={22}
                    color={isDark ? "#fbbf24" : "#d97706"}
                  />
                </View>
                <View className="min-w-0 flex-1">
                  <Text
                    className="text-lg font-bold"
                    style={{ color: palette.foreground }}
                  >
                    {t("report_mistake_modal_title")}
                  </Text>
                  <Text
                    className="mt-1 text-sm leading-relaxed"
                    style={{ color: palette.muted }}
                  >
                    {t("report_mistake_modal_intro", { n: questionOrder })}
                  </Text>
                </View>
                <Pressable
                  onPress={closeModal}
                  hitSlop={8}
                  className="h-9 w-9 items-center justify-center rounded-xl"
                  style={{ backgroundColor: palette.iconSurface }}
                >
                  <MaterialIcons name="close" size={20} color={palette.muted} />
                </Pressable>
              </View>

              <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ padding: 20, paddingBottom: 28 }}
              >
                <Text
                  className="mb-2 text-sm font-semibold"
                  style={{ color: palette.foreground }}
                >
                  {t("report_mistake_subject_label")}
                </Text>
                <TextInput
                  value={subject}
                  onChangeText={(v) => {
                    setSubject(v);
                    if (subjectError) setSubjectError(null);
                  }}
                  editable={!isPending}
                  maxLength={SUBJECT_MAX}
                  placeholder={t("report_mistake_placeholder_subject")}
                  placeholderTextColor={palette.muted}
                  className="rounded-xl border px-4 py-3 text-[15px]"
                  style={{
                    color: palette.foreground,
                    borderColor: subjectError
                      ? palette.dangerForeground
                      : palette.border,
                    backgroundColor: palette.iconSurface,
                  }}
                />
                {subjectError ? (
                  <Text
                    className="mt-1 text-xs"
                    style={{ color: palette.dangerForeground }}
                  >
                    {subjectError}
                  </Text>
                ) : null}

                <Text
                  className="mb-2 mt-4 text-sm font-semibold"
                  style={{ color: palette.foreground }}
                >
                  {t("report_mistake_message_label")}
                </Text>
                <TextInput
                  value={message}
                  onChangeText={(v) => {
                    setMessage(v);
                    if (messageError) setMessageError(null);
                  }}
                  editable={!isPending}
                  multiline
                  maxLength={MESSAGE_MAX}
                  placeholder={t("report_mistake_placeholder_message")}
                  placeholderTextColor={palette.muted}
                  className="min-h-[120px] rounded-xl border px-4 py-3 text-[15px] leading-relaxed"
                  style={{
                    color: palette.foreground,
                    textAlignVertical: "top",
                    borderColor: messageError
                      ? palette.dangerForeground
                      : palette.border,
                    backgroundColor: palette.iconSurface,
                  }}
                />
                <Text
                  className="mt-1 text-right text-xs"
                  style={{ color: palette.chevron }}
                >
                  {message.length}/{MESSAGE_MAX}
                </Text>
                {messageError ? (
                  <Text
                    className="mt-1 text-xs"
                    style={{ color: palette.dangerForeground }}
                  >
                    {messageError}
                  </Text>
                ) : null}

                <Text
                  className="mt-3 text-xs leading-relaxed"
                  style={{ color: palette.muted }}
                >
                  {t("report_mistake_hint")}
                </Text>

                <View className="mt-5 flex-row gap-3">
                  <Pressable
                    onPress={closeModal}
                    disabled={isPending}
                    className="flex-1 items-center justify-center rounded-xl border py-3"
                    style={{
                      borderColor: palette.border,
                      backgroundColor: palette.card,
                    }}
                  >
                    <Text
                      className="text-sm font-semibold"
                      style={{ color: palette.muted }}
                    >
                      {t("cancel")}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => void submit()}
                    disabled={isPending}
                    className="flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3"
                    style={{ backgroundColor: palette.primary }}
                  >
                    {isPending ? (
                      <ActivityIndicator color={palette.switchThumb} />
                    ) : (
                      <>
                        <Text
                          className="text-sm font-bold"
                          style={{ color: palette.switchThumb }}
                        >
                          {t("report_mistake_submit")}
                        </Text>
                        <MaterialIcons
                          name="send"
                          size={16}
                          color={palette.switchThumb}
                        />
                      </>
                    )}
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}
