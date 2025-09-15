import { apiClient } from "../client";
import type {
  AboutCore,
  NewAboutCore,
  AboutCoreFilters,
  AboutCoreWithProfession,
  AboutCoreResponse,
} from "@/types/about/core";
import type { ApiResponse } from "@/types";

// About Core API functions
export const aboutCoreApi = {
  async getAboutCore(): Promise<ApiResponse<AboutCoreResponse>> {
    return apiClient.get("/admin/about/core");
  },

  async getPublicAboutCore(): Promise<
    ApiResponse<AboutCoreWithProfession | null>
  > {
    return apiClient.get("/about/core");
  },

  async createAboutCore(
    aboutData: NewAboutCore
  ): Promise<ApiResponse<AboutCore>> {
    return apiClient.post("/admin/about/core", aboutData);
  },

  async updateAboutCore(
    aboutData: Partial<NewAboutCore>
  ): Promise<ApiResponse<AboutCore | null>> {
    return apiClient.put("/admin/about/core", aboutData);
  },

  async deleteAboutCore(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/admin/about/core/${id}`);
  },

  async toggleAboutCoreVisibility(id: string): Promise<ApiResponse<AboutCore>> {
    return apiClient.patch(`/admin/about/core/${id}/toggle-visibility`);
  },

  async searchAboutCore(
    filters: AboutCoreFilters
  ): Promise<ApiResponse<AboutCore[]>> {
    const params = new URLSearchParams();

    if (filters.visible !== undefined)
      params.append("visible", filters.visible.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.offset) params.append("offset", filters.offset.toString());

    return apiClient.get(`/admin/about/core?${params.toString()}`);
  },
};
