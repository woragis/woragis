import { BaseService } from "./base.service";
import { blogTagRepository } from "@/server/repositories";
import type { ApiResponse } from "@/types";
import type {
  BlogTag,
  NewBlogTag,
  BlogTagFilters,
  BlogTagWithCount,
  BlogTagOrderUpdate,
} from "@/types/blog-tags";

export class BlogTagService extends BaseService {
  async createBlogTag(
    data: NewBlogTag,
    userId: string
  ): Promise<ApiResponse<BlogTag>> {
    try {
      const tagData = { ...data, userId };
      const tag = await blogTagRepository.create(tagData);
      return this.success(tag);
    } catch (error) {
      return this.handleError(error, "createBlogTag");
    }
  }

  async getBlogTagById(id: string): Promise<ApiResponse<BlogTag | null>> {
    try {
      const tag = await blogTagRepository.findById(id);
      return this.success(tag);
    } catch (error) {
      return this.handleError(error, "getBlogTagById");
    }
  }

  async getBlogTagBySlug(slug: string): Promise<ApiResponse<BlogTag | null>> {
    try {
      const tag = await blogTagRepository.findBySlug(slug);
      return this.success(tag);
    } catch (error) {
      return this.handleError(error, "getBlogTagBySlug");
    }
  }

  async updateBlogTag(
    id: string,
    data: Partial<NewBlogTag>
  ): Promise<ApiResponse<BlogTag | null>> {
    try {
      const tag = await blogTagRepository.update(id, data);
      return this.success(tag);
    } catch (error) {
      return this.handleError(error, "updateBlogTag");
    }
  }

  async deleteBlogTag(id: string): Promise<ApiResponse<void>> {
    try {
      const success = await blogTagRepository.delete(id);
      if (!success) {
        return {
          success: false,
          error: "Blog tag not found",
        };
      }
      return this.success(undefined);
    } catch (error) {
      return this.handleError(error, "deleteBlogTag");
    }
  }

  async searchBlogTags(
    filters: BlogTagFilters,
    userId?: string
  ): Promise<ApiResponse<BlogTag[]>> {
    try {
      const tags = await blogTagRepository.search(filters, userId);
      return this.success(tags);
    } catch (error) {
      return this.handleError(error, "searchBlogTags");
    }
  }

  async getVisibleBlogTags(): Promise<ApiResponse<BlogTag[]>> {
    try {
      const tags = await blogTagRepository.getVisibleTags();
      return this.success(tags);
    } catch (error) {
      return this.handleError(error, "getVisibleBlogTags");
    }
  }

  async getBlogTagsWithCount(
    userId?: string
  ): Promise<ApiResponse<BlogTagWithCount[]>> {
    try {
      const tags = await blogTagRepository.getTagsWithCount(userId);
      return this.success(tags);
    } catch (error) {
      return this.handleError(error, "getBlogTagsWithCount");
    }
  }

  async updateBlogTagOrder(
    tagOrders: BlogTagOrderUpdate[]
  ): Promise<ApiResponse<void>> {
    try {
      await blogTagRepository.updateOrder(tagOrders);
      return this.success(undefined);
    } catch (error) {
      return this.handleError(error, "updateBlogTagOrder");
    }
  }

  async getPopularBlogTags(
    limit?: number
  ): Promise<ApiResponse<BlogTagWithCount[]>> {
    try {
      const tags = await blogTagRepository.getPopularTags(limit);
      return this.success(tags);
    } catch (error) {
      return this.handleError(error, "getPopularBlogTags");
    }
  }
}
