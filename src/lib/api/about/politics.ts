import { apiClient } from "../client";
import type {
  PoliticalView,
  NewPoliticalView,
  PoliticalViewFilters,
} from "@/types/about/politics";
import type { ApiResponse } from "@/types";

// Political View API functions
export const politicalViewApi = {
  async getAllPoliticalViews(): Promise<ApiResponse<PoliticalView[]>> {
    return apiClient.get("/admin/about/politics");
  },

  async getVisiblePoliticalViews(): Promise<ApiResponse<PoliticalView[]>> {
    return apiClient.get("/about/politics");
  },

  async getPoliticalViewById(
    id: string
  ): Promise<ApiResponse<PoliticalView | null>> {
    return apiClient.get(`/admin/about/politics/${id}`);
  },

  async createPoliticalView(
    politicalViewData: NewPoliticalView
  ): Promise<ApiResponse<PoliticalView>> {
    return apiClient.post("/admin/about/politics", politicalViewData);
  },

  async updatePoliticalView(
    id: string,
    politicalViewData: Partial<NewPoliticalView>
  ): Promise<ApiResponse<PoliticalView | null>> {
    return apiClient.put(`/admin/about/politics/${id}`, politicalViewData);
  },

  async deletePoliticalView(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/admin/about/politics/${id}`);
  },

  async searchPoliticalViews(
    filters: PoliticalViewFilters
  ): Promise<ApiResponse<PoliticalView[]>> {
    const params = new URLSearchParams();

    if (filters.visible !== undefined)
      params.append("visible", filters.visible.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.offset) params.append("offset", filters.offset.toString());

    return apiClient.get(`/admin/about/politics?${params.toString()}`);
  },
};
