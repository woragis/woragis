import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { animeApi } from "@/lib/api";
import type { Anime, NewAnime, AnimeFilters, AnimeStatus } from "@/types";

// Query keys
export const animeKeys = {
  all: ["anime"] as const,
  lists: () => [...animeKeys.all, "list"] as const,
  list: (filters: AnimeFilters) => [...animeKeys.lists(), filters] as const,
  details: () => [...animeKeys.all, "detail"] as const,
  detail: (id: string) => [...animeKeys.details(), id] as const,
  public: () => [...animeKeys.all, "public"] as const,
};

// Hooks for fetching anime
export function useAnime(filters: AnimeFilters = {}) {
  return useQuery({
    queryKey: animeKeys.list(filters),
    queryFn: async () => {
      const response = await animeApi.searchAnime(filters);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch anime");
      }
      return response.data;
    },
  });
}

export function usePublicAnime() {
  return useQuery({
    queryKey: animeKeys.public(),
    queryFn: async () => {
      const response = await animeApi.getVisibleAnime();
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch public anime");
      }
      return response.data;
    },
  });
}

export function useAnimeById(id: string) {
  return useQuery({
    queryKey: animeKeys.detail(id),
    queryFn: async () => {
      const response = await animeApi.getAnimeById(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch anime");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

// Hooks for anime mutations
export function useCreateAnime() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (anime: NewAnime) => {
      const response = await animeApi.createAnime(anime);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create anime");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: animeKeys.all });
    },
  });
}

export function useUpdateAnime() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      anime,
    }: {
      id: string;
      anime: Partial<NewAnime>;
    }) => {
      const response = await animeApi.updateAnime(id, anime);
      if (!response.success) {
        throw new Error(response.error || "Failed to update anime");
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: animeKeys.all });
      queryClient.setQueryData(animeKeys.detail(variables.id), data);
    },
  });
}

export function useDeleteAnime() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await animeApi.deleteAnime(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete anime");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: animeKeys.all });
    },
  });
}

export function useUpdateAnimeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      currentEpisode,
      completedAt,
    }: {
      id: string;
      status: AnimeStatus;
      currentEpisode?: number;
      completedAt?: Date;
    }) => {
      const response = await animeApi.updateAnimeStatus(
        id,
        status,
        currentEpisode,
        completedAt
      );
      if (!response.success) {
        throw new Error(response.error || "Failed to update anime status");
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: animeKeys.all });
      queryClient.setQueryData(animeKeys.detail(variables.id), data);
    },
  });
}

export function useToggleAnimeVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await animeApi.toggleAnimeVisibility(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to toggle anime visibility");
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: animeKeys.all });
      if (data) {
        queryClient.setQueryData(animeKeys.detail(variables), data);
      }
    },
  });
}
