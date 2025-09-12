import type {
  categories,
  projectCategories,
} from "@/server/db/schemas/categories";

// Base types from schema
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type ProjectCategory = typeof projectCategories.$inferSelect;
export type NewProjectCategory = typeof projectCategories.$inferInsert;

// Extended types
export interface CategoryWithCount extends Category {
  projectCount: number;
}

export interface CategoryFilters {
  visible?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

// Form types for admin
export interface CategoryFormData {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  order: number;
  visible: boolean;
}

// API response types
export interface CategoryListResponse {
  categories: Category[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface CategoryCreateRequest {
  category: NewCategory;
}

export interface CategoryUpdateRequest {
  id: string;
  category: Partial<NewCategory>;
}

export interface ProjectCategoryAssignRequest {
  projectId: string;
  categoryIds: string[];
}

export interface ProjectCategoryRemoveRequest {
  projectId: string;
  categoryId: string;
}
