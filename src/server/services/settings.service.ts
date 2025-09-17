import { settingsRepository } from "@/server/repositories";
import type {
  Setting,
  NewSetting,
  ApiResponse,
  SocialMedia,
  NewSocialMedia,
  ContactInfo,
  NewContactInfo,
  SiteSettings,
  NewSiteSettings,
} from "@/types";
import { BaseService } from "./base.service";

export class SettingsService extends BaseService {
  async getAllSettings(): Promise<ApiResponse<Setting[]>> {
    try {
      const settings = await settingsRepository.findAll();
      return this.success(settings);
    } catch (error) {
      return this.handleError(error, "getAllSettings");
    }
  }

  async getSettingByKey(key: string): Promise<ApiResponse<Setting | null>> {
    try {
      if (!key || !key.trim()) {
        return {
          success: false,
          error: "Invalid setting key",
        };
      }

      const setting = await settingsRepository.findByKey(key);
      return this.success(setting);
    } catch (error) {
      return this.handleError(error, "getSettingByKey");
    }
  }

  async createSetting(settingData: NewSetting): Promise<ApiResponse<Setting>> {
    try {
      const requiredFields: (keyof NewSetting)[] = ["key", "value"];
      const validationErrors = this.validateRequired(
        settingData,
        requiredFields
      );

      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation failed: ${validationErrors.join(", ")}`,
        };
      }

      const setting = await settingsRepository.create(settingData);
      return this.success(setting, "Setting created successfully");
    } catch (error) {
      return this.handleError(error, "createSetting");
    }
  }

  async updateSetting(
    key: string,
    value: string
  ): Promise<ApiResponse<Setting>> {
    try {
      if (!key || !key.trim()) {
        return {
          success: false,
          error: "Invalid setting key",
        };
      }

      const setting = await settingsRepository.update(key, value);
      return this.success(setting, "Setting updated successfully");
    } catch (error) {
      return this.handleError(error, "updateSetting");
    }
  }

  async deleteSetting(key: string): Promise<ApiResponse<void>> {
    try {
      if (!key || !key.trim()) {
        return {
          success: false,
          error: "Invalid setting key",
        };
      }

      await settingsRepository.delete(key);
      return this.success(undefined, "Setting deleted successfully");
    } catch (error) {
      return this.handleError(error, "deleteSetting");
    }
  }

  async updateManySettings(
    settingsData: Record<string, string>
  ): Promise<ApiResponse<Setting[]>> {
    try {
      if (!settingsData || Object.keys(settingsData).length === 0) {
        return {
          success: false,
          error: "No settings data provided",
        };
      }

      const settings = await settingsRepository.updateMany(settingsData);
      return this.success(settings, "Settings updated successfully");
    } catch (error) {
      return this.handleError(error, "updateManySettings");
    }
  }

  async getManySettings(
    keys: string[]
  ): Promise<ApiResponse<Record<string, string>>> {
    try {
      if (!keys || keys.length === 0) {
        return {
          success: false,
          error: "No setting keys provided",
        };
      }

      const settings = await settingsRepository.getMany(keys);
      return this.success(settings);
    } catch (error) {
      return this.handleError(error, "getManySettings");
    }
  }

  // Convenience methods for common settings
  async getProjectsPerPage(): Promise<ApiResponse<number>> {
    try {
      const count = await settingsRepository.getProjectsPerPage();
      return this.success(count);
    } catch (error) {
      return this.handleError(error, "getProjectsPerPage");
    }
  }

  async setProjectsPerPage(count: number): Promise<ApiResponse<Setting>> {
    try {
      if (count < 1 || count > 100) {
        return {
          success: false,
          error: "Projects per page must be between 1 and 100",
        };
      }

      const setting = await settingsRepository.setProjectsPerPage(count);
      return this.success(setting, "Projects per page updated successfully");
    } catch (error) {
      return this.handleError(error, "setProjectsPerPage");
    }
  }

  async getSiteTitle(): Promise<ApiResponse<string>> {
    try {
      const title = await settingsRepository.getSiteTitle();
      return this.success(title);
    } catch (error) {
      return this.handleError(error, "getSiteTitle");
    }
  }

  async setSiteTitle(title: string): Promise<ApiResponse<Setting>> {
    try {
      if (!title || !title.trim()) {
        return {
          success: false,
          error: "Site title cannot be empty",
        };
      }

      const setting = await settingsRepository.setSiteTitle(title);
      return this.success(setting, "Site title updated successfully");
    } catch (error) {
      return this.handleError(error, "setSiteTitle");
    }
  }

  async getSiteDescription(): Promise<ApiResponse<string>> {
    try {
      const description = await settingsRepository.getSiteDescription();
      return this.success(description);
    } catch (error) {
      return this.handleError(error, "getSiteDescription");
    }
  }

  async setSiteDescription(description: string): Promise<ApiResponse<Setting>> {
    try {
      const setting = await settingsRepository.setSiteDescription(description);
      return this.success(setting, "Site description updated successfully");
    } catch (error) {
      return this.handleError(error, "setSiteDescription");
    }
  }

  async getContactEmail(): Promise<ApiResponse<string>> {
    try {
      const email = await settingsRepository.getContactEmail();
      return this.success(email);
    } catch (error) {
      return this.handleError(error, "getContactEmail");
    }
  }

  async setContactEmail(email: string): Promise<ApiResponse<Setting>> {
    try {
      if (email && !this.isValidEmail(email)) {
        return {
          success: false,
          error: "Invalid email format",
        };
      }

      const setting = await settingsRepository.setContactEmail(email);
      return this.success(setting, "Contact email updated successfully");
    } catch (error) {
      return this.handleError(error, "setContactEmail");
    }
  }

  async getTheme(): Promise<ApiResponse<"light" | "dark" | "system">> {
    try {
      const theme = await settingsRepository.getTheme();
      return this.success(theme);
    } catch (error) {
      return this.handleError(error, "getTheme");
    }
  }

  async setTheme(
    theme: "light" | "dark" | "system"
  ): Promise<ApiResponse<Setting>> {
    try {
      if (!["light", "dark", "system"].includes(theme)) {
        return {
          success: false,
          error: "Theme must be 'light', 'dark', or 'system'",
        };
      }

      const setting = await settingsRepository.setTheme(theme);
      return this.success(setting, "Theme updated successfully");
    } catch (error) {
      return this.handleError(error, "setTheme");
    }
  }

  async getMaintenanceMode(): Promise<ApiResponse<boolean>> {
    try {
      const maintenanceMode = await settingsRepository.getMaintenanceMode();
      return this.success(maintenanceMode);
    } catch (error) {
      return this.handleError(error, "getMaintenanceMode");
    }
  }

  async setMaintenanceMode(enabled: boolean): Promise<ApiResponse<Setting>> {
    try {
      const setting = await settingsRepository.setMaintenanceMode(enabled);
      return this.success(setting, "Maintenance mode updated successfully");
    } catch (error) {
      return this.handleError(error, "setMaintenanceMode");
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Note: Core Profile methods have been moved to biography service

  // Social Media methods
  async getSocialMedia(
    userId: string
  ): Promise<ApiResponse<SocialMedia | null>> {
    try {
      const media = await settingsRepository.getSocialMedia(userId);
      return this.success(media);
    } catch (error) {
      return this.handleError(error, "getSocialMedia");
    }
  }

  async getFirstSocialMedia(): Promise<ApiResponse<SocialMedia | null>> {
    try {
      const media = await settingsRepository.getFirstSocialMedia();
      return this.success(media);
    } catch (error) {
      return this.handleError(error, "getFirstSocialMedia");
    }
  }

  async updateSocialMedia(
    userId: string,
    mediaData: Partial<NewSocialMedia>
  ): Promise<ApiResponse<SocialMedia>> {
    try {
      const media = await settingsRepository.upsertSocialMedia(
        userId,
        mediaData
      );
      return this.success(media, "Social media updated successfully");
    } catch (error) {
      return this.handleError(error, "updateSocialMedia");
    }
  }

  // Contact Info methods
  async getContactInfo(
    userId: string
  ): Promise<ApiResponse<ContactInfo | null>> {
    try {
      const info = await settingsRepository.getContactInfo(userId);
      return this.success(info);
    } catch (error) {
      return this.handleError(error, "getContactInfo");
    }
  }

  async getFirstContactInfo(): Promise<ApiResponse<ContactInfo | null>> {
    try {
      const info = await settingsRepository.getFirstContactInfo();
      return this.success(info);
    } catch (error) {
      return this.handleError(error, "getFirstContactInfo");
    }
  }

  async updateContactInfo(
    userId: string,
    infoData: Partial<NewContactInfo>
  ): Promise<ApiResponse<ContactInfo>> {
    try {
      const info = await settingsRepository.upsertContactInfo(userId, infoData);
      return this.success(info, "Contact info updated successfully");
    } catch (error) {
      return this.handleError(error, "updateContactInfo");
    }
  }

  // Site Settings methods
  async getSiteSettings(
    userId: string
  ): Promise<ApiResponse<SiteSettings | null>> {
    try {
      const settings = await settingsRepository.getSiteSettings(userId);
      return this.success(settings);
    } catch (error) {
      return this.handleError(error, "getSiteSettings");
    }
  }

  async getFirstSiteSettings(): Promise<ApiResponse<SiteSettings | null>> {
    try {
      const settings = await settingsRepository.getFirstSiteSettings();
      return this.success(settings);
    } catch (error) {
      return this.handleError(error, "getFirstSiteSettings");
    }
  }

  async updateSiteSettings(
    userId: string,
    settingsData: Partial<NewSiteSettings>
  ): Promise<ApiResponse<SiteSettings>> {
    try {
      const settings = await settingsRepository.upsertSiteSettings(
        userId,
        settingsData
      );
      return this.success(settings, "Site settings updated successfully");
    } catch (error) {
      return this.handleError(error, "updateSiteSettings");
    }
  }
}
