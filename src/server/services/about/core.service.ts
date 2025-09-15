import { aboutCoreRepository } from "@/server/repositories";
import type {
  AboutCore,
  NewAboutCore,
  AboutCoreFilters,
  ApiResponse,
} from "@/types";
import { BaseService } from "../base.service";

export class AboutCoreService extends BaseService {
  async getAboutCore(userId: string): Promise<ApiResponse<AboutCore | null>> {
    try {
      const about = await aboutCoreRepository.findByUserId(userId);
      return this.success(about);
    } catch (error) {
      return this.handleError(error, "getAboutCore");
    }
  }

  async getAboutCoreWithProfession(userId: string): Promise<
    ApiResponse<{
      about: AboutCore;
      currentProfession: any;
    } | null>
  > {
    try {
      const result = await aboutCoreRepository.findWithProfession(userId);
      return this.success(result);
    } catch (error) {
      return this.handleError(error, "getAboutCoreWithProfession");
    }
  }

  async getAboutCoreById(id: string): Promise<ApiResponse<AboutCore | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid about core ID",
        };
      }

      const about = await aboutCoreRepository.findById(id);
      return this.success(about);
    } catch (error) {
      return this.handleError(error, "getAboutCoreById");
    }
  }

  async createAboutCore(
    aboutData: NewAboutCore,
    userId: string
  ): Promise<ApiResponse<AboutCore>> {
    try {
      const requiredFields: (keyof NewAboutCore)[] = ["name"];
      const validationErrors = this.validateRequired(aboutData, requiredFields);

      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation failed: ${validationErrors.join(", ")}`,
        };
      }

      // Add userId to about data
      const aboutWithUser = { ...aboutData, userId };
      const about = await aboutCoreRepository.create(aboutWithUser);
      return this.success(about, "About core created successfully");
    } catch (error) {
      return this.handleError(error, "createAboutCore");
    }
  }

  async updateAboutCore(
    id: string,
    aboutData: Partial<NewAboutCore>
  ): Promise<ApiResponse<AboutCore | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid about core ID",
        };
      }

      const about = await aboutCoreRepository.update(id, aboutData);
      if (!about) {
        return {
          success: false,
          error: "About core not found",
        };
      }

      return this.success(about, "About core updated successfully");
    } catch (error) {
      return this.handleError(error, "updateAboutCore");
    }
  }

  async deleteAboutCore(id: string): Promise<ApiResponse<void>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid about core ID",
        };
      }

      await aboutCoreRepository.delete(id);
      return this.success(undefined, "About core deleted successfully");
    } catch (error) {
      return this.handleError(error, "deleteAboutCore");
    }
  }

  async searchAboutCore(
    filters: AboutCoreFilters
  ): Promise<ApiResponse<AboutCore[]>> {
    try {
      const about = await aboutCoreRepository.search(filters);
      return this.success(about);
    } catch (error) {
      return this.handleError(error, "searchAboutCore");
    }
  }
}
