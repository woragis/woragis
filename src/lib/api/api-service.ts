import { apiClient } from "../clients/apiClient";
import type {
  Project,
  NewProject,
  ProjectFilters,
  ProjectOrderUpdate,
  ProjectWithRelations,
} from "@/types/projects";
import type { Language, NewLanguage, LanguageFilters } from "@/types";
import type {
  Framework,
  NewFramework,
  FrameworkFilters,
} from "@/types/frameworks";
import type { Setting, NewSetting } from "@/types/settings";
import type { ApiResponse } from "@/types";

// Project API
export class ProjectApiService {
  async getAllProjects(): Promise<ApiResponse<Project[]>> {
    return apiClient.get("/admin/projects");
  }

  async getVisibleProjects(): Promise<ApiResponse<Project[]>> {
    return apiClient.get("/projects");
  }

  async getFeaturedProjects(limit?: number): Promise<ApiResponse<Project[]>> {
    const params = limit ? `?limit=${limit}` : "";
    return apiClient.get(`/projects?featured=true${params}`);
  }

  async getProjectById(id: string): Promise<ApiResponse<Project | null>> {
    return apiClient.get(`/admin/projects/${id}`);
  }

  async getProjectWithRelations(
    id: string
  ): Promise<ApiResponse<ProjectWithRelations | null>> {
    return apiClient.get(`/admin/projects/${id}/relations`);
  }

  async createProject(projectData: NewProject): Promise<ApiResponse<Project>> {
    return apiClient.post("/admin/projects", projectData);
  }

  async updateProject(
    id: string,
    projectData: Partial<NewProject>
  ): Promise<ApiResponse<Project | null>> {
    return apiClient.put(`/admin/projects/${id}`, projectData);
  }

  async deleteProject(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/admin/projects/${id}`);
  }

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
  }

  async updateProjectOrder(
    projectOrders: ProjectOrderUpdate[]
  ): Promise<ApiResponse<void>> {
    return apiClient.post("/admin/projects/order", { projectOrders });
  }

  async toggleProjectVisibility(
    id: string
  ): Promise<ApiResponse<Project | null>> {
    return apiClient.post(`/admin/projects/${id}/toggle-visibility`);
  }

  async toggleProjectFeatured(
    id: string
  ): Promise<ApiResponse<Project | null>> {
    return apiClient.post(`/admin/projects/${id}/toggle-featured`);
  }

  // Project relations

  async updateProjectLanguages(
    projectId: string,
    languageAssignments: { languageId: string; proficiency?: string }[]
  ): Promise<ApiResponse<void>> {
    return apiClient.post(`/admin/projects/${projectId}/languages`, {
      languageAssignments,
    });
  }

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
  }
}

// Language API
export class LanguageApiService {
  async getAllLanguages(): Promise<ApiResponse<Language[]>> {
    return apiClient.get("/admin/languages");
  }

  async getVisibleLanguages(): Promise<ApiResponse<Language[]>> {
    return apiClient.get("/languages");
  }

  async getLanguageById(id: string): Promise<ApiResponse<Language | null>> {
    return apiClient.get(`/admin/languages/${id}`);
  }

  async getLanguageBySlug(slug: string): Promise<ApiResponse<Language | null>> {
    return apiClient.get(`/languages/${slug}`);
  }

  async createLanguage(
    languageData: NewLanguage
  ): Promise<ApiResponse<Language>> {
    return apiClient.post("/admin/languages", languageData);
  }

  async updateLanguage(
    id: string,
    languageData: Partial<NewLanguage>
  ): Promise<ApiResponse<Language | null>> {
    return apiClient.put(`/admin/languages/${id}`, languageData);
  }

  async deleteLanguage(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/admin/languages/${id}`);
  }

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
  }

  async getLanguageWithProjectCount(
    id: string
  ): Promise<ApiResponse<{ language: Language; projectCount: number } | null>> {
    return apiClient.get(`/admin/languages/${id}/project-count`);
  }

  async getPopularLanguages(
    limit?: number
  ): Promise<ApiResponse<Array<{ language: Language; projectCount: number }>>> {
    const params = limit ? `?limit=${limit}` : "";
    return apiClient.get(`/admin/languages/popular${params}`);
  }

  async getProficiencyDistribution(
    id: string
  ): Promise<ApiResponse<Array<{ proficiency: string; count: number }>>> {
    return apiClient.get(`/admin/languages/${id}/proficiency-distribution`);
  }

  async updateLanguageOrder(
    languageOrders: { id: string; order: number }[]
  ): Promise<ApiResponse<void>> {
    return apiClient.post("/admin/languages/order", { languageOrders });
  }
}

// Framework API
export class FrameworkApiService {
  async getAllFrameworks(): Promise<ApiResponse<Framework[]>> {
    return apiClient.get("/admin/frameworks");
  }

  async getVisibleFrameworks(): Promise<ApiResponse<Framework[]>> {
    return apiClient.get("/frameworks");
  }

  async getFrameworkById(id: string): Promise<ApiResponse<Framework | null>> {
    return apiClient.get(`/admin/frameworks/${id}`);
  }

  async getFrameworkBySlug(
    slug: string
  ): Promise<ApiResponse<Framework | null>> {
    return apiClient.get(`/frameworks/${slug}`);
  }

  async createFramework(
    frameworkData: NewFramework
  ): Promise<ApiResponse<Framework>> {
    return apiClient.post("/admin/frameworks", frameworkData);
  }

  async updateFramework(
    id: string,
    frameworkData: Partial<NewFramework>
  ): Promise<ApiResponse<Framework | null>> {
    return apiClient.put(`/admin/frameworks/${id}`, frameworkData);
  }

  async deleteFramework(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/admin/frameworks/${id}`);
  }

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
  }

  async getFrameworkWithProjectCount(
    id: string
  ): Promise<
    ApiResponse<{ framework: Framework; projectCount: number } | null>
  > {
    return apiClient.get(`/admin/frameworks/${id}/project-count`);
  }

  async getPopularFrameworks(
    limit?: number
  ): Promise<
    ApiResponse<Array<{ framework: Framework; projectCount: number }>>
  > {
    const params = limit ? `?limit=${limit}` : "";
    return apiClient.get(`/admin/frameworks/popular${params}`);
  }

  async getVersionDistribution(
    id: string
  ): Promise<ApiResponse<Array<{ version: string; count: number }>>> {
    return apiClient.get(`/admin/frameworks/${id}/version-distribution`);
  }

  async getProficiencyDistribution(
    id: string
  ): Promise<ApiResponse<Array<{ proficiency: string; count: number }>>> {
    return apiClient.get(`/admin/frameworks/${id}/proficiency-distribution`);
  }

  async updateFrameworkOrder(
    frameworkOrders: { id: string; order: number }[]
  ): Promise<ApiResponse<void>> {
    return apiClient.post("/admin/frameworks/order", { frameworkOrders });
  }
}

// Settings API
export class SettingsApiService {
  async getAllSettings(): Promise<ApiResponse<Setting[]>> {
    return apiClient.get("/admin/settings");
  }

  async getSettingByKey(key: string): Promise<ApiResponse<Setting | null>> {
    return apiClient.get(`/admin/settings/${key}`);
  }

  async createSetting(settingData: NewSetting): Promise<ApiResponse<Setting>> {
    return apiClient.post("/admin/settings", settingData);
  }

  async updateSetting(
    key: string,
    value: string
  ): Promise<ApiResponse<Setting>> {
    return apiClient.post("/admin/settings", { key, value });
  }

  async deleteSetting(key: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/admin/settings/${key}`);
  }

  async updateManySettings(
    settingsData: Record<string, string>
  ): Promise<ApiResponse<Setting[]>> {
    return apiClient.post("/admin/settings/bulk", { settings: settingsData });
  }

  async getManySettings(
    keys: string[]
  ): Promise<ApiResponse<Record<string, string>>> {
    const params = new URLSearchParams();
    keys.forEach((key) => params.append("keys", key));
    return apiClient.get(`/admin/settings/many?${params.toString()}`);
  }

  // Convenience methods
  async getProjectsPerPage(): Promise<ApiResponse<number>> {
    return apiClient.get("/admin/settings/projects-per-page");
  }

  async setProjectsPerPage(count: number): Promise<ApiResponse<Setting>> {
    return apiClient.post("/admin/settings/projects-per-page", { count });
  }

  async getSiteTitle(): Promise<ApiResponse<string>> {
    return apiClient.get("/admin/settings/site-title");
  }

  async setSiteTitle(title: string): Promise<ApiResponse<Setting>> {
    return apiClient.post("/admin/settings/site-title", { title });
  }

  // Public Settings
  async getPublicSettings(): Promise<ApiResponse<{
    biography: any;
    social: any;
    contact: any;
    site: any;
  }>> {
    return apiClient.get("/settings/public");
  }

  async getSiteDescription(): Promise<ApiResponse<string>> {
    return apiClient.get("/admin/settings/site-description");
  }

  async setSiteDescription(description: string): Promise<ApiResponse<Setting>> {
    return apiClient.post("/admin/settings/site-description", { description });
  }

  async getContactEmail(): Promise<ApiResponse<string>> {
    return apiClient.get("/admin/settings/contact-email");
  }

  async setContactEmail(email: string): Promise<ApiResponse<Setting>> {
    return apiClient.post("/admin/settings/contact-email", { email });
  }

  async getTheme(): Promise<ApiResponse<"light" | "dark" | "system">> {
    return apiClient.get("/admin/settings/theme");
  }

  async setTheme(
    theme: "light" | "dark" | "system"
  ): Promise<ApiResponse<Setting>> {
    return apiClient.post("/admin/settings/theme", { theme });
  }

  async getMaintenanceMode(): Promise<ApiResponse<boolean>> {
    return apiClient.get("/admin/settings/maintenance-mode");
  }

  async setMaintenanceMode(enabled: boolean): Promise<ApiResponse<Setting>> {
    return apiClient.post("/admin/settings/maintenance-mode", { enabled });
  }
}

// Export API service instances
export const projectApi = new ProjectApiService();
export const languageApi = new LanguageApiService();
export const frameworkApi = new FrameworkApiService();
export const settingsApi = new SettingsApiService();
