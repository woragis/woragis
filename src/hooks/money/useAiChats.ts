import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  AiChat,
  NewAiChat,
  AiChatFilters,
  ChatMessage,
} from "@/types/money";

// Query keys
export const aiChatKeys = {
  all: ["ai-chats"] as const,
  lists: () => [...aiChatKeys.all, "list"] as const,
  list: (filters: AiChatFilters) => [...aiChatKeys.lists(), filters] as const,
  byNode: (ideaNodeId: string) => [...aiChatKeys.all, "byNode", ideaNodeId] as const,
  details: () => [...aiChatKeys.all, "detail"] as const,
  detail: (id: string) => [...aiChatKeys.details(), id] as const,
  stats: () => [...aiChatKeys.all, "stats"] as const,
  nodeStats: (ideaNodeId: string) => [...aiChatKeys.all, "nodeStats", ideaNodeId] as const,
};

// Hooks for fetching chats
export function useAiChats(filters: AiChatFilters = {}) {
  return useQuery({
    queryKey: aiChatKeys.list(filters),
    queryFn: async () => {
      const response = await fetch("/api/money/ai-chats?" + new URLSearchParams(filters as any));
      if (!response.ok) {
        throw new Error("Failed to fetch AI chats");
      }
      const data = await response.json();
      return data.data as AiChat[];
    },
  });
}

export function useAiChatsByNode(ideaNodeId: string) {
  return useQuery({
    queryKey: aiChatKeys.byNode(ideaNodeId),
    queryFn: async () => {
      const response = await fetch(`/api/money/ai-chats?ideaNodeId=${ideaNodeId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch AI chats");
      }
      const data = await response.json();
      return data.data as AiChat[];
    },
    enabled: !!ideaNodeId,
  });
}

export function useAiChat(id: string) {
  return useQuery({
    queryKey: aiChatKeys.detail(id),
    queryFn: async () => {
      const response = await fetch(`/api/money/ai-chats/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch AI chat");
      }
      const data = await response.json();
      return data.data as AiChat;
    },
    enabled: !!id,
  });
}

export function useAiChatStats() {
  return useQuery({
    queryKey: aiChatKeys.stats(),
    queryFn: async () => {
      const response = await fetch("/api/money/ai-chats/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch chat stats");
      }
      const data = await response.json();
      return data.data;
    },
  });
}

export function useAiChatNodeStats(ideaNodeId: string) {
  return useQuery({
    queryKey: aiChatKeys.nodeStats(ideaNodeId),
    queryFn: async () => {
      const response = await fetch(`/api/money/ai-chats/stats?ideaNodeId=${ideaNodeId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch chat stats");
      }
      const data = await response.json();
      return data.data;
    },
    enabled: !!ideaNodeId,
  });
}

// Hooks for mutating chats
export function useCreateAiChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chat: Omit<NewAiChat, "userId" | "messages">) => {
      const response = await fetch("/api/money/ai-chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chat),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create chat");
      }
      const data = await response.json();
      return data.data as AiChat;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: aiChatKeys.lists() });
      queryClient.invalidateQueries({ queryKey: aiChatKeys.byNode(data.ideaNodeId) });
      queryClient.invalidateQueries({ queryKey: aiChatKeys.stats() });
      queryClient.invalidateQueries({ queryKey: aiChatKeys.nodeStats(data.ideaNodeId) });
    },
  });
}

export function useUpdateAiChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, chat }: { id: string; chat: Partial<NewAiChat> }) => {
      const response = await fetch(`/api/money/ai-chats/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chat),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update chat");
      }
      const data = await response.json();
      return data.data as AiChat;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: aiChatKeys.lists() });
      queryClient.invalidateQueries({ queryKey: aiChatKeys.byNode(data.ideaNodeId) });
      queryClient.invalidateQueries({ queryKey: aiChatKeys.detail(data.id) });
    },
  });
}

export function useDeleteAiChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ideaNodeId }: { id: string; ideaNodeId: string }) => {
      const response = await fetch(`/api/money/ai-chats/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete chat");
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: aiChatKeys.lists() });
      queryClient.invalidateQueries({ queryKey: aiChatKeys.byNode(variables.ideaNodeId) });
      queryClient.invalidateQueries({ queryKey: aiChatKeys.stats() });
      queryClient.invalidateQueries({ queryKey: aiChatKeys.nodeStats(variables.ideaNodeId) });
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatId, message }: { chatId: string; message: string }) => {
      const response = await fetch(`/api/money/ai-chats/${chatId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to send message");
      }
      const data = await response.json();
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: aiChatKeys.detail(variables.chatId) });
    },
  });
}

export function useClearMessages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chatId: string) => {
      const response = await fetch(`/api/money/ai-chats/${chatId}/messages`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to clear messages");
      }
      const data = await response.json();
      return data.data as AiChat;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: aiChatKeys.detail(data.id) });
    },
  });
}

export function useToggleChatVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ideaNodeId }: { id: string; ideaNodeId: string }) => {
      const response = await fetch(`/api/money/ai-chats/${id}/toggle-visibility`, {
        method: "PATCH",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to toggle visibility");
      }
      const data = await response.json();
      return data.data as AiChat;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: aiChatKeys.lists() });
      queryClient.invalidateQueries({ queryKey: aiChatKeys.byNode(data.ideaNodeId) });
      queryClient.invalidateQueries({ queryKey: aiChatKeys.detail(data.id) });
    },
  });
}

export function useToggleChatArchived() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ideaNodeId }: { id: string; ideaNodeId: string }) => {
      const response = await fetch(`/api/money/ai-chats/${id}/toggle-archived`, {
        method: "PATCH",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to toggle archived");
      }
      const data = await response.json();
      return data.data as AiChat;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: aiChatKeys.lists() });
      queryClient.invalidateQueries({ queryKey: aiChatKeys.byNode(data.ideaNodeId) });
      queryClient.invalidateQueries({ queryKey: aiChatKeys.detail(data.id) });
    },
  });
}
