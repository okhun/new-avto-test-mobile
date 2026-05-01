import { ConversationCard } from "@/src/features/conversations/components/ConversationCard";
import { ConversationListSkeleton } from "@/src/features/conversations/components/ConversationListSkeleton";
import { ConversationsEmptyState } from "@/src/features/conversations/components/ConversationsEmptyState";
import { useConversationsInfinite } from "@/src/features/conversations/hook/useConversation";
import type { Conversation } from "@/src/features/conversations/types/conversation.types";
import { useTheme } from "@/src/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function ListFooter({ loading }: { loading: boolean }) {
  const { palette } = useTheme();
  if (!loading) return null;
  return (
    <View className="py-6">
      <ActivityIndicator color={palette.primary} />
    </View>
  );
}

export default function ConversationListScreen() {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const router = useRouter();
  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useConversationsInfinite();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const items = useMemo(() => {
    if (!data?.pages?.length) return [];
    return data.pages.flatMap((p) => p.data);
  }, [data?.pages]);

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const openThread = useCallback(
    (c: Conversation) => {
      router.push(`/conversations/${c.id}`);
    },
    [router]
  );

  const goNew = useCallback(() => {
    router.push("/conversations/new");
  }, [router]);

  const renderItem = useCallback(
    ({ item }: { item: Conversation }) => (
      <View className="px-4">
        <ConversationCard
          conversation={item}
          onPress={() => openThread(item)}
        />
      </View>
    ),
    [openThread]
  );

  const headerChrome = (
    <View
      className="flex-row items-start justify-between px-4 pb-3 pt-2"
      style={{
        borderBottomWidth: 1,
        borderBottomColor: palette.divider,
        backgroundColor: palette.card,
      }}
    >
      <View className="min-w-0 flex-1 pr-2">
        <Text
          className="text-2xl font-bold tracking-tight"
          style={{ color: palette.foreground }}
        >
          {t("conversations")}
        </Text>
        <Text className="mt-1 text-sm" style={{ color: palette.muted }}>
          {t("conversations_description")}
        </Text>
      </View>
      <Pressable
        onPress={goNew}
        className="flex-row items-center gap-1.5 rounded-full px-4 py-2.5"
        style={{ backgroundColor: palette.primary }}
      >
        <MaterialIcons name="add" size={22} color={palette.switchThumb} />
        <Text
          className="text-sm font-bold"
          style={{ color: palette.switchThumb }}
        >
          {t("new")}
        </Text>
      </Pressable>
    </View>
  );

  if (isLoading && !data) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: palette.background }}
        edges={["top"]}
      >
        {headerChrome}
        <ConversationListSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: palette.background }}
      edges={["top"]}
    >
      {headerChrome}

      {isError ? (
        <View className="flex-1 items-center justify-center px-8">
          <MaterialIcons name="cloud-off" size={48} color={palette.chevron} />
          <Text className="mt-3 text-center" style={{ color: palette.muted }}>
            {t("error_loading_list")}
          </Text>
          <Pressable
            onPress={() => refetch()}
            className="mt-4 rounded-xl px-6 py-3"
            style={{ backgroundColor: palette.primary }}
          >
            <Text
              className="font-semibold"
              style={{ color: palette.switchThumb }}
            >
              {t("try_again_loading")}
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingTop: 12,
            paddingBottom: 100,
            flexGrow: 1,
          }}
          ListEmptyComponent={
            !isFetching ? (
              <ConversationsEmptyState onCreateTicket={goNew} />
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isFetchingNextPage}
              onRefresh={refetch}
              tintColor={palette.primary}
            />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.35}
          ListFooterComponent={
            <ListFooter loading={!!isFetchingNextPage && hasNextPage} />
          }
        />
      )}
    </SafeAreaView>
  );
}
