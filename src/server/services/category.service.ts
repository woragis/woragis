import { categoryRepository } from "@/server/repositories";
import type {
  Category,
  NewCategory,
  CategoryFilters,
  ApiResponse,
} from "@/types";
import { BaseService } from "./base.service";

export class CategoryService extends BaseService {
  async getAllCategories(userId?: string): Promise<ApiResponse<Category[]>> {
    try {
      const categories = await categoryRepository.findAll(userId);
      return this.success(categories);
    } catch (error) {
      return this.handleError(error, "getAllCategories");
    }
  }

  async getVisibleCategories(
    userId?: string
  ): Promise<ApiResponse<Category[]>> {
    try {
      const categories = await categoryRepository.findVisible(userId);
      return this.success(categories);
    } catch (error) {
      return this.handleError(error, "getVisibleCategories");
    }
  }

  async getPublicCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const categories = await categoryRepository.findPublic();
      return this.success(categories);
    } catch (error) {
      return this.handleError(error, "getPublicCategories");
    }
  }

  async getCategoryById(
    id: string,
    userId?: string
  ): Promise<ApiResponse<Category | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid category ID",
        };
      }

      const category = await categoryRepository.findById(id, userId);
      return this.success(category);
    } catch (error) {
      return this.handleError(error, "getCategoryById");
    }
  }

  async getCategoryBySlug(
    slug: string,
    userId?: string
  ): Promise<ApiResponse<Category | null>> {
    try {
      if (!slug || !slug.trim()) {
        return {
          success: false,
          error: "Invalid category slug",
        };
      }

      const category = await categoryRepository.findBySlug(slug, userId);
      return this.success(category);
    } catch (error) {
      return this.handleError(error, "getCategoryBySlug");
    }
  }

  async getPublicCategoryBySlug(
    slug: string
  ): Promise<ApiResponse<Category | null>> {
    try {
      if (!slug || !slug.trim()) {
        return {
          success: false,
          error: "Invalid category slug",
        };
      }

      const category = await categoryRepository.findPublicBySlug(slug);
      return this.success(category);
    } catch (error) {
      return this.handleError(error, "getPublicCategoryBySlug");
    }
  }

  async createCategory(
    categoryData: NewCategory,
    userId: string
  ): Promise<ApiResponse<Category>> {
    try {
      const requiredFields: (keyof NewCategory)[] = ["name", "slug"];
      const validationErrors = this.validateRequired(
        categoryData,
        requiredFields
      );

      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation failed: ${validationErrors.join(", ")}`,
        };
      }

      // Add userId to category data
      const categoryWithUser = { ...categoryData, userId };
      const category = await categoryRepository.create(categoryWithUser);
      return this.success(category, "Category created successfully");
    } catch (error) {
      return this.handleError(error, "createCategory");
    }
  }

  async updateCategory(
    id: string,
    categoryData: Partial<NewCategory>,
    userId?: string
  ): Promise<ApiResponse<Category | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid category ID",
        };
      }

      const category = await categoryRepository.update(
        id,
        categoryData,
        userId
      );
      if (!category) {
        return {
          success: false,
          error: "Category not found",
        };
      }

      return this.success(category, "Category updated successfully");
    } catch (error) {
      return this.handleError(error, "updateCategory");
    }
  }

  async deleteCategory(
    id: string,
    userId?: string
  ): Promise<ApiResponse<void>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid category ID",
        };
      }

      await categoryRepository.delete(id, userId);
      return this.success(undefined, "Category deleted successfully");
    } catch (error) {
      return this.handleError(error, "deleteCategory");
    }
  }

  async searchCategories(
    filters: CategoryFilters,
    userId?: string
  ): Promise<ApiResponse<Category[]>> {
    try {
      const categories = await categoryRepository.search(filters, userId);
      return this.success(categories);
    } catch (error) {
      return this.handleError(error, "searchCategories");
    }
  }

  async getCategoryWithProjectCount(
    id: string
  ): Promise<ApiResponse<{ category: Category; projectCount: number } | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid category ID",
        };
      }

      const result = await categoryRepository.findWithProjectCount(id);
      return this.success(result);
    } catch (error) {
      return this.handleError(error, "getCategoryWithProjectCount");
    }
  }

  async getPopularCategories(
    limit: number = 10
  ): Promise<ApiResponse<Array<{ category: Category; projectCount: number }>>> {
    try {
      const categories = await categoryRepository.findPopular(limit);
      return this.success(categories);
    } catch (error) {
      return this.handleError(error, "getPopularCategories");
    }
  }

  async updateCategoryOrder(
    categoryOrders: { id: string; order: number }[]
  ): Promise<ApiResponse<void>> {
    try {
      if (!categoryOrders || categoryOrders.length === 0) {
        return {
          success: false,
          error: "No category orders provided",
        };
      }

      await categoryRepository.updateOrder(categoryOrders);
      return this.success(undefined, "Category order updated successfully");
    } catch (error) {
      return this.handleError(error, "updateCategoryOrder");
    }
  }
}
