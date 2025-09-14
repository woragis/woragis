import type { projectTags } from "@/server/db/schemas/project-tags";

// Base types from schema
export type ProjectTag = typeof projectTags.$inferSelect;
export type NewProjectTag = typeof projectTags.$inferInsert;

// Extended types for specific use cases
export interface ProjectTagWithCount extends ProjectTag {
  projectCount: number;
}

export interface ProjectTagFilters {
  visible?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

// Form types for admin
export interface ProjectTagFormData {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  visible: boolean;
  order: number;
}

// API response types
export interface ProjectTagListResponse {
  tags: ProjectTag[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ProjectTagCreateRequest {
  projectTag: NewProjectTag;
}

export interface ProjectTagUpdateRequest {
  id: string;
  projectTag: Partial<NewProjectTag>;
}

export interface ProjectTagOrderUpdate {
  id: string;
  order: number;
}

export interface ProjectTagOrderUpdateRequest {
  projectTagOrders: ProjectTagOrderUpdate[];
}
