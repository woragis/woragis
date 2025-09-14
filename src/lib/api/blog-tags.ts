import { apiClient } from "../api-client";
import type { ApiResponse } from "@/types";
import type {
  BlogTag,
  NewBlogTag,
  BlogTagFilters,
  BlogTagWithCount,
  BlogTagOrderUpdate,
} from "@/types/blog-tags";

export const blogTagApi = {
  async getAllBlogTags(
    filters?: BlogTagFilters
  ): Promise<ApiResponse<BlogTag[]>> {
    const params = new URLSearchParams();

    if (filters?.visible !== undefined) {
      params.append("visible", filters.visible.toString());
    }
    if (filters?.search) {
      params.append("search", filters.search);
    }
    if (filters?.limit) {
      params.append("limit", filters.limit.toString());
    }
    if (filters?.offset) {
      params.append("offset", filters.offset.toString());
    }

    const queryString = params.toString();
    const url = queryString
      ? `/admin/blog-tags?${queryString}`
      : "/admin/blog-tags";

    return apiClient.get(url);
  },

  async getVisibleBlogTags(): Promise<ApiResponse<BlogTag[]>> {
    return apiClient.get("/blog-tags");
  },

  async getBlogTagById(id: string): Promise<ApiResponse<BlogTag | null>> {
    return apiClient.get(`/admin/blog-tags/${id}`);
  },

  async getBlogTagBySlug(slug: string): Promise<ApiResponse<BlogTag | null>> {
    return apiClient.get(`/blog-tags/${slug}`);
  },

  async createBlogTag(blogTagData: NewBlogTag): Promise<ApiResponse<BlogTag>> {
    return apiClient.post("/admin/blog-tags", blogTagData);
  },

  async updateBlogTag(
    id: string,
    blogTagData: Partial<NewBlogTag>
  ): Promise<ApiResponse<BlogTag | null>> {
    return apiClient.put(`/admin/blog-tags/${id}`, blogTagData);
  },

  async deleteBlogTag(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/admin/blog-tags/${id}`);
  },

  async getBlogTagsWithCount(): Promise<ApiResponse<BlogTagWithCount[]>> {
    return apiClient.get("/admin/blog-tags/with-count");
  },

  async getPopularBlogTags(
    limit?: number
  ): Promise<ApiResponse<BlogTagWithCount[]>> {
    const params = limit ? `?limit=${limit}` : "";
    return apiClient.get(`/admin/blog-tags/popular${params}`);
  },

  async updateBlogTagOrder(
    tagOrders: BlogTagOrderUpdate[]
  ): Promise<ApiResponse<void>> {
    return apiClient.post("/admin/blog-tags/order", { tagOrders });
  },
};
