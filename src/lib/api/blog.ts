import { apiClient } from "./client";
import type {
  BlogPost,
  NewBlogPost,
  BlogPostFilters,
  BlogPostOrderUpdate,
} from "@/types/blog";
import type { ApiResponse } from "@/types";

// Blog API functions
export const blogApi = {
  async getAllBlogPosts(
    filters: BlogPostFilters = {}
  ): Promise<ApiResponse<BlogPost[]>> {
    const params = new URLSearchParams();
    if (filters.published !== undefined)
      params.append("published", filters.published.toString());
    if (filters.featured !== undefined)
      params.append("featured", filters.featured.toString());
    if (filters.visible !== undefined)
      params.append("visible", filters.visible.toString());
    if (filters.public !== undefined)
      params.append("public", filters.public.toString());
    if (filters.category) params.append("category", filters.category);
    if (filters.tags && filters.tags.length > 0)
      params.append("tags", filters.tags.join(","));
    if (filters.search) params.append("search", filters.search);
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.offset) params.append("offset", filters.offset.toString());
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    return apiClient.get(`/admin/blog?${params.toString()}`);
  },

  async getBlogPostById(id: string): Promise<ApiResponse<BlogPost | null>> {
    return apiClient.get(`/admin/blog/${id}`);
  },

  async createBlogPost(
    blogPostData: NewBlogPost
  ): Promise<ApiResponse<BlogPost>> {
    return apiClient.post("/admin/blog", blogPostData);
  },

  async updateBlogPost(
    id: string,
    blogPostData: Partial<NewBlogPost>
  ): Promise<ApiResponse<BlogPost | null>> {
    return apiClient.put(`/admin/blog/${id}`, blogPostData);
  },

  async deleteBlogPost(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/admin/blog/${id}`);
  },

  async updateBlogPostOrder(
    blogPostOrders: BlogPostOrderUpdate[]
  ): Promise<ApiResponse<void>> {
    return apiClient.patch("/admin/blog/order", { blogPostOrders });
  },

  async toggleBlogPostVisibility(
    id: string
  ): Promise<ApiResponse<BlogPost | null>> {
    return apiClient.patch(`/admin/blog/${id}/toggle-visibility`);
  },

  async toggleBlogPostFeatured(
    id: string
  ): Promise<ApiResponse<BlogPost | null>> {
    return apiClient.patch(`/admin/blog/${id}/toggle-featured`);
  },

  async toggleBlogPostPublished(
    id: string
  ): Promise<ApiResponse<BlogPost | null>> {
    return apiClient.patch(`/admin/blog/${id}/toggle-published`);
  },

  async incrementBlogPostViewCount(id: string): Promise<ApiResponse<void>> {
    return apiClient.patch(`/admin/blog/${id}/increment-views`);
  },

  async incrementBlogPostLikeCount(id: string): Promise<ApiResponse<void>> {
    return apiClient.patch(`/admin/blog/${id}/increment-likes`);
  },

  async getBlogStats(): Promise<
    ApiResponse<{
      total: number;
      published: number;
      totalViews: number;
    }>
  > {
    return apiClient.get("/admin/blog/stats");
  },

  async getBlogCategories(): Promise<
    ApiResponse<{ name: string; count: number }[]>
  > {
    return apiClient.get("/admin/blog/categories");
  },

  async getBlogTags(): Promise<ApiResponse<{ name: string; count: number }[]>> {
    return apiClient.get("/admin/blog/tags");
  },

  // Public blog API
  async getPublicBlogPosts(
    filters: BlogPostFilters = {}
  ): Promise<ApiResponse<BlogPost[]>> {
    const params = new URLSearchParams();
    if (filters.category) params.append("category", filters.category);
    if (filters.tags && filters.tags.length > 0)
      params.append("tags", filters.tags.join(","));
    if (filters.search) params.append("search", filters.search);
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.offset) params.append("offset", filters.offset.toString());
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    return apiClient.get(`/blog?${params.toString()}`);
  },

  async getPublicBlogPostBySlug(
    slug: string
  ): Promise<ApiResponse<BlogPost | null>> {
    return apiClient.get(`/blog/${slug}`);
  },
};
