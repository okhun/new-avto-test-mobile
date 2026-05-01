import { ChatInputBar } from "@/src/features/conversations/components/ChatInputBar";
import { MessageBubble } from "@/src/features/conversations/components/MessageBubble";
import {
  useCreateConversationMessage,
  useGetConversationById,
} from "@/src/features/conversations/hook/useConversation";
import type { ConversationMessage } from "@/src/features/conversations/types/conversation.types";
import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function ConversationDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { palette, isDark } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversationId = id ?? "";

  const closedBannerBg = isDark ? "rgba(245, 158, 11, 0.15)" : "#fffbeb";
  const closedBannerBorder = isDark ? "rgba(251, 191, 36, 0.35)" : "#fde68a";
  const closedBannerText = isDark ? "#fde68a" : "#78350f";

  const {
    data: conversation,
    isLoading,
    isError,
    refetch,
  } = useGetConversationById(conversationId);

  const { mutateAsync: sendMessage, isPending: sending } =
    useCreateConversationMessage();

  const listRef = useRef<FlatList<ConversationMessage>>(null);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      if (conversationId) refetch();
    }, [conversationId, refetch])
  );

  const messages = useMemo(() => {
    const raw = conversation?.messages ?? [];
    return [...raw].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [conversation?.messages]);

  useEffect(() => {
    if (messages.length === 0) return;
    const tid = setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 80);
    return () => clearTimeout(tid);
  }, [messages]);

  const onSend = useCallback(
    async (text: string) => {
      if (!conversationId) return;
      try {
        await sendMessage({ conversationId, message: text });
      } catch {
        /* toast optional */
      }
    },
    [conversationId, sendMessage]
  );

  const closed = conversation?.status === "closed";

  const renderItem = useCallback(
    ({ item }: { item: ConversationMessage }) => (
      <MessageBubble message={item} />
    ),
    []
  );

  if (!conversationId) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: palette.background }}
      >
        <Text style={{ color: palette.muted }}>{t("invalid_link")}</Text>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: palette.background }}
        edges={["top"]}
      >
        <ActivityIndicator size="large" color={palette.primary} />
        <Text className="mt-3" style={{ color: palette.muted }}>
          {t("loading")}
        </Text>
      </SafeAreaView>
    );
  }

  if (isError || !conversation) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: palette.background }}
        edges={["top"]}
      >
        <MaterialIcons name="error-outline" size={48} color={palette.chevron} />
        <Text className="mt-3 text-center" style={{ color: palette.muted }}>
          {t("conversation_not_found")}
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-6 rounded-xl px-6 py-3"
          style={{ backgroundColor: palette.primary }}
        >
          <Text
            className="font-semibold"
            style={{ color: palette.switchThumb }}
          >
            {t("back")}
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: palette.background }}
      edges={["top"]}
    >
      <View
        className="border-b px-2 pb-3 pt-1"
        style={{
          borderBottomColor: palette.divider,
          backgroundColor: palette.card,
        }}
      >
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full"
            hitSlop={8}
            style={({ pressed }) =>
              pressed ? { backgroundColor: palette.surfacePressed } : undefined
            }
          >
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={palette.foreground}
            />
          </Pressable>
          <View className="min-w-0 flex-1">
            <Text
              className="text-base font-bold leading-tight"
              style={{ color: palette.foreground }}
              numberOfLines={2}
            >
              {conversation.subject}
            </Text>
            <Text className="text-xs" style={{ color: palette.muted }}>
              {closed ? t("closed") : t("active_request")}
            </Text>
          </View>
        </View>
      </View>

      {closed ? (
        <View
          className="px-4 py-2"
          style={{
            backgroundColor: closedBannerBg,
            borderBottomWidth: 1,
            borderBottomColor: closedBannerBorder,
          }}
        >
          <Text
            className="text-center text-xs font-medium"
            style={{ color: closedBannerText }}
          >
            {t("conversation_closed_message")}
          </Text>
        </View>
      ) : null}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 52 : 0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          style={{ backgroundColor: palette.background }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 8,
            flexGrow: 1,
          }}
          onContentSizeChange={() => {
            if (messages.length > 0) {
              listRef.current?.scrollToEnd({ animated: false });
            }
          }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-16">
              <Text style={{ color: palette.muted, textAlign: "center" }}>
                {t("no_messages_yet")}
              </Text>
            </View>
          }
        />

        <ChatInputBar onSend={onSend} disabled={closed} sending={sending} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
