import { experienceRepository } from "@/server/repositories";
import type { Experience, NewExperience, ApiResponse } from "@/types";
import { BaseService } from "./base.service";

export class ExperienceService extends BaseService {
  async getAllExperiences(userId?: string): Promise<ApiResponse<Experience[]>> {
    try {
      const experiences = await experienceRepository.findAllForAdmin();
      return this.success(experiences);
    } catch (error) {
      return this.handleError(error, "getAllExperiences");
    }
  }

  async getVisibleExperiences(
    userId?: string
  ): Promise<ApiResponse<Experience[]>> {
    try {
      const experiences = await experienceRepository.findAll();
      return this.success(experiences);
    } catch (error) {
      return this.handleError(error, "getVisibleExperiences");
    }
  }

  async getExperienceById(
    id: string,
    userId?: string
  ): Promise<ApiResponse<Experience | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid experience ID",
        };
      }

      const experience = await experienceRepository.findById(id);
      return this.success(experience);
    } catch (error) {
      return this.handleError(error, "getExperienceById");
    }
  }

  async createExperience(
    experienceData: NewExperience,
    userId: string
  ): Promise<ApiResponse<Experience>> {
    try {
      const requiredFields: (keyof NewExperience)[] = [
        "title",
        "company",
        "period",
        "location",
        "description",
      ];
      const validationErrors = this.validateRequired(
        experienceData,
        requiredFields
      );

      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation failed: ${validationErrors.join(", ")}`,
        };
      }

      // Set default order if not provided
      if (experienceData.order === undefined) {
        const allExperiences = await experienceRepository.findAllForAdmin();
        experienceData.order = allExperiences.length;
      }

      // Add userId to experience data
      const experienceWithUser = { ...experienceData, userId };
      const experience = await experienceRepository.create(experienceWithUser);
      return this.success(experience, "Experience created successfully");
    } catch (error) {
      return this.handleError(error, "createExperience");
    }
  }

  async updateExperience(
    id: string,
    experienceData: Partial<NewExperience>,
    userId?: string
  ): Promise<ApiResponse<Experience | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid experience ID",
        };
      }

      const experience = await experienceRepository.update(id, experienceData);
      if (!experience) {
        return {
          success: false,
          error: "Experience not found",
        };
      }

      return this.success(experience, "Experience updated successfully");
    } catch (error) {
      return this.handleError(error, "updateExperience");
    }
  }

  async deleteExperience(
    id: string,
    userId?: string
  ): Promise<ApiResponse<void>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid experience ID",
        };
      }

      await experienceRepository.delete(id);
      return this.success(undefined, "Experience deleted successfully");
    } catch (error) {
      return this.handleError(error, "deleteExperience");
    }
  }

  async updateExperienceOrder(
    id: string,
    order: number,
    userId?: string
  ): Promise<ApiResponse<Experience | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid experience ID",
        };
      }

      const experience = await experienceRepository.updateOrder(id, order);
      if (!experience) {
        return {
          success: false,
          error: "Experience not found",
        };
      }

      return this.success(experience, "Experience order updated successfully");
    } catch (error) {
      return this.handleError(error, "updateExperienceOrder");
    }
  }

  async toggleExperienceVisible(
    id: string,
    userId?: string
  ): Promise<ApiResponse<Experience | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid experience ID",
        };
      }

      const experience = await experienceRepository.toggleVisible(id);
      if (!experience) {
        return {
          success: false,
          error: "Experience not found",
        };
      }

      return this.success(
        experience,
        "Experience visibility toggled successfully"
      );
    } catch (error) {
      return this.handleError(error, "toggleExperienceVisible");
    }
  }
}
