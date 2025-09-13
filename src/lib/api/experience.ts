import { apiClient } from "./client";
import type {
  Experience,
  NewExperience,
  UpdateExperience,
} from "@/types/experience";
import type { ApiResponse } from "@/types";

// Experience API functions
export const experienceApi = {
  async getAllExperience(): Promise<ApiResponse<Experience[]>> {
    return apiClient.get("/admin/experience");
  },

  async getExperienceById(id: string): Promise<ApiResponse<Experience | null>> {
    return apiClient.get(`/admin/experience/${id}`);
  },

  async createExperience(
    experienceData: NewExperience
  ): Promise<ApiResponse<Experience>> {
    return apiClient.post("/admin/experience", experienceData);
  },

  async updateExperience(
    id: string,
    experienceData: UpdateExperience
  ): Promise<ApiResponse<Experience | null>> {
    return apiClient.put(`/admin/experience/${id}`, experienceData);
  },

  async deleteExperience(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/admin/experience/${id}`);
  },

  async toggleExperienceVisibility(
    id: string
  ): Promise<ApiResponse<Experience | null>> {
    return apiClient.patch(`/admin/experience/${id}/toggle`);
  },

  async updateExperienceOrder(
    id: string,
    order: number
  ): Promise<ApiResponse<Experience | null>> {
    return apiClient.patch(`/admin/experience/${id}/order`, { order });
  },

  // Public experience API
  async getPublicExperience(): Promise<ApiResponse<Experience[]>> {
    return apiClient.get("/experience");
  },
};
