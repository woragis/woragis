import { BiographyRepository } from "../../repositories/about/biography.repository";
import {
  type Biography,
  type NewBiography,
} from "../../db/schemas/about/biography";
import { BaseService } from "../base.service";
import { ApiResponse } from "@/types";

const biographyRepository = new BiographyRepository();

export class BiographyService extends BaseService {
  async createBiography(
    biographyData: NewBiography
  ): Promise<ApiResponse<Biography>> {
    try {
      const requiredFields: (keyof NewBiography)[] = ["userId"];
      const validationErrors = this.validateRequired(
        biographyData,
        requiredFields
      );

      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation failed: ${validationErrors.join(", ")}`,
        };
      }

      const biography = await biographyRepository.create(biographyData);
      return this.success(biography, "Biography created successfully");
    } catch (error) {
      return this.handleError(error, "createBiography");
    }
  }

  async getBiographyById(id: string): Promise<ApiResponse<Biography | null>> {
    try {
      const biography = await biographyRepository.findById(id);
      return this.success(biography);
    } catch (error) {
      return this.handleError(error, "getBiographyById");
    }
  }

  async getBiographyByUserId(
    userId: string
  ): Promise<ApiResponse<Biography | null>> {
    try {
      const biography = await biographyRepository.findByUserId(userId);
      return this.success(biography);
    } catch (error) {
      return this.handleError(error, "getBiographyByUserId");
    }
  }

  async getFirstVisibleBiography(): Promise<ApiResponse<Biography | null>> {
    try {
      const biography = await biographyRepository.findFirstVisible();
      return this.success(biography);
    } catch (error) {
      return this.handleError(error, "getFirstVisibleBiography");
    }
  }

  async updateBiography(
    id: string,
    biographyData: Partial<NewBiography>
  ): Promise<ApiResponse<Biography | null>> {
    try {
      const biography = await biographyRepository.update(id, biographyData);
      if (!biography) {
        return {
          success: false,
          error: "Biography not found",
        };
      }
      return this.success(biography, "Biography updated successfully");
    } catch (error) {
      return this.handleError(error, "updateBiography");
    }
  }

  async updateBiographyByUserId(
    userId: string,
    biographyData: Partial<NewBiography>
  ): Promise<ApiResponse<Biography | null>> {
    try {
      // Sanitize the data to remove any problematic fields
      const { createdAt, updatedAt, id, ...sanitizedData } = biographyData;

      // Ensure only valid fields are passed
      const validFields: Partial<NewBiography> = {
        userId: sanitizedData.userId,
        featuredBiography: sanitizedData.featuredBiography,
        fullBiography: sanitizedData.fullBiography,
        visible: sanitizedData.visible,
      };

      // Check if biography exists, if not create it
      let biography = await biographyRepository.findByUserId(userId);

      if (!biography) {
        const createResult = await this.createBiography({
          ...validFields,
          userId,
        });
        if (!createResult.success) {
          return createResult;
        }
        biography = createResult.data!;
      } else {
        const updateResult = await biographyRepository.updateByUserId(
          userId,
          validFields
        );
        if (!updateResult) {
          return {
            success: false,
            error: "Failed to update biography",
          };
        }
        biography = updateResult;
      }

      return this.success(biography, "Biography updated successfully");
    } catch (error) {
      console.error("Error in updateBiographyByUserId:", error);
      return this.handleError(error, "updateBiographyByUserId");
    }
  }

  async deleteBiography(id: string): Promise<ApiResponse<boolean>> {
    try {
      const deleted = await biographyRepository.delete(id);
      if (!deleted) {
        return {
          success: false,
          error: "Biography not found",
        };
      }
      return this.success(true, "Biography deleted successfully");
    } catch (error) {
      return this.handleError(error, "deleteBiography");
    }
  }

  async deleteBiographyByUserId(userId: string): Promise<ApiResponse<boolean>> {
    try {
      const deleted = await biographyRepository.deleteByUserId(userId);
      if (!deleted) {
        return {
          success: false,
          error: "Biography not found",
        };
      }
      return this.success(true, "Biography deleted successfully");
    } catch (error) {
      return this.handleError(error, "deleteBiographyByUserId");
    }
  }

  async getAllBiographies(): Promise<ApiResponse<Biography[]>> {
    try {
      const biographies = await biographyRepository.findAll();
      return this.success(biographies);
    } catch (error) {
      return this.handleError(error, "getAllBiographies");
    }
  }

  async getVisibleBiographies(): Promise<ApiResponse<Biography[]>> {
    try {
      const biographies = await biographyRepository.findVisible();
      return this.success(biographies);
    } catch (error) {
      return this.handleError(error, "getVisibleBiographies");
    }
  }
}
