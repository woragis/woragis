import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
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
      const params = new URLSearchParams();
      if (filters.visible !== undefined)
        params.append("visible", filters.visible.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.offset) params.append("offset", filters.offset.toString());

      const response = await api.get(`/admin/frameworks?${params.toString()}`);
      return response.data.data as Framework[];
    },
  });
}

export function useFramework(id: string) {
  return useQuery({
    queryKey: frameworkKeys.detail(id),
    queryFn: async () => {
      const response = await api.get(`/admin/frameworks/${id}`);
      return response.data.data as Framework;
    },
    enabled: !!id,
  });
}

export function usePopularFrameworks(limit: number = 10) {
  return useQuery({
    queryKey: frameworkKeys.popular(limit),
    queryFn: async () => {
      const response = await api.get(
        `/admin/frameworks/popular?limit=${limit}`
      );
      return response.data.data as Array<{
        framework: Framework;
        projectCount: number;
      }>;
    },
  });
}

// Hooks for framework mutations
export function useCreateFramework() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (framework: NewFramework) => {
      const response = await api.post("/admin/frameworks", framework);
      return response.data.data as Framework;
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
      const response = await api.put(`/admin/frameworks/${id}`, framework);
      return response.data.data as Framework;
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
      await api.delete(`/admin/frameworks/${id}`);
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
      await api.patch("/admin/frameworks/order", { frameworkOrders });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: frameworkKeys.all });
    },
  });
}
