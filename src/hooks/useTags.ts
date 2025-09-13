import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tagApi } from "@/lib/api";
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
      const response = await tagApi.searchTags(filters);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch tags");
      }
      return response.data;
    },
  });
}

export function useTag(id: string) {
  return useQuery({
    queryKey: tagKeys.detail(id),
    queryFn: async () => {
      const response = await tagApi.getTagById(id);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch tag");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

export function usePopularTags(limit: number = 10) {
  return useQuery({
    queryKey: tagKeys.popular(limit),
    queryFn: async () => {
      const response = await tagApi.getPopularTags(limit);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch popular tags");
      }
      return response.data;
    },
  });
}

// Hooks for tag mutations
export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tag: NewTag) => {
      const response = await tagApi.createTag(tag);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create tag");
      }
      return response.data;
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
      const response = await tagApi.updateTag(id, tag);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to update tag");
      }
      return response.data;
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
      const response = await tagApi.deleteTag(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete tag");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all });
    },
  });
}
