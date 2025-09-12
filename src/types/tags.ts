import type { tags, projectTags } from "@/server/db/schemas/tags";

// Base types from schema
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type ProjectTag = typeof projectTags.$inferSelect;
export type NewProjectTag = typeof projectTags.$inferInsert;

// Extended types
export interface TagWithCount extends Tag {
  projectCount: number;
}

export interface TagFilters {
  visible?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

// Form types for admin
export interface TagFormData {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  visible: boolean;
}

// API response types
export interface TagListResponse {
  tags: Tag[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface TagCreateRequest {
  tag: NewTag;
}

export interface TagUpdateRequest {
  id: string;
  tag: Partial<NewTag>;
}

export interface ProjectTagAssignRequest {
  projectId: string;
  tagIds: string[];
}

export interface ProjectTagRemoveRequest {
  projectId: string;
  tagId: string;
}
