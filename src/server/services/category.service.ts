import { categoryRepository } from "@/server/repositories";
import type {
  Category,
  NewCategory,
  CategoryFilters,
  ApiResponse,
} from "@/types";
import { BaseService } from "./base.service";

export class CategoryService extends BaseService {
  async getAllCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const categories = await categoryRepository.findAll();
      return this.success(categories);
    } catch (error) {
      return this.handleError(error, "getAllCategories");
    }
  }

  async getVisibleCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const categories = await categoryRepository.findVisible();
      return this.success(categories);
    } catch (error) {
      return this.handleError(error, "getVisibleCategories");
    }
  }

  async getCategoryById(id: string): Promise<ApiResponse<Category | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid category ID",
        };
      }

      const category = await categoryRepository.findById(id);
      return this.success(category);
    } catch (error) {
      return this.handleError(error, "getCategoryById");
    }
  }

  async getCategoryBySlug(slug: string): Promise<ApiResponse<Category | null>> {
    try {
      if (!slug || !slug.trim()) {
        return {
          success: false,
          error: "Invalid category slug",
        };
      }

      const category = await categoryRepository.findBySlug(slug);
      return this.success(category);
    } catch (error) {
      return this.handleError(error, "getCategoryBySlug");
    }
  }

  async createCategory(
    categoryData: NewCategory
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

      const category = await categoryRepository.create(categoryData);
      return this.success(category, "Category created successfully");
    } catch (error) {
      return this.handleError(error, "createCategory");
    }
  }

  async updateCategory(
    id: string,
    categoryData: Partial<NewCategory>
  ): Promise<ApiResponse<Category | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid category ID",
        };
      }

      const category = await categoryRepository.update(id, categoryData);
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

  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid category ID",
        };
      }

      await categoryRepository.delete(id);
      return this.success(undefined, "Category deleted successfully");
    } catch (error) {
      return this.handleError(error, "deleteCategory");
    }
  }

  async searchCategories(
    filters: CategoryFilters
  ): Promise<ApiResponse<Category[]>> {
    try {
      const categories = await categoryRepository.search(filters);
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
