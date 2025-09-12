import type {
  languages,
  projectLanguages,
} from "@/server/db/schemas/languages";

// Base types from schema
export type Language = typeof languages.$inferSelect;
export type NewLanguage = typeof languages.$inferInsert;
export type ProjectLanguage = typeof projectLanguages.$inferSelect;
export type NewProjectLanguage = typeof projectLanguages.$inferInsert;

// Extended types
export interface LanguageWithCount extends Language {
  projectCount: number;
}

export interface LanguageWithProficiency extends Language {
  proficiency?: string;
}

export interface LanguageFilters {
  visible?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

// Proficiency levels
export type ProficiencyLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

// Form types for admin
export interface LanguageFormData {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  website?: string;
  order: number;
  visible: boolean;
}

// API response types
export interface LanguageListResponse {
  languages: Language[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface LanguageCreateRequest {
  language: NewLanguage;
}

export interface LanguageUpdateRequest {
  id: string;
  language: Partial<NewLanguage>;
}

export interface ProjectLanguageAssignRequest {
  projectId: string;
  languageId: string;
  proficiency?: ProficiencyLevel;
}

export interface ProjectLanguageRemoveRequest {
  projectId: string;
  languageId: string;
}
