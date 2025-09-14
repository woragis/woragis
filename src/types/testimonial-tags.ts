import type { testimonialTags } from "@/server/db/schemas/testimonial-tags";

// Base types from schema
export type TestimonialTag = typeof testimonialTags.$inferSelect;
export type NewTestimonialTag = typeof testimonialTags.$inferInsert;

// Extended types for specific use cases
export interface TestimonialTagWithCount extends TestimonialTag {
  testimonialCount: number;
}

export interface TestimonialTagFilters {
  visible?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

// Form types for admin
export interface TestimonialTagFormData {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  visible: boolean;
  order: number;
}

// API response types
export interface TestimonialTagListResponse {
  tags: TestimonialTag[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface TestimonialTagCreateRequest {
  testimonialTag: NewTestimonialTag;
}

export interface TestimonialTagUpdateRequest {
  id: string;
  testimonialTag: Partial<NewTestimonialTag>;
}

export interface TestimonialTagOrderUpdate {
  id: string;
  order: number;
}

export interface TestimonialTagOrderUpdateRequest {
  testimonialTagOrders: TestimonialTagOrderUpdate[];
}
