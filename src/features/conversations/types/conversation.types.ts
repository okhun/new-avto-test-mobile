export type ConversationType = "report" | "contact" | "support";
export type ConversationStatus = "open" | "closed" | "pending";
export type SenderType = "user" | "admin";

export interface ConversationMessage {
  id: string;
  conversationId: string;
  senderType: SenderType;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ConversationUser {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  role: string;
}

export interface Conversation {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: ConversationUser | null;
  guestName: string | null;
  guestEmail: string | null;
  type: ConversationType;
  status: ConversationStatus;
  subject: string;
  questionId: string | null;
  question?: any | null;
  assignedAdminId: string | null;
  assignedAdmin?: ConversationUser | null;
  messages: ConversationMessage[];
}

export interface ConversationListResponse {
  data: Conversation[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

export interface ReportFoundMistakeInput {
  questionId: string;
  message: string; // min 10 and max 5000 characters
  subject: string; // min 3 and max 255 characters
  type: "report";
}

export interface SupportConversationInput {
  message: string; // min 10 and max 5000 characters
  subject: string; // min 3 and max 255 characters
  type: "support";
}
