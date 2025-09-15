import { apiClient } from "../client";
import type {
  Youtuber,
  NewYoutuber,
  YoutuberFilters,
  YoutuberCategory,
} from "@/types/about/youtubers";
import type { ApiResponse } from "@/types";

// YouTuber API functions
export const youtuberApi = {
  async getAllYoutubers(): Promise<ApiResponse<Youtuber[]>> {
    return apiClient.get("/admin/about/youtubers");
  },

  async getVisibleYoutubers(): Promise<ApiResponse<Youtuber[]>> {
    return apiClient.get("/about/youtubers");
  },

  async getYoutuberById(id: string): Promise<ApiResponse<Youtuber | null>> {
    return apiClient.get(`/admin/about/youtubers/${id}`);
  },

  async createYoutuber(
    youtuberData: NewYoutuber
  ): Promise<ApiResponse<Youtuber>> {
    return apiClient.post("/admin/about/youtubers", youtuberData);
  },

  async updateYoutuber(
    id: string,
    youtuberData: Partial<NewYoutuber>
  ): Promise<ApiResponse<Youtuber | null>> {
    return apiClient.put(`/admin/about/youtubers/${id}`, youtuberData);
  },

  async deleteYoutuber(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/admin/about/youtubers/${id}`);
  },

  async searchYoutubers(
    filters: YoutuberFilters
  ): Promise<ApiResponse<Youtuber[]>> {
    const params = new URLSearchParams();

    if (filters.visible !== undefined)
      params.append("visible", filters.visible.toString());
    if (filters.category) params.append("category", filters.category);
    if (filters.search) params.append("search", filters.search);
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.offset) params.append("offset", filters.offset.toString());

    return apiClient.get(`/admin/about/youtubers?${params.toString()}`);
  },

  async getYoutubersByCategory(
    category: YoutuberCategory
  ): Promise<ApiResponse<Youtuber[]>> {
    return apiClient.get(`/admin/about/youtubers?category=${category}`);
  },
};
