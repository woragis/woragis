import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gameApi } from "@/lib/api";
import type { Game, NewGame, GameFilters, GameCategory } from "@/types";

// Query keys
export const gameKeys = {
  all: ["games"] as const,
  lists: () => [...gameKeys.all, "list"] as const,
  list: (filters: GameFilters) => [...gameKeys.lists(), filters] as const,
  details: () => [...gameKeys.all, "detail"] as const,
  detail: (id: string) => [...gameKeys.details(), id] as const,
  public: () => [...gameKeys.all, "public"] as const,
  byCategory: (category: GameCategory) =>
    [...gameKeys.all, "category", category] as const,
};

// Hooks for fetching games
export function useGames(filters: GameFilters = {}) {
  return useQuery({
    queryKey: gameKeys.list(filters),
    queryFn: async () => {
      const response = await gameApi.searchGames(filters);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch games");
      }
      return response.data;
    },
  });
}

export function usePublicGames() {
  return useQuery({
    queryKey: gameKeys.public(),
    queryFn: async () => {
      const response = await gameApi.getVisibleGames();
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch public games");
      }
      return response.data;
    },
  });
}

export function useGamesByCategory(category: GameCategory) {
  return useQuery({
    queryKey: gameKeys.byCategory(category),
    queryFn: async () => {
      const response = await gameApi.getGamesByCategory(category);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch games by category");
      }
      return response.data;
    },
  });
}

export function useGameById(id: string) {
  return useQuery({
    queryKey: gameKeys.detail(id),
    queryFn: async () => {
      const response = await gameApi.getGameById(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch game");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

// Hooks for game mutations
export function useCreateGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (game: NewGame) => {
      const response = await gameApi.createGame(game);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create game");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gameKeys.all });
    },
  });
}

export function useUpdateGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      game,
    }: {
      id: string;
      game: Partial<NewGame>;
    }) => {
      const response = await gameApi.updateGame(id, game);
      if (!response.success) {
        throw new Error(response.error || "Failed to update game");
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: gameKeys.all });
      queryClient.setQueryData(gameKeys.detail(variables.id), data);
    },
  });
}

export function useDeleteGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await gameApi.deleteGame(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete game");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gameKeys.all });
    },
  });
}

export function useUpdateGameStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      category,
      playtime,
      completedAt,
      startedAt,
    }: {
      id: string;
      category: GameCategory;
      playtime?: number;
      completedAt?: Date;
      startedAt?: Date;
    }) => {
      const response = await gameApi.updateGameStatus(
        id,
        category,
        playtime,
        completedAt,
        startedAt
      );
      if (!response.success) {
        throw new Error(response.error || "Failed to update game status");
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: gameKeys.all });
      queryClient.setQueryData(gameKeys.detail(variables.id), data);
    },
  });
}
