import { politicalViewRepository } from "@/server/repositories";
import type {
  PoliticalView,
  NewPoliticalView,
  PoliticalViewFilters,
  ApiResponse,
} from "@/types";
import { BaseService } from "../base.service";

export class PoliticalViewService extends BaseService {
  async getAllPoliticalViews(
    filters?: PoliticalViewFilters
  ): Promise<ApiResponse<PoliticalView[]>> {
    try {
      const politicalViews = filters
        ? await politicalViewRepository.search(filters)
        : await politicalViewRepository.findAll();
      return this.success(politicalViews);
    } catch (error) {
      return this.handleError(error, "getAllPoliticalViews");
    }
  }

  async getVisiblePoliticalViews(): Promise<ApiResponse<PoliticalView[]>> {
    try {
      const politicalViews = await politicalViewRepository.findVisible();
      return this.success(politicalViews);
    } catch (error) {
      return this.handleError(error, "getVisiblePoliticalViews");
    }
  }

  async getPoliticalViewById(
    id: string
  ): Promise<ApiResponse<PoliticalView | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid political view ID",
        };
      }

      const politicalView = await politicalViewRepository.findById(id);
      return this.success(politicalView);
    } catch (error) {
      return this.handleError(error, "getPoliticalViewById");
    }
  }

  async createPoliticalView(
    politicalViewData: NewPoliticalView
  ): Promise<ApiResponse<PoliticalView>> {
    try {
      const requiredFields: (keyof NewPoliticalView)[] = ["title"];
      const validationErrors = this.validateRequired(
        politicalViewData,
        requiredFields
      );

      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation failed: ${validationErrors.join(", ")}`,
        };
      }

      const politicalView = await politicalViewRepository.create(
        politicalViewData
      );
      return this.success(politicalView, "Political view created successfully");
    } catch (error) {
      return this.handleError(error, "createPoliticalView");
    }
  }

  async updatePoliticalView(
    id: string,
    politicalViewData: Partial<NewPoliticalView>
  ): Promise<ApiResponse<PoliticalView | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid political view ID",
        };
      }

      const politicalView = await politicalViewRepository.update(
        id,
        politicalViewData
      );
      if (!politicalView) {
        return {
          success: false,
          error: "Political view not found",
        };
      }

      return this.success(politicalView, "Political view updated successfully");
    } catch (error) {
      return this.handleError(error, "updatePoliticalView");
    }
  }

  async deletePoliticalView(id: string): Promise<ApiResponse<void>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid political view ID",
        };
      }

      await politicalViewRepository.delete(id);
      return this.success(undefined, "Political view deleted successfully");
    } catch (error) {
      return this.handleError(error, "deletePoliticalView");
    }
  }

  async searchPoliticalViews(
    filters: PoliticalViewFilters
  ): Promise<ApiResponse<PoliticalView[]>> {
    try {
      const politicalViews = await politicalViewRepository.search(filters);
      return this.success(politicalViews);
    } catch (error) {
      return this.handleError(error, "searchPoliticalViews");
    }
  }
}
