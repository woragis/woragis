import { apiClient } from "../clients/apiClient";
import type {
  Testimonial,
  NewTestimonial,
  TestimonialFilters,
  TestimonialCreateRequest,
} from "@/types/testimonials";
import type { ApiResponse } from "@/types";

// Testimonial API functions
export const testimonialApi = {
  async getAllTestimonials(
    filters: TestimonialFilters = {}
  ): Promise<ApiResponse<Testimonial[]>> {
    const params = new URLSearchParams();
    if (filters.visible !== undefined)
      params.append("visible", filters.visible.toString());
    if (filters.featured !== undefined)
      params.append("featured", filters.featured.toString());
    if (filters.search) params.append("search", filters.search);
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.offset) params.append("offset", filters.offset.toString());
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    return apiClient.get(`/admin/testimonials?${params.toString()}`);
  },

  async getTestimonialById(
    id: string
  ): Promise<ApiResponse<Testimonial | null>> {
    return apiClient.get(`/admin/testimonials/${id}`);
  },

  async createTestimonial(
    testimonialData: TestimonialCreateRequest["testimonial"]
  ): Promise<ApiResponse<Testimonial>> {
    return apiClient.post("/admin/testimonials", testimonialData);
  },

  async updateTestimonial(
    id: string,
    testimonialData: Partial<NewTestimonial>
  ): Promise<ApiResponse<Testimonial | null>> {
    return apiClient.put(`/admin/testimonials/${id}`, testimonialData);
  },

  async deleteTestimonial(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/admin/testimonials/${id}`);
  },

  async toggleTestimonialVisibility(
    id: string
  ): Promise<ApiResponse<Testimonial | null>> {
    return apiClient.patch(`/admin/testimonials/${id}/toggle-visibility`);
  },

  async toggleTestimonialFeatured(
    id: string
  ): Promise<ApiResponse<Testimonial | null>> {
    return apiClient.patch(`/admin/testimonials/${id}/toggle-featured`);
  },

  async updateTestimonialOrder(
    testimonialOrders: { id: string; order: number }[]
  ): Promise<ApiResponse<void>> {
    return apiClient.post("/admin/testimonials/order", { testimonialOrders });
  },

  // Stats API
  async getTestimonialStats(): Promise<ApiResponse<number>> {
    return apiClient.get("/admin/testimonials/stats/total");
  },

  async getAverageRating(): Promise<ApiResponse<number>> {
    return apiClient.get("/admin/testimonials/stats/average-rating");
  },

  // Public testimonial API
  async getPublicTestimonials(
    filters: TestimonialFilters = {}
  ): Promise<ApiResponse<Testimonial[]>> {
    const params = new URLSearchParams();
    if (filters.featured !== undefined)
      params.append("featured", filters.featured.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.offset) params.append("offset", filters.offset.toString());
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    return apiClient.get(`/testimonials?${params.toString()}`);
  },
};
