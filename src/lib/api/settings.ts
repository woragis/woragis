import { apiClient } from "./client";
import type { Setting, NewSetting } from "@/types/settings";
import type { ApiResponse } from "@/types";

// Settings API functions
export const settingsApi = {
  async getAllSettings(): Promise<ApiResponse<Setting[]>> {
    return apiClient.get("/admin/settings");
  },

  async getSettingByKey(key: string): Promise<ApiResponse<Setting | null>> {
    return apiClient.get(`/admin/settings/${key}`);
  },

  async createSetting(settingData: NewSetting): Promise<ApiResponse<Setting>> {
    return apiClient.post("/admin/settings", settingData);
  },

  async updateSetting(
    key: string,
    value: string
  ): Promise<ApiResponse<Setting>> {
    return apiClient.post("/admin/settings", { key, value });
  },

  async deleteSetting(key: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/admin/settings/${key}`);
  },

  async updateManySettings(
    settingsData: Record<string, string>
  ): Promise<ApiResponse<Setting[]>> {
    return apiClient.post("/admin/settings/bulk", { settings: settingsData });
  },

  async getManySettings(
    keys: string[]
  ): Promise<ApiResponse<Record<string, string>>> {
    const params = new URLSearchParams();
    keys.forEach((key) => params.append("keys", key));
    return apiClient.get(`/admin/settings/many?${params.toString()}`);
  },

  // Convenience methods
  async getProjectsPerPage(): Promise<ApiResponse<number>> {
    return apiClient.get("/admin/settings/projects-per-page");
  },

  async setProjectsPerPage(count: number): Promise<ApiResponse<Setting>> {
    return apiClient.post("/admin/settings/projects-per-page", { count });
  },

  async getSiteTitle(): Promise<ApiResponse<string>> {
    return apiClient.get("/admin/settings/site-title");
  },

  async setSiteTitle(title: string): Promise<ApiResponse<Setting>> {
    return apiClient.post("/admin/settings/site-title", { title });
  },

  async getSiteDescription(): Promise<ApiResponse<string>> {
    return apiClient.get("/admin/settings/site-description");
  },

  async setSiteDescription(description: string): Promise<ApiResponse<Setting>> {
    return apiClient.post("/admin/settings/site-description", { description });
  },

  async getContactEmail(): Promise<ApiResponse<string>> {
    return apiClient.get("/admin/settings/contact-email");
  },

  async setContactEmail(email: string): Promise<ApiResponse<Setting>> {
    return apiClient.post("/admin/settings/contact-email", { email });
  },

  async getTheme(): Promise<ApiResponse<"light" | "dark" | "system">> {
    return apiClient.get("/admin/settings/theme");
  },

  async setTheme(
    theme: "light" | "dark" | "system"
  ): Promise<ApiResponse<Setting>> {
    return apiClient.post("/admin/settings/theme", { theme });
  },

  async getMaintenanceMode(): Promise<ApiResponse<boolean>> {
    return apiClient.get("/admin/settings/maintenance-mode");
  },

  async setMaintenanceMode(enabled: boolean): Promise<ApiResponse<Setting>> {
    return apiClient.post("/admin/settings/maintenance-mode", { enabled });
  },
};
