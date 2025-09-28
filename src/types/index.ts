// Export all types from domain files
export * from "./auth";
export * from "./projects";
export * from "./settings";
export type {
  Framework,
  NewFramework,
  ProjectFramework,
  NewProjectFramework,
  FrameworkWithCount,
  FrameworkWithProficiency,
  FrameworkFilters,
  FrameworkFormData,
  FrameworkListResponse,
  FrameworkCreateRequest,
  FrameworkUpdateRequest,
  ProjectFrameworkAssignRequest,
  ProjectFrameworkRemoveRequest,
  FrameworkType,
  Language as FrameworkLanguage,
  NewLanguage as NewFrameworkLanguage,
  ProjectLanguage,
  NewProjectLanguage,
  LanguageWithCount,
  LanguageWithProficiency,
  LanguageFilters,
  LanguageFormData,
  LanguageListResponse,
  LanguageCreateRequest,
  LanguageUpdateRequest,
  ProjectLanguageAssignRequest,
  ProjectLanguageRemoveRequest
} from "./frameworks";
export * from "./testimonials";
export * from "./blog";
export * from "./experience";
export * from "./about";

// Export tag types
export * from "./blog-tags";

// Export upload types
export * from "./upload";

// Common types that might be shared across domains
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Common proficiency levels
export type ProficiencyLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";
