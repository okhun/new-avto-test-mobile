import { api } from "@/services/api";
import type {
  ContactInput,
  Conversation,
  ConversationListResponse,
  ReportFoundMistakeInput,
  SupportConversationInput,
} from "../types/conversation.types";

export const createContactConversation = async (
  payload: ContactInput
): Promise<Conversation> => {
  const { data } = await api.post<Conversation>("/conversations", payload);
  return data;
};

export const createReportFoundMistake = async (
  payload: ReportFoundMistakeInput
): Promise<Conversation> => {
  const { data } = await api.post<Conversation>("/conversations", payload);
  return data;
};

export const createSupportConversation = async (
  payload: SupportConversationInput
): Promise<Conversation> => {
  const { data } = await api.post<Conversation>("/conversations", payload);
  return data;
};

export const getMyConversations = async (params: {
  page?: number;
  limit?: number;
}): Promise<ConversationListResponse> => {
  const { data } = await api.get<ConversationListResponse>(
    "/conversations/me",
    { params }
  );
  return data;
};

export const getConversationById = async (
  id: string
): Promise<Conversation> => {
  const { data } = await api.get(`/conversations/${id}`);
  return data;
};

export const createConversationMessage = async (
  id: string,
  payload: {
    message: string;
  }
) => {
  const { data } = await api.post(`/conversations/${id}/messages`, payload);
  return data;
};
