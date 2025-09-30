import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Idea,
  NewIdea,
  IdeaFilters,
  IdeaOrderUpdate,
} from "@/types/money";

// Query keys
export const ideaKeys = {
  all: ["ideas"] as const,
  lists: () => [...ideaKeys.all, "list"] as const,
  list: (filters: IdeaFilters) => [...ideaKeys.lists(), filters] as const,
  details: () => [...ideaKeys.all, "detail"] as const,
  detail: (id: string) => [...ideaKeys.details(), id] as const,
  stats: () => [...ideaKeys.all, "stats"] as const,
};

// Hooks for fetching ideas
export function useIdeas(filters: IdeaFilters = {}) {
  return useQuery({
    queryKey: ideaKeys.list(filters),
    queryFn: async () => {
      const response = await fetch("/api/money/ideas?" + new URLSearchParams(filters as any));
      if (!response.ok) {
        throw new Error("Failed to fetch ideas");
      }
      const data = await response.json();
      return data.data as Idea[];
    },
  });
}

export function useIdea(id: string) {
  return useQuery({
    queryKey: ideaKeys.detail(id),
    queryFn: async () => {
      const response = await fetch(`/api/money/ideas/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch idea");
      }
      const data = await response.json();
      return data.data as Idea;
    },
    enabled: !!id,
  });
}

export function useIdeaStats() {
  return useQuery({
    queryKey: ideaKeys.stats(),
    queryFn: async () => {
      const response = await fetch("/api/money/ideas/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch idea stats");
      }
      const data = await response.json();
      return data.data;
    },
  });
}

// Hooks for mutating ideas
export function useCreateIdea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (idea: Omit<NewIdea, "userId">) => {
      const response = await fetch("/api/money/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(idea),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create idea");
      }
      const data = await response.json();
      return data.data as Idea;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ideaKeys.stats() });
    },
  });
}

export function useUpdateIdea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, idea }: { id: string; idea: Partial<NewIdea> }) => {
      const response = await fetch(`/api/money/ideas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(idea),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update idea");
      }
      const data = await response.json();
      return data.data as Idea;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ideaKeys.detail(data.id) });
    },
  });
}

export function useDeleteIdea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/money/ideas/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete idea");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ideaKeys.stats() });
    },
  });
}

export function useToggleIdeaVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/money/ideas/${id}/toggle-visibility`, {
        method: "PATCH",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to toggle visibility");
      }
      const data = await response.json();
      return data.data as Idea;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ideaKeys.detail(data.id) });
    },
  });
}

export function useToggleIdeaFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/money/ideas/${id}/toggle-featured`, {
        method: "PATCH",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to toggle featured");
      }
      const data = await response.json();
      return data.data as Idea;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ideaKeys.detail(data.id) });
    },
  });
}

export function useUpdateIdeaOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orders: IdeaOrderUpdate[]) => {
      const response = await fetch("/api/money/ideas/order", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update order");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
    },
  });
}
