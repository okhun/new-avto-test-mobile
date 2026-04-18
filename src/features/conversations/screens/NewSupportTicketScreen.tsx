import { useCreateSupportConversation } from "@/src/features/conversations/hook/useConversation";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
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
import { CONV } from "../constants/theme";

const SUBJECT_MIN = 3;
const SUBJECT_MAX = 255;
const MSG_MIN = 10;
const MSG_MAX = 5000;

export default function NewSupportTicketScreen() {
  const router = useRouter();
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
      setError(
        `Mavzu ${SUBJECT_MIN}–${SUBJECT_MAX} belgi oralig'ida bo'lishi kerak.`
      );
      return;
    }
    if (!msgOk) {
      setError(`Xabar ${MSG_MIN}–${MSG_MAX} belgi oralig'ida bo'lishi kerak.`);
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
      setError("Yuborishda xatolik. Qayta urinib ko'ring.");
    }
  }, [createTicket, subject, message, subjectOk, msgOk, router]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: CONV.BG }} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-row items-center border-b border-slate-200 bg-white px-2 pb-3 pt-1">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full active:bg-slate-100"
            hitSlop={8}
          >
            <MaterialIcons name="close" size={24} color={CONV.TEXT} />
          </Pressable>
          <Text
            className="flex-1 text-center text-lg font-bold"
            style={{ color: CONV.TEXT }}
          >
            Yangi murojaat
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1 px-4 pt-4"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <Text className="mb-2 text-sm font-semibold text-slate-700">
            Mavzu
          </Text>
          <TextInput
            className="mb-1 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-[15px]"
            style={{ color: CONV.TEXT }}
            placeholder="Masalan: Imtihon natijasi ko'rinmayapti"
            placeholderTextColor="#94a3b8"
            value={subject}
            onChangeText={setSubject}
            maxLength={SUBJECT_MAX}
          />
          <Text className="mb-4 text-right text-xs text-slate-400">
            {subject.trim().length}/{SUBJECT_MAX} · kamida {SUBJECT_MIN}
          </Text>

          <Text className="mb-2 text-sm font-semibold text-slate-700">
            Xabar
          </Text>
          <TextInput
            className="min-h-[160px] rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-[15px] leading-relaxed"
            style={{ color: CONV.TEXT, textAlignVertical: "top" }}
            placeholder="Muammoingizni batafsil yozing — qachon, qaysi ekranda yuz berdi..."
            placeholderTextColor="#94a3b8"
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={MSG_MAX}
          />
          <Text className="mb-4 text-right text-xs text-slate-400">
            {message.trim().length}/{MSG_MAX} · kamida {MSG_MIN}
          </Text>

          {error ? (
            <View className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2">
              <Text className="text-sm text-red-700">{error}</Text>
            </View>
          ) : null}

          <Pressable
            onPress={submit}
            disabled={!canSubmit}
            className="flex-row items-center justify-center gap-2 rounded-2xl py-4"
            style={{
              backgroundColor: canSubmit ? CONV.PRIMARY : "#cbd5e1",
            }}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-base font-bold text-white">
                Murojaatni yuborish
              </Text>
            )}
          </Pressable>

          <Text className="mt-4 text-center text-xs leading-relaxed text-slate-400">
            Yuborilgan murojaatlar &quot;Murojaatlar&quot; bo&apos;limida
            saqlanadi. Javob tayyor bo&apos;lganda xabar beramiz.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
