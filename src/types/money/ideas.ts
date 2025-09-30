import type { ideas } from "@/server/db/schemas/money";

// Base types from schema
export type Idea = typeof ideas.$inferSelect;
export type NewIdea = typeof ideas.$inferInsert;

// Extended types
export interface IdeaWithNodes extends Idea {
  nodeCount?: number;
}

export interface IdeaFilters {
  featured?: boolean;
  visible?: boolean;
  public?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: "createdAt" | "updatedAt" | "title" | "order";
  sortOrder?: "asc" | "desc";
}

export interface IdeaOrderUpdate {
  id: string;
  order: number;
}

// Form types for admin
export interface IdeaFormData {
  title: string;
  slug: string;
  document: string;
  description?: string;
  featured: boolean;
  visible: boolean;
  public: boolean;
  order: number;
}

// API response types
export interface IdeaListResponse {
  ideas: Idea[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface IdeaCreateRequest {
  idea: Omit<NewIdea, "userId">;
}

export interface IdeaUpdateRequest {
  id: string;
  idea: Partial<NewIdea>;
}
