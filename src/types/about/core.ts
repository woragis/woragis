// import type { aboutCore } from "@/server/db/schemas/about/core";
import type { Experience } from "../experience";

// Base types from schema - TODO: Create aboutCore schema
// export type AboutCore = typeof aboutCore.$inferSelect;
// export type NewAboutCore = typeof aboutCore.$inferInsert;

// Temporary types until schema is created
export interface AboutCore {
  id: string;
  userId: string;
  name: string;
  currentProfessionId?: string | null;
  biography?: string | null;
  featuredBiography?: string | null;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewAboutCore {
  userId: string;
  name: string;
  currentProfessionId?: string | null;
  biography?: string | null;
  featuredBiography?: string | null;
  visible?: boolean;
}

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
