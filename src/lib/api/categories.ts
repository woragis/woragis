import { apiClient } from "./client";
import type {
  Category,
  NewCategory,
  CategoryFilters,
} from "@/types/categories";
import type { ApiResponse } from "@/types";

// Category API functions
export const categoryApi = {
  async getAllCategories(): Promise<ApiResponse<Category[]>> {
    return apiClient.get("/admin/categories");
  },

  async getVisibleCategories(): Promise<ApiResponse<Category[]>> {
    return apiClient.get("/categories");
  },

  async getCategoryById(id: string): Promise<ApiResponse<Category | null>> {
    return apiClient.get(`/admin/categories/${id}`);
  },

  async getCategoryBySlug(slug: string): Promise<ApiResponse<Category | null>> {
    return apiClient.get(`/categories/${slug}`);
  },

  async createCategory(
    categoryData: NewCategory
  ): Promise<ApiResponse<Category>> {
    return apiClient.post("/admin/categories", categoryData);
  },

  async updateCategory(
    id: string,
    categoryData: Partial<NewCategory>
  ): Promise<ApiResponse<Category | null>> {
    return apiClient.put(`/admin/categories/${id}`, categoryData);
  },

  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/admin/categories/${id}`);
  },

  async searchCategories(
    filters: CategoryFilters
  ): Promise<ApiResponse<Category[]>> {
    const params = new URLSearchParams();

    if (filters.visible !== undefined)
      params.append("visible", filters.visible.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.offset) params.append("offset", filters.offset.toString());

    return apiClient.get(`/admin/categories?${params.toString()}`);
  },

  async getCategoryWithProjectCount(
    id: string
  ): Promise<ApiResponse<{ category: Category; projectCount: number } | null>> {
    return apiClient.get(`/admin/categories/${id}/project-count`);
  },

  async getPopularCategories(
    limit?: number
  ): Promise<ApiResponse<Array<{ category: Category; projectCount: number }>>> {
    const params = limit ? `?limit=${limit}` : "";
    return apiClient.get(`/admin/categories/popular${params}`);
  },

  async updateCategoryOrder(
    categoryOrders: { id: string; order: number }[]
  ): Promise<ApiResponse<void>> {
    return apiClient.post("/admin/categories/order", { categoryOrders });
  },
};
