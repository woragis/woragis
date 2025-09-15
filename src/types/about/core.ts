import type { aboutCore } from "@/server/db/schemas/about/core";
import type { Experience } from "./experience";

// Base types from schema
export type AboutCore = typeof aboutCore.$inferSelect;
export type NewAboutCore = typeof aboutCore.$inferInsert;

// Extended types
export interface AboutCoreWithProfession extends AboutCore {
  currentProfession?: Experience;
}

export interface AboutCoreFilters {
  visible?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

// Form types for admin
export interface AboutCoreFormData {
  name: string;
  currentProfessionId?: string;
  biography?: string;
  featuredBiography?: string;
  visible: boolean;
}

// API response types
export interface AboutCoreResponse {
  about: AboutCoreWithProfession | null;
}

export interface AboutCoreCreateRequest {
  about: NewAboutCore;
}

export interface AboutCoreUpdateRequest {
  id: string;
  about: Partial<NewAboutCore>;
}
