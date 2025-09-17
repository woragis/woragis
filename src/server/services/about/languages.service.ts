import { LanguagesRepository } from "../../repositories/about/languages.repository";
import {
  type Language,
  type NewLanguage,
} from "../../db/schemas/about/languages";
import { BaseService } from "../base.service";
import { ApiResponse } from "../../types";

const languagesRepository = new LanguagesRepository();

export class LanguagesService extends BaseService {
  async createLanguage(
    languageData: NewLanguage,
    userId: string
  ): Promise<ApiResponse<Language>> {
    try {
      const requiredFields: (keyof NewLanguage)[] = ["name"];
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

      const languageWithUserId = { ...languageData, userId };
      const language = await languagesRepository.create(languageWithUserId);
      return this.success(language, "Language created successfully");
    } catch (error) {
      return this.handleError(error, "createLanguage");
    }
  }

  async getLanguageById(id: string): Promise<ApiResponse<Language | null>> {
    try {
      const language = await languagesRepository.findById(id);
      return this.success(language);
    } catch (error) {
      return this.handleError(error, "getLanguageById");
    }
  }

  async getLanguagesByUserId(userId: string): Promise<ApiResponse<Language[]>> {
    try {
      const languages = await languagesRepository.findByUserId(userId);
      return this.success(languages);
    } catch (error) {
      return this.handleError(error, "getLanguagesByUserId");
    }
  }

  async getVisibleLanguagesByUserId(
    userId: string
  ): Promise<ApiResponse<Language[]>> {
    try {
      const languages = await languagesRepository.findVisibleByUserId(userId);
      return this.success(languages);
    } catch (error) {
      return this.handleError(error, "getVisibleLanguagesByUserId");
    }
  }

  async updateLanguage(
    id: string,
    languageData: Partial<NewLanguage>
  ): Promise<ApiResponse<Language | null>> {
    try {
      const language = await languagesRepository.update(id, languageData);
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

  async deleteLanguage(id: string): Promise<ApiResponse<boolean>> {
    try {
      const deleted = await languagesRepository.delete(id);
      if (!deleted) {
        return {
          success: false,
          error: "Language not found",
        };
      }
      return this.success(true, "Language deleted successfully");
    } catch (error) {
      return this.handleError(error, "deleteLanguage");
    }
  }

  async getAllLanguages(): Promise<ApiResponse<Language[]>> {
    try {
      const languages = await languagesRepository.findAll();
      return this.success(languages);
    } catch (error) {
      return this.handleError(error, "getAllLanguages");
    }
  }

  async getVisibleLanguages(): Promise<ApiResponse<Language[]>> {
    try {
      const languages = await languagesRepository.findVisible();
      return this.success(languages);
    } catch (error) {
      return this.handleError(error, "getVisibleLanguages");
    }
  }
}
