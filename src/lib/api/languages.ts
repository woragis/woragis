import { apiClient } from "./client";
import type { Language, NewLanguage, LanguageFilters } from "@/types/languages";
import type { ApiResponse } from "@/types";

// Language API functions
export const languageApi = {
  async getAllLanguages(): Promise<ApiResponse<Language[]>> {
    return apiClient.get("/admin/languages");
  },

  async getVisibleLanguages(): Promise<ApiResponse<Language[]>> {
    return apiClient.get("/languages");
  },

  async getLanguageById(id: string): Promise<ApiResponse<Language | null>> {
    return apiClient.get(`/admin/languages/${id}`);
  },

  async getLanguageBySlug(slug: string): Promise<ApiResponse<Language | null>> {
    return apiClient.get(`/languages/${slug}`);
  },

  async createLanguage(
    languageData: NewLanguage
  ): Promise<ApiResponse<Language>> {
    return apiClient.post("/admin/languages", languageData);
  },

  async updateLanguage(
    id: string,
    languageData: Partial<NewLanguage>
  ): Promise<ApiResponse<Language | null>> {
    return apiClient.put(`/admin/languages/${id}`, languageData);
  },

  async deleteLanguage(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/admin/languages/${id}`);
  },

  async searchLanguages(
    filters: LanguageFilters
  ): Promise<ApiResponse<Language[]>> {
    const params = new URLSearchParams();

    if (filters.visible !== undefined)
      params.append("visible", filters.visible.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.offset) params.append("offset", filters.offset.toString());

    return apiClient.get(`/admin/languages?${params.toString()}`);
  },

  async getLanguageWithProjectCount(
    id: string
  ): Promise<ApiResponse<{ language: Language; projectCount: number } | null>> {
    return apiClient.get(`/admin/languages/${id}/project-count`);
  },

  async getPopularLanguages(
    limit?: number
  ): Promise<ApiResponse<Array<{ language: Language; projectCount: number }>>> {
    const params = limit ? `?limit=${limit}` : "";
    return apiClient.get(`/admin/languages/popular${params}`);
  },

  async getProficiencyDistribution(
    id: string
  ): Promise<ApiResponse<Array<{ proficiency: string; count: number }>>> {
    return apiClient.get(`/admin/languages/${id}/proficiency-distribution`);
  },

  async updateLanguageOrder(
    languageOrders: { id: string; order: number }[]
  ): Promise<ApiResponse<void>> {
    return apiClient.post("/admin/languages/order", { languageOrders });
  },
};
