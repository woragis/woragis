import type {
  frameworks,
  projectFrameworks,
} from "@/server/db/schemas/frameworks";
import type { ProficiencyLevel } from "./index";

// Base types from schema
export type Framework = typeof frameworks.$inferSelect;
export type NewFramework = typeof frameworks.$inferInsert;
export type ProjectFramework = typeof projectFrameworks.$inferSelect;
export type NewProjectFramework = typeof projectFrameworks.$inferInsert;

// Extended types
export interface FrameworkWithCount extends Framework {
  projectCount: number;
}

export interface FrameworkWithProficiency extends Omit<Framework, "version"> {
  proficiency?: string;
  version?: string | null;
}

export interface FrameworkFilters {
  visible?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

// Form types for admin
export interface FrameworkFormData {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  website?: string;
  version?: string;
  order: number;
  visible: boolean;
}

// API response types
export interface FrameworkListResponse {
  frameworks: Framework[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface FrameworkCreateRequest {
  framework: NewFramework;
}

export interface FrameworkUpdateRequest {
  id: string;
  framework: Partial<NewFramework>;
}

export interface ProjectFrameworkAssignRequest {
  projectId: string;
  frameworkId: string;
  version?: string;
  proficiency?: ProficiencyLevel;
}

export interface ProjectFrameworkRemoveRequest {
  projectId: string;
  frameworkId: string;
}
