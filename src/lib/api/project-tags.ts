import { apiClient } from "../api-client";
import type { ApiResponse } from "@/types";
import type {
  ProjectTag,
  NewProjectTag,
  ProjectTagFilters,
  ProjectTagWithCount,
  ProjectTagOrderUpdate,
} from "@/types/project-tags";

export const projectTagApi = {
  async getAllProjectTags(
    filters?: ProjectTagFilters
  ): Promise<ApiResponse<ProjectTag[]>> {
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
      ? `/admin/project-tags?${queryString}`
      : "/admin/project-tags";

    return apiClient.get(url);
  },

  async getVisibleProjectTags(): Promise<ApiResponse<ProjectTag[]>> {
    return apiClient.get("/project-tags");
  },

  async getProjectTagById(id: string): Promise<ApiResponse<ProjectTag | null>> {
    return apiClient.get(`/admin/project-tags/${id}`);
  },

  async getProjectTagBySlug(
    slug: string
  ): Promise<ApiResponse<ProjectTag | null>> {
    return apiClient.get(`/project-tags/${slug}`);
  },

  async createProjectTag(
    projectTagData: NewProjectTag
  ): Promise<ApiResponse<ProjectTag>> {
    return apiClient.post("/admin/project-tags", projectTagData);
  },

  async updateProjectTag(
    id: string,
    projectTagData: Partial<NewProjectTag>
  ): Promise<ApiResponse<ProjectTag | null>> {
    return apiClient.put(`/admin/project-tags/${id}`, projectTagData);
  },

  async deleteProjectTag(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/admin/project-tags/${id}`);
  },

  async getProjectTagsWithCount(): Promise<ApiResponse<ProjectTagWithCount[]>> {
    return apiClient.get("/admin/project-tags/with-count");
  },

  async getPopularProjectTags(
    limit?: number
  ): Promise<ApiResponse<ProjectTagWithCount[]>> {
    const params = limit ? `?limit=${limit}` : "";
    return apiClient.get(`/admin/project-tags/popular${params}`);
  },

  async updateProjectTagOrder(
    tagOrders: ProjectTagOrderUpdate[]
  ): Promise<ApiResponse<void>> {
    return apiClient.post("/admin/project-tags/order", { tagOrders });
  },
};
