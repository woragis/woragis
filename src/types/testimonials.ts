import type { testimonials } from "@/server/db/schemas/testimonials";

// Base types from schema
export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;

// Extended types for specific use cases
export interface TestimonialWithStats extends Testimonial {
  viewCount?: number;
  likeCount?: number;
}

export interface TestimonialFilters {
  featured?: boolean;
  visible?: boolean;
  public?: boolean;
  rating?: number;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface TestimonialOrderUpdate {
  id: string;
  order: number;
}

// Form types for admin
export interface TestimonialFormData {
  name: string;
  position: string;
  company: string;
  content: string;
  avatar?: string;
  rating: number;
  featured: boolean;
  order: number;
  visible: boolean;
  public: boolean;
}

// API response types
export interface TestimonialListResponse {
  testimonials: Testimonial[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface TestimonialCreateRequest {
  testimonial: NewTestimonial;
}

export interface TestimonialUpdateRequest {
  id: string;
  testimonial: Partial<NewTestimonial>;
}

export interface TestimonialOrderUpdateRequest {
  testimonialOrders: TestimonialOrderUpdate[];
}
