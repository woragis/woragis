import { youtuberRepository } from "@/server/repositories";
import type {
  Youtuber,
  NewYoutuber,
  YoutuberFilters,
  ApiResponse,
} from "@/types";
import { BaseService } from "../base.service";

export class YoutuberService extends BaseService {
  async getAllYoutubers(
    filters?: YoutuberFilters,
    userId?: string
  ): Promise<ApiResponse<Youtuber[]>> {
    try {
      const youtubers = filters
        ? await youtuberRepository.search(filters, userId)
        : await youtuberRepository.findAll(userId);
      return this.success(youtubers);
    } catch (error) {
      return this.handleError(error, "getAllYoutubers");
    }
  }

  async getVisibleYoutubers(): Promise<ApiResponse<Youtuber[]>> {
    try {
      const youtubers = await youtuberRepository.findVisible();
      return this.success(youtubers);
    } catch (error) {
      return this.handleError(error, "getVisibleYoutubers");
    }
  }

  async getYoutuberById(id: string): Promise<ApiResponse<Youtuber | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid youtuber ID",
        };
      }

      const youtuber = await youtuberRepository.findById(id);
      return this.success(youtuber);
    } catch (error) {
      return this.handleError(error, "getYoutuberById");
    }
  }

  async createYoutuber(
    youtuberData: NewYoutuber,
    userId: string
  ): Promise<ApiResponse<Youtuber>> {
    try {
      const requiredFields: (keyof NewYoutuber)[] = ["channelName"];
      const validationErrors = this.validateRequired(
        youtuberData,
        requiredFields
      );

      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation failed: ${validationErrors.join(", ")}`,
        };
      }

      const youtuberWithUserId = { ...youtuberData, userId };
      const youtuber = await youtuberRepository.create(youtuberWithUserId);
      return this.success(youtuber, "Youtuber created successfully");
    } catch (error) {
      return this.handleError(error, "createYoutuber");
    }
  }

  async updateYoutuber(
    id: string,
    youtuberData: Partial<NewYoutuber>
  ): Promise<ApiResponse<Youtuber | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid youtuber ID",
        };
      }

      const youtuber = await youtuberRepository.update(id, youtuberData);
      if (!youtuber) {
        return {
          success: false,
          error: "Youtuber not found",
        };
      }

      return this.success(youtuber, "Youtuber updated successfully");
    } catch (error) {
      return this.handleError(error, "updateYoutuber");
    }
  }

  async deleteYoutuber(id: string): Promise<ApiResponse<void>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid youtuber ID",
        };
      }

      await youtuberRepository.delete(id);
      return this.success(undefined, "Youtuber deleted successfully");
    } catch (error) {
      return this.handleError(error, "deleteYoutuber");
    }
  }

  async searchYoutubers(
    filters: YoutuberFilters
  ): Promise<ApiResponse<Youtuber[]>> {
    try {
      const youtubers = await youtuberRepository.search(filters);
      return this.success(youtubers);
    } catch (error) {
      return this.handleError(error, "searchYoutubers");
    }
  }
}
