import { apiClient } from "../api-client";
import type { ApiResponse } from "@/types";
import type {
  TestimonialTag,
  NewTestimonialTag,
  TestimonialTagFilters,
  TestimonialTagWithCount,
  TestimonialTagOrderUpdate,
} from "@/types/testimonial-tags";

export const testimonialTagApi = {
  async getAllTestimonialTags(
    filters?: TestimonialTagFilters
  ): Promise<ApiResponse<TestimonialTag[]>> {
    const params = new URLSearchParams();

    if (filters?.visible !== undefined) {
      params.append("visible", filters.visible.toString());
    }
    if (filters?.search) {
      params.append("search", filters.search);
    }
    if (filters?.limit) {
      params.append("limit", filters.limit.toString());
    }
    if (filters?.offset) {
      params.append("offset", filters.offset.toString());
    }

    const queryString = params.toString();
    const url = queryString
      ? `/admin/testimonial-tags?${queryString}`
      : "/admin/testimonial-tags";

    return apiClient.get(url);
  },

  async getVisibleTestimonialTags(): Promise<ApiResponse<TestimonialTag[]>> {
    return apiClient.get("/testimonial-tags");
  },

  async getTestimonialTagById(
    id: string
  ): Promise<ApiResponse<TestimonialTag | null>> {
    return apiClient.get(`/admin/testimonial-tags/${id}`);
  },

  async getTestimonialTagBySlug(
    slug: string
  ): Promise<ApiResponse<TestimonialTag | null>> {
    return apiClient.get(`/testimonial-tags/${slug}`);
  },

  async createTestimonialTag(
    testimonialTagData: NewTestimonialTag
  ): Promise<ApiResponse<TestimonialTag>> {
    return apiClient.post("/admin/testimonial-tags", testimonialTagData);
  },

  async updateTestimonialTag(
    id: string,
    testimonialTagData: Partial<NewTestimonialTag>
  ): Promise<ApiResponse<TestimonialTag | null>> {
    return apiClient.put(`/admin/testimonial-tags/${id}`, testimonialTagData);
  },

  async deleteTestimonialTag(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/admin/testimonial-tags/${id}`);
  },

  async getTestimonialTagsWithCount(): Promise<
    ApiResponse<TestimonialTagWithCount[]>
  > {
    return apiClient.get("/admin/testimonial-tags/with-count");
  },

  async getPopularTestimonialTags(
    limit?: number
  ): Promise<ApiResponse<TestimonialTagWithCount[]>> {
    const params = limit ? `?limit=${limit}` : "";
    return apiClient.get(`/admin/testimonial-tags/popular${params}`);
  },

  async updateTestimonialTagOrder(
    tagOrders: TestimonialTagOrderUpdate[]
  ): Promise<ApiResponse<void>> {
    return apiClient.post("/admin/testimonial-tags/order", { tagOrders });
  },
};
