import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { frameworkApi } from "@/lib/api";
import type { Framework, NewFramework, FrameworkFilters } from "@/types";

// Query keys
export const frameworkKeys = {
  all: ["frameworks"] as const,
  lists: () => [...frameworkKeys.all, "list"] as const,
  list: (filters: FrameworkFilters) =>
    [...frameworkKeys.lists(), filters] as const,
  details: () => [...frameworkKeys.all, "detail"] as const,
  detail: (id: string) => [...frameworkKeys.details(), id] as const,
  popular: (limit: number) => [...frameworkKeys.all, "popular", limit] as const,
};

// Hooks for fetching frameworks
export function useFrameworks(filters: FrameworkFilters = {}) {
  return useQuery({
    queryKey: frameworkKeys.list(filters),
    queryFn: async () => {
      const response = await frameworkApi.searchFrameworks(filters);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch frameworks");
      }
      return response.data;
    },
  });
}

export function useFramework(id: string) {
  return useQuery({
    queryKey: frameworkKeys.detail(id),
    queryFn: async () => {
      const response = await frameworkApi.getFrameworkById(id);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch framework");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

export function usePopularFrameworks(limit: number = 10) {
  return useQuery({
    queryKey: frameworkKeys.popular(limit),
    queryFn: async () => {
      const response = await frameworkApi.getPopularFrameworks(limit);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch popular frameworks");
      }
      return response.data;
    },
  });
}

// Hooks for framework mutations
export function useCreateFramework() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (framework: NewFramework) => {
      const response = await frameworkApi.createFramework(framework);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create framework");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: frameworkKeys.all });
    },
  });
}

export function useUpdateFramework() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      framework,
    }: {
      id: string;
      framework: Partial<NewFramework>;
    }) => {
      const response = await frameworkApi.updateFramework(id, framework);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to update framework");
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: frameworkKeys.all });
      queryClient.setQueryData(frameworkKeys.detail(variables.id), data);
    },
  });
}

export function useDeleteFramework() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await frameworkApi.deleteFramework(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete framework");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: frameworkKeys.all });
    },
  });
}

export function useUpdateFrameworkOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (frameworkOrders: { id: string; order: number }[]) => {
      const response = await frameworkApi.updateFrameworkOrder(frameworkOrders);
      if (!response.success) {
        throw new Error(response.error || "Failed to update framework order");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: frameworkKeys.all });
    },
  });
}
