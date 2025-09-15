import { apiClient } from "../client";
import type {
  Game,
  NewGame,
  GameFilters,
  GameCategory,
} from "@/types/about/games";
import type { ApiResponse } from "@/types";

// Game API functions
export const gameApi = {
  async getAllGames(): Promise<ApiResponse<Game[]>> {
    return apiClient.get("/admin/about/games");
  },

  async getVisibleGames(): Promise<ApiResponse<Game[]>> {
    return apiClient.get("/about/games");
  },

  async getGameById(id: string): Promise<ApiResponse<Game | null>> {
    return apiClient.get(`/admin/about/games/${id}`);
  },

  async createGame(gameData: NewGame): Promise<ApiResponse<Game>> {
    return apiClient.post("/admin/about/games", gameData);
  },

  async updateGame(
    id: string,
    gameData: Partial<NewGame>
  ): Promise<ApiResponse<Game | null>> {
    return apiClient.put(`/admin/about/games/${id}`, gameData);
  },

  async deleteGame(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/admin/about/games/${id}`);
  },

  async searchGames(filters: GameFilters): Promise<ApiResponse<Game[]>> {
    const params = new URLSearchParams();

    if (filters.visible !== undefined)
      params.append("visible", filters.visible.toString());
    if (filters.category) params.append("category", filters.category);
    if (filters.search) params.append("search", filters.search);
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.offset) params.append("offset", filters.offset.toString());

    return apiClient.get(`/admin/about/games?${params.toString()}`);
  },

  async getGamesByCategory(
    category: GameCategory
  ): Promise<ApiResponse<Game[]>> {
    return apiClient.get(`/admin/about/games?category=${category}`);
  },

  async updateGameStatus(
    id: string,
    category: GameCategory,
    playtime?: number,
    completedAt?: Date,
    startedAt?: Date
  ): Promise<ApiResponse<Game | null>> {
    return apiClient.put(`/admin/about/games/${id}/status`, {
      category,
      playtime,
      completedAt,
      startedAt,
    });
  },

  async toggleGameVisibility(id: string): Promise<ApiResponse<Game | null>> {
    return apiClient.put(`/admin/about/games/${id}/toggle-visibility`);
  },
};
