import { BaseService } from "./base.service";
import { testimonialTagRepository } from "@/server/repositories";
import type { ApiResponse } from "@/types";
import type {
  TestimonialTag,
  NewTestimonialTag,
  TestimonialTagFilters,
  TestimonialTagWithCount,
  TestimonialTagOrderUpdate,
} from "@/types/testimonial-tags";

export class TestimonialTagService extends BaseService {
  async createTestimonialTag(
    data: NewTestimonialTag,
    userId: string
  ): Promise<ApiResponse<TestimonialTag>> {
    try {
      const tagData = { ...data, userId };
      const tag = await testimonialTagRepository.create(tagData);
      return this.success(tag);
    } catch (error) {
      return this.handleError(error, "createTestimonialTag");
    }
  }

  async getTestimonialTagById(
    id: string
  ): Promise<ApiResponse<TestimonialTag | null>> {
    try {
      const tag = await testimonialTagRepository.findById(id);
      return this.success(tag);
    } catch (error) {
      return this.handleError(error, "getTestimonialTagById");
    }
  }

  async getTestimonialTagBySlug(
    slug: string
  ): Promise<ApiResponse<TestimonialTag | null>> {
    try {
      const tag = await testimonialTagRepository.findBySlug(slug);
      return this.success(tag);
    } catch (error) {
      return this.handleError(error, "getTestimonialTagBySlug");
    }
  }

  async updateTestimonialTag(
    id: string,
    data: Partial<NewTestimonialTag>
  ): Promise<ApiResponse<TestimonialTag | null>> {
    try {
      const tag = await testimonialTagRepository.update(id, data);
      return this.success(tag);
    } catch (error) {
      return this.handleError(error, "updateTestimonialTag");
    }
  }

  async deleteTestimonialTag(id: string): Promise<ApiResponse<void>> {
    try {
      const success = await testimonialTagRepository.delete(id);
      if (!success) {
        return this.error("Testimonial tag not found", 404);
      }
      return this.success(undefined);
    } catch (error) {
      return this.handleError(error, "deleteTestimonialTag");
    }
  }

  async searchTestimonialTags(
    filters: TestimonialTagFilters,
    userId?: string
  ): Promise<ApiResponse<TestimonialTag[]>> {
    try {
      const tags = await testimonialTagRepository.search(filters, userId);
      return this.success(tags);
    } catch (error) {
      return this.handleError(error, "searchTestimonialTags");
    }
  }

  async getVisibleTestimonialTags(): Promise<ApiResponse<TestimonialTag[]>> {
    try {
      const tags = await testimonialTagRepository.getVisibleTags();
      return this.success(tags);
    } catch (error) {
      return this.handleError(error, "getVisibleTestimonialTags");
    }
  }

  async getTestimonialTagsWithCount(
    userId?: string
  ): Promise<ApiResponse<TestimonialTagWithCount[]>> {
    try {
      const tags = await testimonialTagRepository.getTagsWithCount(userId);
      return this.success(tags);
    } catch (error) {
      return this.handleError(error, "getTestimonialTagsWithCount");
    }
  }

  async updateTestimonialTagOrder(
    tagOrders: TestimonialTagOrderUpdate[]
  ): Promise<ApiResponse<void>> {
    try {
      await testimonialTagRepository.updateOrder(tagOrders);
      return this.success(undefined);
    } catch (error) {
      return this.handleError(error, "updateTestimonialTagOrder");
    }
  }

  async getPopularTestimonialTags(
    limit?: number
  ): Promise<ApiResponse<TestimonialTagWithCount[]>> {
    try {
      const tags = await testimonialTagRepository.getPopularTags(limit);
      return this.success(tags);
    } catch (error) {
      return this.handleError(error, "getPopularTestimonialTags");
    }
  }
}
