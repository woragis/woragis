import { MartialArtsRepository } from "../../repositories/about/martial-arts.repository";
import {
  type MartialArt,
  type NewMartialArt,
} from "../../db/schemas/about/martial-arts";
import { BaseService } from "../base.service";
import { ApiResponse } from "../../types";

const martialArtsRepository = new MartialArtsRepository();

export class MartialArtsService extends BaseService {
  private validateEnumValues(martialArtData: NewMartialArt): string[] {
    const errors: string[] = [];

    const validKnowledgeLevels = [
      "beginner",
      "intermediate",
      "advanced",
      "expert",
    ];
    const validLearningStatuses = [
      "want_to_learn",
      "learning",
      "learned",
      "not_interested",
    ];

    if (
      martialArtData.knowledgeLevel &&
      !validKnowledgeLevels.includes(martialArtData.knowledgeLevel)
    ) {
      errors.push(
        `Invalid knowledge level. Must be one of: ${validKnowledgeLevels.join(
          ", "
        )}`
      );
    }

    if (
      martialArtData.learningStatus &&
      !validLearningStatuses.includes(martialArtData.learningStatus)
    ) {
      errors.push(
        `Invalid learning status. Must be one of: ${validLearningStatuses.join(
          ", "
        )}`
      );
    }

    return errors;
  }

  async createMartialArt(
    martialArtData: NewMartialArt,
    userId: string
  ): Promise<ApiResponse<MartialArt>> {
    try {
      const requiredFields: (keyof NewMartialArt)[] = ["name"];
      const validationErrors = this.validateRequired(
        martialArtData,
        requiredFields
      );

      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation failed: ${validationErrors.join(", ")}`,
        };
      }

      const enumValidationErrors = this.validateEnumValues(martialArtData);
      if (enumValidationErrors.length > 0) {
        return {
          success: false,
          error: `Enum validation failed: ${enumValidationErrors.join(", ")}`,
        };
      }

      const martialArtWithUserId = { ...martialArtData, userId };
      const martialArt = await martialArtsRepository.create(
        martialArtWithUserId
      );
      return this.success(martialArt, "Martial art created successfully");
    } catch (error) {
      return this.handleError(error, "createMartialArt");
    }
  }

  async getMartialArtById(id: string): Promise<ApiResponse<MartialArt | null>> {
    try {
      const martialArt = await martialArtsRepository.findById(id);
      return this.success(martialArt);
    } catch (error) {
      return this.handleError(error, "getMartialArtById");
    }
  }

  async getMartialArtsByUserId(
    userId: string
  ): Promise<ApiResponse<MartialArt[]>> {
    try {
      const martialArts = await martialArtsRepository.findByUserId(userId);
      return this.success(martialArts);
    } catch (error) {
      return this.handleError(error, "getMartialArtsByUserId");
    }
  }

  async getVisibleMartialArtsByUserId(
    userId: string
  ): Promise<ApiResponse<MartialArt[]>> {
    try {
      const martialArts = await martialArtsRepository.findVisibleByUserId(
        userId
      );
      return this.success(martialArts);
    } catch (error) {
      return this.handleError(error, "getVisibleMartialArtsByUserId");
    }
  }

  async updateMartialArt(
    id: string,
    martialArtData: Partial<NewMartialArt>
  ): Promise<ApiResponse<MartialArt | null>> {
    try {
      const enumValidationErrors = this.validateEnumValues(
        martialArtData as NewMartialArt
      );
      if (enumValidationErrors.length > 0) {
        return {
          success: false,
          error: `Enum validation failed: ${enumValidationErrors.join(", ")}`,
        };
      }

      const martialArt = await martialArtsRepository.update(id, martialArtData);
      if (!martialArt) {
        return {
          success: false,
          error: "Martial art not found",
        };
      }
      return this.success(martialArt, "Martial art updated successfully");
    } catch (error) {
      return this.handleError(error, "updateMartialArt");
    }
  }

  async deleteMartialArt(id: string): Promise<ApiResponse<boolean>> {
    try {
      const deleted = await martialArtsRepository.delete(id);
      if (!deleted) {
        return {
          success: false,
          error: "Martial art not found",
        };
      }
      return this.success(true, "Martial art deleted successfully");
    } catch (error) {
      return this.handleError(error, "deleteMartialArt");
    }
  }

  async getAllMartialArts(): Promise<ApiResponse<MartialArt[]>> {
    try {
      const martialArts = await martialArtsRepository.findAll();
      return this.success(martialArts);
    } catch (error) {
      return this.handleError(error, "getAllMartialArts");
    }
  }

  async getVisibleMartialArts(): Promise<ApiResponse<MartialArt[]>> {
    try {
      const martialArts = await martialArtsRepository.findVisible();
      return this.success(martialArts);
    } catch (error) {
      return this.handleError(error, "getVisibleMartialArts");
    }
  }
}
