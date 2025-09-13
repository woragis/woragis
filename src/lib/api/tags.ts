import { apiClient } from "./client";
import type { Tag, NewTag, TagFilters } from "@/types/tags";
import type { ApiResponse } from "@/types";

// Tag API functions
export const tagApi = {
  async getAllTags(): Promise<ApiResponse<Tag[]>> {
    return apiClient.get("/admin/tags");
  },

  async getVisibleTags(): Promise<ApiResponse<Tag[]>> {
    return apiClient.get("/tags");
  },

  async getTagById(id: string): Promise<ApiResponse<Tag | null>> {
    return apiClient.get(`/admin/tags/${id}`);
  },

  async getTagBySlug(slug: string): Promise<ApiResponse<Tag | null>> {
    return apiClient.get(`/tags/${slug}`);
  },

  async createTag(tagData: NewTag): Promise<ApiResponse<Tag>> {
    return apiClient.post("/admin/tags", tagData);
  },

  async updateTag(
    id: string,
    tagData: Partial<NewTag>
  ): Promise<ApiResponse<Tag | null>> {
    return apiClient.put(`/admin/tags/${id}`, tagData);
  },

  async deleteTag(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/admin/tags/${id}`);
  },

  async searchTags(filters: TagFilters): Promise<ApiResponse<Tag[]>> {
    const params = new URLSearchParams();

    if (filters.visible !== undefined)
      params.append("visible", filters.visible.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.offset) params.append("offset", filters.offset.toString());

    return apiClient.get(`/admin/tags?${params.toString()}`);
  },

  async getTagWithProjectCount(
    id: string
  ): Promise<ApiResponse<{ tag: Tag; projectCount: number } | null>> {
    return apiClient.get(`/admin/tags/${id}/project-count`);
  },

  async getPopularTags(
    limit?: number
  ): Promise<ApiResponse<Array<{ tag: Tag; projectCount: number }>>> {
    const params = limit ? `?limit=${limit}` : "";
    return apiClient.get(`/admin/tags/popular${params}`);
  },
};
