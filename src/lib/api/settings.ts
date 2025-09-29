import { apiClient } from "../clients/apiClient";
import type {
  Setting,
  NewSetting,
  SocialMedia,
  NewSocialMedia,
  ContactInfo,
  NewContactInfo,
  SiteSettings,
  NewSiteSettings,
} from "@/types/settings";
import type { Biography } from "@/types/about/biography";
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

  // Structured Settings Methods
  // Note: Core Profile methods have been moved to biography API

  // Social Media
  async getSocialMedia(): Promise<ApiResponse<SocialMedia | null>> {
    return apiClient.get("/admin/settings/social");
  },

  async updateSocialMedia(
    socialSettings: Partial<NewSocialMedia>
  ): Promise<ApiResponse<SocialMedia>> {
    return apiClient.put("/admin/settings/social", socialSettings);
  },

  // Contact Info
  async getContactInfo(): Promise<ApiResponse<ContactInfo | null>> {
    return apiClient.get("/admin/settings/contact");
  },

  async updateContactInfo(
    contactSettings: Partial<NewContactInfo>
  ): Promise<ApiResponse<ContactInfo>> {
    return apiClient.put("/admin/settings/contact", contactSettings);
  },

  // Site Settings
  async getSiteSettings(): Promise<ApiResponse<SiteSettings | null>> {
    return apiClient.get("/admin/settings/site");
  },

  async updateSiteSettings(
    siteSettings: Partial<NewSiteSettings>
  ): Promise<ApiResponse<SiteSettings>> {
    return apiClient.put("/admin/settings/site", siteSettings);
  },

  // Public Settings
  async getPublicSettings(): Promise<
    ApiResponse<{
      biography: Biography | null;
      social: SocialMedia | null;
      contact: ContactInfo | null;
      site: SiteSettings | null;
    }>
  > {
    return apiClient.get("/settings/public");
  },
};
