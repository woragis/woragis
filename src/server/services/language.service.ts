import { languageRepository } from "@/server/repositories";
import type {
  Language,
  NewLanguage,
  LanguageFilters,
  ApiResponse,
} from "@/types";
import { BaseService } from "./base.service";

export class LanguageService extends BaseService {
  async getAllLanguages(): Promise<ApiResponse<Language[]>> {
    try {
      const languages = await languageRepository.findAll();
      return this.success(languages);
    } catch (error) {
      return this.handleError(error, "getAllLanguages");
    }
  }

  async getVisibleLanguages(): Promise<ApiResponse<Language[]>> {
    try {
      const languages = await languageRepository.findVisible();
      return this.success(languages);
    } catch (error) {
      return this.handleError(error, "getVisibleLanguages");
    }
  }

  async getLanguageById(id: string): Promise<ApiResponse<Language | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid language ID",
        };
      }

      const language = await languageRepository.findById(id);
      return this.success(language);
    } catch (error) {
      return this.handleError(error, "getLanguageById");
    }
  }

  async getLanguageBySlug(slug: string): Promise<ApiResponse<Language | null>> {
    try {
      if (!slug || !slug.trim()) {
        return {
          success: false,
          error: "Invalid language slug",
        };
      }

      const language = await languageRepository.findBySlug(slug);
      return this.success(language);
    } catch (error) {
      return this.handleError(error, "getLanguageBySlug");
    }
  }

  async createLanguage(
    languageData: NewLanguage
  ): Promise<ApiResponse<Language>> {
    try {
      const requiredFields: (keyof NewLanguage)[] = ["name", "slug"];
      const validationErrors = this.validateRequired(
        languageData,
        requiredFields
      );

      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation failed: ${validationErrors.join(", ")}`,
        };
      }

      const language = await languageRepository.create(languageData);
      return this.success(language, "Language created successfully");
    } catch (error) {
      return this.handleError(error, "createLanguage");
    }
  }

  async updateLanguage(
    id: string,
    languageData: Partial<NewLanguage>
  ): Promise<ApiResponse<Language | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid language ID",
        };
      }

      const language = await languageRepository.update(id, languageData);
      if (!language) {
        return {
          success: false,
          error: "Language not found",
        };
      }

      return this.success(language, "Language updated successfully");
    } catch (error) {
      return this.handleError(error, "updateLanguage");
    }
  }

  async deleteLanguage(id: string): Promise<ApiResponse<void>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid language ID",
        };
      }

      await languageRepository.delete(id);
      return this.success(undefined, "Language deleted successfully");
    } catch (error) {
      return this.handleError(error, "deleteLanguage");
    }
  }

  async searchLanguages(
    filters: LanguageFilters
  ): Promise<ApiResponse<Language[]>> {
    try {
      const languages = await languageRepository.search(filters);
      return this.success(languages);
    } catch (error) {
      return this.handleError(error, "searchLanguages");
    }
  }

  async getLanguageWithProjectCount(
    id: string
  ): Promise<ApiResponse<{ language: Language; projectCount: number } | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid language ID",
        };
      }

      const result = await languageRepository.findWithProjectCount(id);
      return this.success(result);
    } catch (error) {
      return this.handleError(error, "getLanguageWithProjectCount");
    }
  }

  async getPopularLanguages(
    limit: number = 10
  ): Promise<ApiResponse<Array<{ language: Language; projectCount: number }>>> {
    try {
      const languages = await languageRepository.findPopular(limit);
      return this.success(languages);
    } catch (error) {
      return this.handleError(error, "getPopularLanguages");
    }
  }

  async getProficiencyDistribution(
    id: string
  ): Promise<ApiResponse<Array<{ proficiency: string; count: number }>>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid language ID",
        };
      }

      const distribution = await languageRepository.getProficiencyDistribution(
        id
      );
      return this.success(distribution);
    } catch (error) {
      return this.handleError(error, "getProficiencyDistribution");
    }
  }

  async updateLanguageOrder(
    languageOrders: { id: string; order: number }[]
  ): Promise<ApiResponse<void>> {
    try {
      if (!languageOrders || languageOrders.length === 0) {
        return {
          success: false,
          error: "No language orders provided",
        };
      }

      await languageRepository.updateOrder(languageOrders);
      return this.success(undefined, "Language order updated successfully");
    } catch (error) {
      return this.handleError(error, "updateLanguageOrder");
    }
  }
}
