import type { blogTags } from "@/server/db/schemas/blog-tags";

// Base types from schema
export type BlogTag = typeof blogTags.$inferSelect;
export type NewBlogTag = typeof blogTags.$inferInsert;

// Extended types for specific use cases
export interface BlogTagWithCount extends BlogTag {
  postCount: number;
}

export interface BlogTagFilters {
  visible?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

// Form types for admin
export interface BlogTagFormData {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  visible: boolean;
  order: number;
}

// API response types
export interface BlogTagListResponse {
  tags: BlogTag[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface BlogTagCreateRequest {
  blogTag: NewBlogTag;
}

export interface BlogTagUpdateRequest {
  id: string;
  blogTag: Partial<NewBlogTag>;
}

export interface BlogTagOrderUpdate {
  id: string;
  order: number;
}

export interface BlogTagOrderUpdateRequest {
  blogTagOrders: BlogTagOrderUpdate[];
}
