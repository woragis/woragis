import { apiClient } from "../client";
import type {
  Anime,
  NewAnime,
  AnimeFilters,
  AnimeStatus,
} from "@/types/about/anime";
import type { ApiResponse } from "@/types";

// Anime API functions
export const animeApi = {
  async getAllAnime(): Promise<ApiResponse<Anime[]>> {
    return apiClient.get("/admin/about/anime");
  },

  async getVisibleAnime(): Promise<ApiResponse<Anime[]>> {
    return apiClient.get("/about/anime");
  },

  async getAnimeById(id: string): Promise<ApiResponse<Anime | null>> {
    return apiClient.get(`/admin/about/anime/${id}`);
  },

  async createAnime(animeData: NewAnime): Promise<ApiResponse<Anime>> {
    return apiClient.post("/admin/about/anime", animeData);
  },

  async updateAnime(
    id: string,
    animeData: Partial<NewAnime>
  ): Promise<ApiResponse<Anime | null>> {
    return apiClient.put(`/admin/about/anime/${id}`, animeData);
  },

  async deleteAnime(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/admin/about/anime/${id}`);
  },

  async searchAnime(filters: AnimeFilters): Promise<ApiResponse<Anime[]>> {
    const params = new URLSearchParams();

    if (filters.visible !== undefined)
      params.append("visible", filters.visible.toString());
    if (filters.status) params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.offset) params.append("offset", filters.offset.toString());

    return apiClient.get(`/admin/about/anime?${params.toString()}`);
  },

  async updateAnimeStatus(
    id: string,
    status: AnimeStatus,
    currentEpisode?: number,
    completedAt?: Date
  ): Promise<ApiResponse<Anime | null>> {
    return apiClient.put(`/admin/about/anime/${id}/status`, {
      status,
      currentEpisode,
      completedAt,
    });
  },

  async toggleAnimeVisibility(id: string): Promise<ApiResponse<Anime | null>> {
    return apiClient.put(`/admin/about/anime/${id}/toggle-visibility`);
  },
};
