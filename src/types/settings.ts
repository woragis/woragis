import type { settings } from "@/server/db/schemas/settings";

// Base types from schema
export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;

// Extended types for specific use cases
export interface SettingWithMetadata extends Setting {
  description?: string;
  category?: string;
  isPublic?: boolean;
}

// Common setting keys (type-safe)
export type SettingKey =
  | "projects_per_page"
  | "site_title"
  | "site_description"
  | "contact_email"
  | "github_url"
  | "linkedin_url"
  | "twitter_url"
  | "theme"
  | "language"
  | "maintenance_mode";

// Setting value types based on key
export interface SettingValues {
  projects_per_page: number;
  site_title: string;
  site_description: string;
  contact_email: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  theme: "light" | "dark" | "system";
  language: string;
  maintenance_mode: boolean;
}

// Form types for admin
export interface SettingsFormData {
  projectsPerPage: number;
  siteTitle: string;
  siteDescription: string;
  contactEmail: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  theme: "light" | "dark" | "system";
  language: string;
  maintenanceMode: boolean;
}

// API response types
export interface SettingsResponse {
  settings: Record<string, string>;
}

export interface SettingUpdateRequest {
  key: SettingKey;
  value: string;
}

export interface SettingsBulkUpdateRequest {
  settings: Record<SettingKey, string>;
}
