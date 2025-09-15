import type { politicalViews } from "@/server/db/schemas/about/politics";

// Base types from schema
export type PoliticalView = typeof politicalViews.$inferSelect;
export type NewPoliticalView = typeof politicalViews.$inferInsert;

// Extended types
export interface PoliticalViewFilters {
  visible?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

// Form types for admin
export interface PoliticalViewFormData {
  personName: string;
  description?: string;
  website?: string;
  socialMedia?: Record<string, string>; // Platform: handle
  picture?: string;
  politicalParty?: string;
  position?: string;
  notes?: string;
  order: number;
  visible: boolean;
}

// API response types
export interface PoliticalViewListResponse {
  politicalViews: PoliticalView[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface PoliticalViewCreateRequest {
  politicalView: NewPoliticalView;
}

export interface PoliticalViewUpdateRequest {
  id: string;
  politicalView: Partial<NewPoliticalView>;
}
