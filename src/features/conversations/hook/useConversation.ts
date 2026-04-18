import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createContactConversation,
  createConversationMessage,
  createReportFoundMistake,
  createSupportConversation,
  getConversationById,
  getMyConversations,
} from "../api/conversation.api";
import { PAGE_SIZE } from "../constants/theme";
import type {
  ContactInput,
  ConversationListResponse,
  ReportFoundMistakeInput,
  SupportConversationInput,
} from "../types/conversation.types";

const conversationsInfiniteKey = ["conversations", "infinite"] as const;

function safeListResponse(
  res: ConversationListResponse | undefined | null,
  page: number
): ConversationListResponse {
  const data = Array.isArray(res?.data) ? res.data : [];
  const meta = res?.meta ?? {
    total: data.length,
    page,
    limit: PAGE_SIZE,
    totalPages: data.length > 0 ? 1 : 0,
  };
  return { data, meta };
}

export const useCreateContactConversation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ContactInput) => createContactConversation(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: conversationsInfiniteKey });
    },
  });
};

export const useCreateReportFoundMistake = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReportFoundMistakeInput) =>
      createReportFoundMistake(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: conversationsInfiniteKey });
    },
  });
};

export const useCreateSupportConversation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SupportConversationInput) =>
      createSupportConversation(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: conversationsInfiniteKey });
    },
  });
};

export const useGetMyConversations = (params: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["conversations", "page", params],
    queryFn: () => getMyConversations(params),
  });
};

export const useConversationsInfinite = () => {
  return useInfiniteQuery({
    queryKey: conversationsInfiniteKey,
    queryFn: async ({ pageParam }) => {
      const res = await getMyConversations({
        page: pageParam,
        limit: PAGE_SIZE,
      });
      return safeListResponse(res, pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((acc, p) => acc + p.data.length, 0);
      const total = lastPage.meta?.total;
      if (typeof total === "number" && total > 0 && loaded < total) {
        return allPages.length + 1;
      }
      const page = lastPage.meta?.page ?? 1;
      const totalPages = lastPage.meta?.totalPages ?? 0;
      if (totalPages > 0 && page < totalPages) return page + 1;
      return undefined;
    },
    retry: 1,
    staleTime: 30_000,
  });
};

export const useGetConversationById = (
  id: string | undefined,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["conversation", id],
    queryFn: () => getConversationById(id!),
    enabled: !!id && enabled,
    retry: 1,
    staleTime: 0,
  });
};

export const useCreateConversationMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      conversationId,
      message,
    }: {
      conversationId: string;
      message: string;
    }) => createConversationMessage(conversationId, { message }),
    onSuccess: (_data, { conversationId }) => {
      qc.invalidateQueries({ queryKey: ["conversation", conversationId] });
      qc.invalidateQueries({ queryKey: conversationsInfiniteKey });
    },
  });
};
