import { tagRepository } from "@/server/repositories";
import type { Tag, NewTag, TagFilters, ApiResponse } from "@/types";
import { BaseService } from "./base.service";

export class TagService extends BaseService {
  async getAllTags(): Promise<ApiResponse<Tag[]>> {
    try {
      const tags = await tagRepository.findAll();
      return this.success(tags);
    } catch (error) {
      return this.handleError(error, "getAllTags");
    }
  }

  async getVisibleTags(): Promise<ApiResponse<Tag[]>> {
    try {
      const tags = await tagRepository.findVisible();
      return this.success(tags);
    } catch (error) {
      return this.handleError(error, "getVisibleTags");
    }
  }

  async getTagById(id: string): Promise<ApiResponse<Tag | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid tag ID",
        };
      }

      const tag = await tagRepository.findById(id);
      return this.success(tag);
    } catch (error) {
      return this.handleError(error, "getTagById");
    }
  }

  async getTagBySlug(slug: string): Promise<ApiResponse<Tag | null>> {
    try {
      if (!slug || !slug.trim()) {
        return {
          success: false,
          error: "Invalid tag slug",
        };
      }

      const tag = await tagRepository.findBySlug(slug);
      return this.success(tag);
    } catch (error) {
      return this.handleError(error, "getTagBySlug");
    }
  }

  async createTag(tagData: NewTag): Promise<ApiResponse<Tag>> {
    try {
      const requiredFields: (keyof NewTag)[] = ["name", "slug"];
      const validationErrors = this.validateRequired(tagData, requiredFields);

      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation failed: ${validationErrors.join(", ")}`,
        };
      }

      const tag = await tagRepository.create(tagData);
      return this.success(tag, "Tag created successfully");
    } catch (error) {
      return this.handleError(error, "createTag");
    }
  }

  async updateTag(
    id: string,
    tagData: Partial<NewTag>
  ): Promise<ApiResponse<Tag | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid tag ID",
        };
      }

      const tag = await tagRepository.update(id, tagData);
      if (!tag) {
        return {
          success: false,
          error: "Tag not found",
        };
      }

      return this.success(tag, "Tag updated successfully");
    } catch (error) {
      return this.handleError(error, "updateTag");
    }
  }

  async deleteTag(id: string): Promise<ApiResponse<void>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid tag ID",
        };
      }

      await tagRepository.delete(id);
      return this.success(undefined, "Tag deleted successfully");
    } catch (error) {
      return this.handleError(error, "deleteTag");
    }
  }

  async searchTags(filters: TagFilters): Promise<ApiResponse<Tag[]>> {
    try {
      const tags = await tagRepository.search(filters);
      return this.success(tags);
    } catch (error) {
      return this.handleError(error, "searchTags");
    }
  }

  async getTagWithProjectCount(
    id: string
  ): Promise<ApiResponse<{ tag: Tag; projectCount: number } | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid tag ID",
        };
      }

      const result = await tagRepository.findWithProjectCount(id);
      return this.success(result);
    } catch (error) {
      return this.handleError(error, "getTagWithProjectCount");
    }
  }

  async getPopularTags(
    limit: number = 10
  ): Promise<ApiResponse<Array<{ tag: Tag; projectCount: number }>>> {
    try {
      const tags = await tagRepository.findPopular(limit);
      return this.success(tags);
    } catch (error) {
      return this.handleError(error, "getPopularTags");
    }
  }
}
