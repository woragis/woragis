import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  IdeaNode,
  NewIdeaNode,
  IdeaNodeFilters,
  IdeaNodePositionUpdate,
} from "@/types/money";

// Query keys
export const ideaNodeKeys = {
  all: ["idea-nodes"] as const,
  lists: () => [...ideaNodeKeys.all, "list"] as const,
  list: (filters: IdeaNodeFilters) => [...ideaNodeKeys.lists(), filters] as const,
  byIdea: (ideaId: string) => [...ideaNodeKeys.all, "byIdea", ideaId] as const,
  details: () => [...ideaNodeKeys.all, "detail"] as const,
  detail: (id: string) => [...ideaNodeKeys.details(), id] as const,
  stats: (ideaId: string) => [...ideaNodeKeys.all, "stats", ideaId] as const,
};

// Hooks for fetching nodes
export function useIdeaNodes(ideaId: string) {
  return useQuery({
    queryKey: ideaNodeKeys.byIdea(ideaId),
    queryFn: async () => {
      const response = await fetch(`/api/money/idea-nodes?ideaId=${ideaId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch idea nodes");
      }
      const data = await response.json();
      return data.data as IdeaNode[];
    },
    enabled: !!ideaId,
  });
}

export function useIdeaNode(id: string) {
  return useQuery({
    queryKey: ideaNodeKeys.detail(id),
    queryFn: async () => {
      const response = await fetch(`/api/money/idea-nodes/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch idea node");
      }
      const data = await response.json();
      return data.data as IdeaNode;
    },
    enabled: !!id,
  });
}

export function useIdeaNodeStats(ideaId: string) {
  return useQuery({
    queryKey: ideaNodeKeys.stats(ideaId),
    queryFn: async () => {
      const response = await fetch(`/api/money/idea-nodes/stats?ideaId=${ideaId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch node stats");
      }
      const data = await response.json();
      return data.data;
    },
    enabled: !!ideaId,
  });
}

// Hooks for mutating nodes
export function useCreateIdeaNode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (node: Omit<NewIdeaNode, "id">) => {
      const response = await fetch("/api/money/idea-nodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(node),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create node");
      }
      const data = await response.json();
      return data.data as IdeaNode;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ideaNodeKeys.byIdea(data.ideaId) });
      queryClient.invalidateQueries({ queryKey: ideaNodeKeys.stats(data.ideaId) });
    },
  });
}

export function useUpdateIdeaNode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, node }: { id: string; node: Partial<NewIdeaNode> }) => {
      const response = await fetch(`/api/money/idea-nodes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(node),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update node");
      }
      const data = await response.json();
      return data.data as IdeaNode;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ideaNodeKeys.byIdea(data.ideaId) });
      queryClient.invalidateQueries({ queryKey: ideaNodeKeys.detail(data.id) });
    },
  });
}

export function useDeleteIdeaNode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ideaId }: { id: string; ideaId: string }) => {
      const response = await fetch(`/api/money/idea-nodes/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete node");
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ideaNodeKeys.byIdea(variables.ideaId) });
      queryClient.invalidateQueries({ queryKey: ideaNodeKeys.stats(variables.ideaId) });
    },
  });
}

export function useUpdateNodePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ideaId, positionX, positionY }: IdeaNodePositionUpdate & { ideaId: string }) => {
      const response = await fetch(`/api/money/idea-nodes/${id}/position`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ positionX, positionY }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update position");
      }
      const data = await response.json();
      return data.data as IdeaNode;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ideaNodeKeys.byIdea(data.ideaId) });
      queryClient.invalidateQueries({ queryKey: ideaNodeKeys.detail(data.id) });
    },
  });
}

export function useUpdateNodePositions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ positions, ideaId }: { positions: IdeaNodePositionUpdate[]; ideaId: string }) => {
      const response = await fetch("/api/money/idea-nodes/positions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ positions }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update positions");
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ideaNodeKeys.byIdea(variables.ideaId) });
    },
  });
}

export function useUpdateNodeConnections() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ideaId, connections }: { id: string; ideaId: string; connections: string[] }) => {
      const response = await fetch(`/api/money/idea-nodes/${id}/connections`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connections }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update connections");
      }
      const data = await response.json();
      return data.data as IdeaNode;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ideaNodeKeys.byIdea(data.ideaId) });
      queryClient.invalidateQueries({ queryKey: ideaNodeKeys.detail(data.id) });
    },
  });
}

export function useToggleNodeVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ideaId }: { id: string; ideaId: string }) => {
      const response = await fetch(`/api/money/idea-nodes/${id}/toggle-visibility`, {
        method: "PATCH",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to toggle visibility");
      }
      const data = await response.json();
      return data.data as IdeaNode;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ideaNodeKeys.byIdea(data.ideaId) });
      queryClient.invalidateQueries({ queryKey: ideaNodeKeys.detail(data.id) });
    },
  });
}
