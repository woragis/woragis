import { frameworkRepository } from "@/server/repositories";
import type {
  Framework,
  NewFramework,
  FrameworkFilters,
  ApiResponse,
} from "@/types";
import { BaseService } from "./base.service";

export class FrameworkService extends BaseService {
  async getAllFrameworks(): Promise<ApiResponse<Framework[]>> {
    try {
      const frameworks = await frameworkRepository.findAll();
      return this.success(frameworks);
    } catch (error) {
      return this.handleError(error, "getAllFrameworks");
    }
  }

  async getVisibleFrameworks(): Promise<ApiResponse<Framework[]>> {
    try {
      const frameworks = await frameworkRepository.findVisible();
      return this.success(frameworks);
    } catch (error) {
      return this.handleError(error, "getVisibleFrameworks");
    }
  }

  async getFrameworkById(id: string): Promise<ApiResponse<Framework | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid framework ID",
        };
      }

      const framework = await frameworkRepository.findById(id);
      return this.success(framework);
    } catch (error) {
      return this.handleError(error, "getFrameworkById");
    }
  }

  async getFrameworkBySlug(
    slug: string
  ): Promise<ApiResponse<Framework | null>> {
    try {
      if (!slug || !slug.trim()) {
        return {
          success: false,
          error: "Invalid framework slug",
        };
      }

      const framework = await frameworkRepository.findBySlug(slug);
      return this.success(framework);
    } catch (error) {
      return this.handleError(error, "getFrameworkBySlug");
    }
  }

  async createFramework(
    frameworkData: NewFramework
  ): Promise<ApiResponse<Framework>> {
    try {
      const requiredFields: (keyof NewFramework)[] = ["name", "slug"];
      const validationErrors = this.validateRequired(
        frameworkData,
        requiredFields
      );

      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation failed: ${validationErrors.join(", ")}`,
        };
      }

      const framework = await frameworkRepository.create(frameworkData);
      return this.success(framework, "Framework created successfully");
    } catch (error) {
      return this.handleError(error, "createFramework");
    }
  }

  async updateFramework(
    id: string,
    frameworkData: Partial<NewFramework>
  ): Promise<ApiResponse<Framework | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid framework ID",
        };
      }

      const framework = await frameworkRepository.update(id, frameworkData);
      if (!framework) {
        return {
          success: false,
          error: "Framework not found",
        };
      }

      return this.success(framework, "Framework updated successfully");
    } catch (error) {
      return this.handleError(error, "updateFramework");
    }
  }

  async deleteFramework(id: string): Promise<ApiResponse<void>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid framework ID",
        };
      }

      await frameworkRepository.delete(id);
      return this.success(undefined, "Framework deleted successfully");
    } catch (error) {
      return this.handleError(error, "deleteFramework");
    }
  }

  async searchFrameworks(
    filters: FrameworkFilters
  ): Promise<ApiResponse<Framework[]>> {
    try {
      const frameworks = await frameworkRepository.search(filters);
      return this.success(frameworks);
    } catch (error) {
      return this.handleError(error, "searchFrameworks");
    }
  }

  async getFrameworkWithProjectCount(
    id: string
  ): Promise<
    ApiResponse<{ framework: Framework; projectCount: number } | null>
  > {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid framework ID",
        };
      }

      const result = await frameworkRepository.findWithProjectCount(id);
      return this.success(result);
    } catch (error) {
      return this.handleError(error, "getFrameworkWithProjectCount");
    }
  }

  async getPopularFrameworks(
    limit: number = 10
  ): Promise<
    ApiResponse<Array<{ framework: Framework; projectCount: number }>>
  > {
    try {
      const frameworks = await frameworkRepository.findPopular(limit);
      return this.success(frameworks);
    } catch (error) {
      return this.handleError(error, "getPopularFrameworks");
    }
  }

  async getVersionDistribution(
    id: string
  ): Promise<ApiResponse<Array<{ version: string; count: number }>>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid framework ID",
        };
      }

      const distribution = await frameworkRepository.getVersionDistribution(id);
      return this.success(distribution);
    } catch (error) {
      return this.handleError(error, "getVersionDistribution");
    }
  }

  async getProficiencyDistribution(
    id: string
  ): Promise<ApiResponse<Array<{ proficiency: string; count: number }>>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid framework ID",
        };
      }

      const distribution = await frameworkRepository.getProficiencyDistribution(
        id
      );
      return this.success(distribution);
    } catch (error) {
      return this.handleError(error, "getProficiencyDistribution");
    }
  }

  async updateFrameworkOrder(
    frameworkOrders: { id: string; order: number }[]
  ): Promise<ApiResponse<void>> {
    try {
      if (!frameworkOrders || frameworkOrders.length === 0) {
        return {
          success: false,
          error: "No framework orders provided",
        };
      }

      await frameworkRepository.updateOrder(frameworkOrders);
      return this.success(undefined, "Framework order updated successfully");
    } catch (error) {
      return this.handleError(error, "updateFrameworkOrder");
    }
  }
}
