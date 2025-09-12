// Export all types from domain files
export * from "./auth";
export * from "./projects";
export * from "./settings";
export * from "./tags";
export * from "./categories";
export * from "./languages";
export * from "./frameworks";

// Common types that might be shared across domains
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
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
