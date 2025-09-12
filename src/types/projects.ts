import type { projects } from "@/server/db/schemas/projects";
import type { Tag, Category, Language, Framework } from "@/types";

// Base types from schema
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

// Extended types for specific use cases
export interface ProjectWithStats extends Project {
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
}

export interface ProjectWithRelations extends Project {
  tags?: Tag[];
  categories?: Category[];
  languages?: Language[];
  frameworks?: Framework[];
}

export interface ProjectFilters {
  featured?: boolean;
  visible?: boolean;
  technologies?: string[];
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ProjectOrderUpdate {
  id: string;
  order: number;
}

// Form types for admin
export interface ProjectFormData {
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  image: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  order: number;
  visible: boolean;
}

// API response types
export interface ProjectListResponse {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ProjectCreateRequest {
  project: NewProject;
}

export interface ProjectUpdateRequest {
  id: string;
  project: Partial<NewProject>;
}

export interface ProjectOrderUpdateRequest {
  projectOrders: ProjectOrderUpdate[];
}
