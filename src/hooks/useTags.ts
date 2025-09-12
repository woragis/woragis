import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Tag, NewTag, TagFilters } from "@/types";

// Query keys
export const tagKeys = {
  all: ["tags"] as const,
  lists: () => [...tagKeys.all, "list"] as const,
  list: (filters: TagFilters) => [...tagKeys.lists(), filters] as const,
  details: () => [...tagKeys.all, "detail"] as const,
  detail: (id: string) => [...tagKeys.details(), id] as const,
  popular: (limit: number) => [...tagKeys.all, "popular", limit] as const,
};

// Hooks for fetching tags
export function useTags(filters: TagFilters = {}) {
  return useQuery({
    queryKey: tagKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.visible !== undefined)
        params.append("visible", filters.visible.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.offset) params.append("offset", filters.offset.toString());

      const response = await api.get(`/admin/tags?${params.toString()}`);
      return response.data.data as Tag[];
    },
  });
}

export function useTag(id: string) {
  return useQuery({
    queryKey: tagKeys.detail(id),
    queryFn: async () => {
      const response = await api.get(`/admin/tags/${id}`);
      return response.data.data as Tag;
    },
    enabled: !!id,
  });
}

export function usePopularTags(limit: number = 10) {
  return useQuery({
    queryKey: tagKeys.popular(limit),
    queryFn: async () => {
      const response = await api.get(`/admin/tags/popular?limit=${limit}`);
      return response.data.data as Array<{ tag: Tag; projectCount: number }>;
    },
  });
}

// Hooks for tag mutations
export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tag: NewTag) => {
      const response = await api.post("/admin/tags", tag);
      return response.data.data as Tag;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, tag }: { id: string; tag: Partial<NewTag> }) => {
      const response = await api.put(`/admin/tags/${id}`, tag);
      return response.data.data as Tag;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
      queryClient.setQueryData(tagKeys.detail(variables.id), data);
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/tags/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
    },
  });
}
