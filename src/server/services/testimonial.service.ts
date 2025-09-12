import { testimonialRepository } from "@/server/repositories";
import type {
  Testimonial,
  NewTestimonial,
  TestimonialFilters,
  TestimonialOrderUpdate,
  ApiResponse,
} from "@/types";
import { BaseService } from "./base.service";

export class TestimonialService extends BaseService {
  async getAllTestimonials(
    userId?: string
  ): Promise<ApiResponse<Testimonial[]>> {
    try {
      const testimonials = await testimonialRepository.findAll(userId);
      return this.success(testimonials);
    } catch (error) {
      return this.handleError(error, "getAllTestimonials");
    }
  }

  async getVisibleTestimonials(
    userId?: string
  ): Promise<ApiResponse<Testimonial[]>> {
    try {
      const testimonials = await testimonialRepository.findVisible(userId);
      return this.success(testimonials);
    } catch (error) {
      return this.handleError(error, "getVisibleTestimonials");
    }
  }

  async getPublicTestimonials(): Promise<ApiResponse<Testimonial[]>> {
    try {
      const testimonials = await testimonialRepository.findPublic();
      return this.success(testimonials);
    } catch (error) {
      return this.handleError(error, "getPublicTestimonials");
    }
  }

  async getFeaturedTestimonials(
    limit: number = 3,
    userId?: string
  ): Promise<ApiResponse<Testimonial[]>> {
    try {
      const testimonials = await testimonialRepository.findFeatured(
        limit,
        userId
      );
      return this.success(testimonials);
    } catch (error) {
      return this.handleError(error, "getFeaturedTestimonials");
    }
  }

  async getPublicFeaturedTestimonials(
    limit: number = 3
  ): Promise<ApiResponse<Testimonial[]>> {
    try {
      const testimonials = await testimonialRepository.findPublicFeatured(
        limit
      );
      return this.success(testimonials);
    } catch (error) {
      return this.handleError(error, "getPublicFeaturedTestimonials");
    }
  }

  async getTestimonialById(
    id: string,
    userId?: string
  ): Promise<ApiResponse<Testimonial | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid testimonial ID",
        };
      }

      const testimonial = await testimonialRepository.findById(id, userId);
      return this.success(testimonial);
    } catch (error) {
      return this.handleError(error, "getTestimonialById");
    }
  }

  async getPublicTestimonialById(
    id: string
  ): Promise<ApiResponse<Testimonial | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid testimonial ID",
        };
      }

      const testimonial = await testimonialRepository.findPublicById(id);
      return this.success(testimonial);
    } catch (error) {
      return this.handleError(error, "getPublicTestimonialById");
    }
  }

  async createTestimonial(
    testimonialData: NewTestimonial,
    userId: string
  ): Promise<ApiResponse<Testimonial>> {
    try {
      const requiredFields: (keyof NewTestimonial)[] = [
        "name",
        "position",
        "company",
        "content",
      ];
      const validationErrors = this.validateRequired(
        testimonialData,
        requiredFields
      );

      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation failed: ${validationErrors.join(", ")}`,
        };
      }

      // Validate rating is between 1 and 5
      if (
        testimonialData.rating &&
        (testimonialData.rating < 1 || testimonialData.rating > 5)
      ) {
        return {
          success: false,
          error: "Rating must be between 1 and 5",
        };
      }

      // Add userId to testimonial data
      const testimonialWithUser = { ...testimonialData, userId };
      const testimonial = await testimonialRepository.create(
        testimonialWithUser
      );
      return this.success(testimonial, "Testimonial created successfully");
    } catch (error) {
      return this.handleError(error, "createTestimonial");
    }
  }

  async updateTestimonial(
    id: string,
    testimonialData: Partial<NewTestimonial>,
    userId?: string
  ): Promise<ApiResponse<Testimonial | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid testimonial ID",
        };
      }

      // Validate rating if provided
      if (
        testimonialData.rating &&
        (testimonialData.rating < 1 || testimonialData.rating > 5)
      ) {
        return {
          success: false,
          error: "Rating must be between 1 and 5",
        };
      }

      const testimonial = await testimonialRepository.update(
        id,
        testimonialData,
        userId
      );
      if (!testimonial) {
        return {
          success: false,
          error: "Testimonial not found",
        };
      }

      return this.success(testimonial, "Testimonial updated successfully");
    } catch (error) {
      return this.handleError(error, "updateTestimonial");
    }
  }

  async deleteTestimonial(
    id: string,
    userId?: string
  ): Promise<ApiResponse<void>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid testimonial ID",
        };
      }

      await testimonialRepository.delete(id, userId);
      return this.success(undefined, "Testimonial deleted successfully");
    } catch (error) {
      return this.handleError(error, "deleteTestimonial");
    }
  }

  async searchTestimonials(
    filters: TestimonialFilters,
    userId?: string
  ): Promise<ApiResponse<Testimonial[]>> {
    try {
      const testimonials = await testimonialRepository.search(filters, userId);
      return this.success(testimonials);
    } catch (error) {
      return this.handleError(error, "searchTestimonials");
    }
  }

  async updateTestimonialOrder(
    testimonialOrders: TestimonialOrderUpdate[]
  ): Promise<ApiResponse<void>> {
    try {
      if (!testimonialOrders || testimonialOrders.length === 0) {
        return {
          success: false,
          error: "No testimonial orders provided",
        };
      }

      await testimonialRepository.updateOrder(testimonialOrders);
      return this.success(undefined, "Testimonial order updated successfully");
    } catch (error) {
      return this.handleError(error, "updateTestimonialOrder");
    }
  }

  async toggleTestimonialVisibility(
    id: string
  ): Promise<ApiResponse<Testimonial | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid testimonial ID",
        };
      }

      const testimonial = await testimonialRepository.toggleVisibility(id);
      if (!testimonial) {
        return {
          success: false,
          error: "Testimonial not found",
        };
      }

      return this.success(
        testimonial,
        "Testimonial visibility toggled successfully"
      );
    } catch (error) {
      return this.handleError(error, "toggleTestimonialVisibility");
    }
  }

  async toggleTestimonialFeatured(
    id: string
  ): Promise<ApiResponse<Testimonial | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid testimonial ID",
        };
      }

      const testimonial = await testimonialRepository.toggleFeatured(id);
      if (!testimonial) {
        return {
          success: false,
          error: "Testimonial not found",
        };
      }

      return this.success(
        testimonial,
        "Testimonial featured status toggled successfully"
      );
    } catch (error) {
      return this.handleError(error, "toggleTestimonialFeatured");
    }
  }

  async getAverageRating(userId?: string): Promise<ApiResponse<number>> {
    try {
      const averageRating = await testimonialRepository.getAverageRating(
        userId
      );
      return this.success(averageRating);
    } catch (error) {
      return this.handleError(error, "getAverageRating");
    }
  }

  async getTotalCount(userId?: string): Promise<ApiResponse<number>> {
    try {
      const totalCount = await testimonialRepository.getTotalCount(userId);
      return this.success(totalCount);
    } catch (error) {
      return this.handleError(error, "getTotalCount");
    }
  }
}
