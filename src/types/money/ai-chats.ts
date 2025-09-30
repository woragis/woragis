import type { aiChats } from "@/server/db/schemas/money";
import type { ChatMessage } from "@/server/db/schemas/money/ai-chats";

// Re-export ChatMessage
export type { ChatMessage };

// Base types from schema
export type AiChat = typeof aiChats.$inferSelect;
export type NewAiChat = typeof aiChats.$inferInsert;

// Extended types
export interface AiChatWithNode extends AiChat {
  ideaNodeTitle?: string;
}

export interface AiChatFilters {
  ideaNodeId?: string;
  agent?: string;
  archived?: boolean;
  visible?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: "createdAt" | "updatedAt" | "title";
  sortOrder?: "asc" | "desc";
}

// AI Agent types
export type AiAgent = 
  | "gpt-4" 
  | "gpt-4-turbo" 
  | "gpt-3.5-turbo" 
  | "claude-3-opus"
  | "claude-3-sonnet"
  | "claude-3-haiku"
  | "gemini-pro"
  | "custom";

export interface AiChatConfig {
  agent: AiAgent;
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

// Form types for admin
export interface AiChatFormData {
  title: string;
  ideaNodeId: string;
  agent: AiAgent;
  model?: string;
  systemPrompt?: string;
  temperature: number;
  maxTokens?: number;
  visible: boolean;
  archived: boolean;
}

// API response types
export interface AiChatListResponse {
  chats: AiChat[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface AiChatCreateRequest {
  chat: Omit<NewAiChat, "userId" | "messages">;
  initialMessage?: string;
}

export interface AiChatUpdateRequest {
  id: string;
  chat: Partial<NewAiChat>;
}

// Message sending
export interface SendMessageRequest {
  chatId: string;
  message: string;
}

export interface SendMessageResponse {
  message: ChatMessage;
  assistantMessage: ChatMessage;
}
