import { apiClient } from "./client";
import type {
  Framework,
  NewFramework,
  FrameworkFilters,
} from "@/types/frameworks";
import type { ApiResponse } from "@/types";

// Framework API functions
export const frameworkApi = {
  async getAllFrameworks(): Promise<ApiResponse<Framework[]>> {
    return apiClient.get("/admin/frameworks");
  },

  async getVisibleFrameworks(): Promise<ApiResponse<Framework[]>> {
    return apiClient.get("/frameworks");
  },

  async getFrameworkById(id: string): Promise<ApiResponse<Framework | null>> {
    return apiClient.get(`/admin/frameworks/${id}`);
  },

  async getFrameworkBySlug(
    slug: string
  ): Promise<ApiResponse<Framework | null>> {
    return apiClient.get(`/frameworks/${slug}`);
  },

  async createFramework(
    frameworkData: NewFramework
  ): Promise<ApiResponse<Framework>> {
    return apiClient.post("/admin/frameworks", frameworkData);
  },

  async updateFramework(
    id: string,
    frameworkData: Partial<NewFramework>
  ): Promise<ApiResponse<Framework | null>> {
    return apiClient.put(`/admin/frameworks/${id}`, frameworkData);
  },

  async deleteFramework(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/admin/frameworks/${id}`);
  },

  async searchFrameworks(
    filters: FrameworkFilters
  ): Promise<ApiResponse<Framework[]>> {
    const params = new URLSearchParams();

    if (filters.visible !== undefined)
      params.append("visible", filters.visible.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.offset) params.append("offset", filters.offset.toString());

    return apiClient.get(`/admin/frameworks?${params.toString()}`);
  },

  async getFrameworkWithProjectCount(
    id: string
  ): Promise<
    ApiResponse<{ framework: Framework; projectCount: number } | null>
  > {
    return apiClient.get(`/admin/frameworks/${id}/project-count`);
  },

  async getPopularFrameworks(
    limit?: number
  ): Promise<
    ApiResponse<Array<{ framework: Framework; projectCount: number }>>
  > {
    const params = limit ? `?limit=${limit}` : "";
    return apiClient.get(`/admin/frameworks/popular${params}`);
  },

  async getVersionDistribution(
    id: string
  ): Promise<ApiResponse<Array<{ version: string; count: number }>>> {
    return apiClient.get(`/admin/frameworks/${id}/version-distribution`);
  },

  async getProficiencyDistribution(
    id: string
  ): Promise<ApiResponse<Array<{ proficiency: string; count: number }>>> {
    return apiClient.get(`/admin/frameworks/${id}/proficiency-distribution`);
  },

  async updateFrameworkOrder(
    frameworkOrders: { id: string; order: number }[]
  ): Promise<ApiResponse<void>> {
    return apiClient.post("/admin/frameworks/order", { frameworkOrders });
  },
};
