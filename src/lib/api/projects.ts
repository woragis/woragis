import { apiClient } from "../clients/apiClient";
import type {
  Project,
  NewProject,
  ProjectFilters,
  ProjectOrderUpdate,
  ProjectWithRelations,
} from "@/types/projects";
import type { ApiResponse } from "@/types";

// Project API functions
export const projectApi = {
  async getAllProjects(): Promise<ApiResponse<Project[]>> {
    return apiClient.get("/admin/projects");
  },

  async getVisibleProjects(): Promise<ApiResponse<Project[]>> {
    return apiClient.get("/projects");
  },

  async getFeaturedProjects(limit?: number): Promise<ApiResponse<Project[]>> {
    const params = limit ? `?limit=${limit}` : "";
    return apiClient.get(`/projects?featured=true${params}`);
  },

  async getProjectById(id: string): Promise<ApiResponse<Project | null>> {
    return apiClient.get(`/admin/projects/${id}`);
  },

  async getProjectWithRelations(
    id: string
  ): Promise<ApiResponse<ProjectWithRelations | null>> {
    return apiClient.get(`/admin/projects/${id}/relations`);
  },

  async createProject(projectData: NewProject): Promise<ApiResponse<Project>> {
    return apiClient.post("/admin/projects", projectData);
  },

  async updateProject(
    id: string,
    projectData: Partial<NewProject>
  ): Promise<ApiResponse<Project | null>> {
    return apiClient.put(`/admin/projects/${id}`, projectData);
  },

  async deleteProject(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/admin/projects/${id}`);
  },

  async searchProjects(
    filters: ProjectFilters
  ): Promise<ApiResponse<Project[]>> {
    const params = new URLSearchParams();

    if (filters.featured !== undefined)
      params.append("featured", filters.featured.toString());
    if (filters.visible !== undefined)
      params.append("visible", filters.visible.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.technologies?.length)
      params.append("technologies", filters.technologies.join(","));
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.offset) params.append("offset", filters.offset.toString());

    return apiClient.get(`/admin/projects?${params.toString()}`);
  },

  async updateProjectOrder(
    projectOrders: ProjectOrderUpdate[]
  ): Promise<ApiResponse<void>> {
    return apiClient.post("/admin/projects/order", { projectOrders });
  },

  async toggleProjectVisibility(
    id: string
  ): Promise<ApiResponse<Project | null>> {
    return apiClient.post(`/admin/projects/${id}/toggle-visibility`);
  },

  async toggleProjectFeatured(
    id: string
  ): Promise<ApiResponse<Project | null>> {
    return apiClient.post(`/admin/projects/${id}/toggle-featured`);
  },

  // Project relations

  async updateProjectCategories(
    projectId: string,
    categoryIds: string[]
  ): Promise<ApiResponse<void>> {
    return apiClient.post(`/admin/projects/${projectId}/categories`, {
      categoryIds,
    });
  },

  async updateProjectLanguages(
    projectId: string,
    languageAssignments: { languageId: string; proficiency?: string }[]
  ): Promise<ApiResponse<void>> {
    return apiClient.post(`/admin/projects/${projectId}/languages`, {
      languageAssignments,
    });
  },

  async updateProjectFrameworks(
    projectId: string,
    frameworkAssignments: {
      frameworkId: string;
      version?: string;
      proficiency?: string;
    }[]
  ): Promise<ApiResponse<void>> {
    return apiClient.post(`/admin/projects/${projectId}/frameworks`, {
      frameworkAssignments,
    });
  },
};
