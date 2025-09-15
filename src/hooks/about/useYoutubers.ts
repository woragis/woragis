import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { youtuberApi } from "@/lib/api";
import type {
  Youtuber,
  NewYoutuber,
  YoutuberFilters,
  YoutuberCategory,
} from "@/types";

// Query keys
export const youtuberKeys = {
  all: ["youtubers"] as const,
  lists: () => [...youtuberKeys.all, "list"] as const,
  list: (filters: YoutuberFilters) =>
    [...youtuberKeys.lists(), filters] as const,
  details: () => [...youtuberKeys.all, "detail"] as const,
  detail: (id: string) => [...youtuberKeys.details(), id] as const,
  public: () => [...youtuberKeys.all, "public"] as const,
  byCategory: (category: YoutuberCategory) =>
    [...youtuberKeys.all, "category", category] as const,
};

// Hooks for fetching youtubers
export function useYoutubers(filters: YoutuberFilters = {}) {
  return useQuery({
    queryKey: youtuberKeys.list(filters),
    queryFn: async () => {
      const response = await youtuberApi.searchYoutubers(filters);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch youtubers");
      }
      return response.data;
    },
  });
}

export function usePublicYoutubers() {
  return useQuery({
    queryKey: youtuberKeys.public(),
    queryFn: async () => {
      const response = await youtuberApi.getVisibleYoutubers();
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch public youtubers");
      }
      return response.data;
    },
  });
}

export function useYoutubersByCategory(category: YoutuberCategory) {
  return useQuery({
    queryKey: youtuberKeys.byCategory(category),
    queryFn: async () => {
      const response = await youtuberApi.getYoutubersByCategory(category);
      if (!response.success || !response.data) {
        throw new Error(
          response.error || "Failed to fetch youtubers by category"
        );
      }
      return response.data;
    },
  });
}

export function useYoutuberById(id: string) {
  return useQuery({
    queryKey: youtuberKeys.detail(id),
    queryFn: async () => {
      const response = await youtuberApi.getYoutuberById(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch youtuber");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

// Hooks for youtuber mutations
export function useCreateYoutuber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (youtuber: NewYoutuber) => {
      const response = await youtuberApi.createYoutuber(youtuber);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create youtuber");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: youtuberKeys.all });
    },
  });
}

export function useUpdateYoutuber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      youtuber,
    }: {
      id: string;
      youtuber: Partial<NewYoutuber>;
    }) => {
      const response = await youtuberApi.updateYoutuber(id, youtuber);
      if (!response.success) {
        throw new Error(response.error || "Failed to update youtuber");
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: youtuberKeys.all });
      queryClient.setQueryData(youtuberKeys.detail(variables.id), data);
    },
  });
}

export function useDeleteYoutuber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await youtuberApi.deleteYoutuber(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete youtuber");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: youtuberKeys.all });
    },
  });
}

export function useToggleYoutuberVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await youtuberApi.toggleYoutuberVisibility(id);
      if (!response.success) {
        throw new Error(
          response.error || "Failed to toggle youtuber visibility"
        );
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: youtuberKeys.all });
      if (data) {
        queryClient.setQueryData(youtuberKeys.detail(variables), data);
      }
    },
  });
}
