import { apiClient } from "../client";
import type {
  MusicGenre,
  NewMusicGenre,
  MusicGenreFilters,
  LastListenedSong,
  NewLastListenedSong,
  LastListenedSongFilters,
} from "@/types/about/music";
import type { ApiResponse } from "@/types";

// Music Genre API functions
export const musicGenreApi = {
  async getAllGenres(): Promise<ApiResponse<MusicGenre[]>> {
    return apiClient.get("/admin/about/music/genres");
  },

  async getVisibleGenres(): Promise<ApiResponse<MusicGenre[]>> {
    return apiClient.get("/about/music/genres");
  },

  async getGenreById(id: string): Promise<ApiResponse<MusicGenre | null>> {
    return apiClient.get(`/admin/about/music/genres/${id}`);
  },

  async createGenre(
    genreData: NewMusicGenre
  ): Promise<ApiResponse<MusicGenre>> {
    return apiClient.post("/admin/about/music/genres", genreData);
  },

  async updateGenre(
    id: string,
    genreData: Partial<NewMusicGenre>
  ): Promise<ApiResponse<MusicGenre | null>> {
    return apiClient.put(`/admin/about/music/genres/${id}`, genreData);
  },

  async deleteGenre(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/admin/about/music/genres/${id}`);
  },

  async searchGenres(
    filters: MusicGenreFilters
  ): Promise<ApiResponse<MusicGenre[]>> {
    const params = new URLSearchParams();

    if (filters.visible !== undefined)
      params.append("visible", filters.visible.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.offset) params.append("offset", filters.offset.toString());

    return apiClient.get(`/admin/about/music/genres?${params.toString()}`);
  },

  async toggleGenreVisibility(
    id: string
  ): Promise<ApiResponse<MusicGenre | null>> {
    return apiClient.patch(`/admin/about/music/genres/${id}/toggle-visibility`);
  },
};

// Last Listened Song API functions
export const lastListenedSongApi = {
  async getAllSongs(): Promise<ApiResponse<LastListenedSong[]>> {
    return apiClient.get("/admin/about/music/songs");
  },

  async getVisibleSongs(): Promise<ApiResponse<LastListenedSong[]>> {
    return apiClient.get("/about/music/songs");
  },

  async getSongById(id: string): Promise<ApiResponse<LastListenedSong | null>> {
    return apiClient.get(`/admin/about/music/songs/${id}`);
  },

  async createSong(
    songData: NewLastListenedSong
  ): Promise<ApiResponse<LastListenedSong>> {
    return apiClient.post("/admin/about/music/songs", songData);
  },

  async updateSong(
    id: string,
    songData: Partial<NewLastListenedSong>
  ): Promise<ApiResponse<LastListenedSong | null>> {
    return apiClient.put(`/admin/about/music/songs/${id}`, songData);
  },

  async deleteSong(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/admin/about/music/songs/${id}`);
  },

  async searchSongs(
    filters: LastListenedSongFilters
  ): Promise<ApiResponse<LastListenedSong[]>> {
    const params = new URLSearchParams();

    if (filters.visible !== undefined)
      params.append("visible", filters.visible.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.offset) params.append("offset", filters.offset.toString());

    return apiClient.get(`/admin/about/music/songs?${params.toString()}`);
  },

  async toggleSongVisibility(
    id: string
  ): Promise<ApiResponse<LastListenedSong | null>> {
    return apiClient.patch(`/admin/about/music/songs/${id}/toggle-visibility`);
  },
};
