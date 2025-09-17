import type {
  settings,
  socialMedia,
  contactInfo,
  siteSettings,
} from "@/server/db/schemas/settings";
import type { Experience } from "./experience";
import type { Biography } from "./about/biography";

// Base types from schema
export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;

// Note: Core Profile types have been moved to biography system
export type SocialMedia = typeof socialMedia.$inferSelect;
export type NewSocialMedia = typeof socialMedia.$inferInsert;
export type ContactInfo = typeof contactInfo.$inferSelect;
export type NewContactInfo = typeof contactInfo.$inferInsert;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type NewSiteSettings = typeof siteSettings.$inferInsert;

// Extended types for specific use cases
export interface SettingWithMetadata extends Setting {
  description?: string;
  category?: string;
  isPublic?: boolean;
}

// Core Profile Settings (moved from about core)
export interface CoreProfileSettings {
  name: string;
  currentProfessionId?: string;
  biography?: string;
  featuredBiography?: string;
  mainPicture?: string;
  visible: boolean;
}

// Social Media Settings
export interface SocialMediaSettings {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  discord?: string;
  telegram?: string;
  website?: string;
}

// Contact Information Settings
export interface ContactSettings {
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  timezone?: string;
}

// Complete Settings Structure
export interface CompleteSettings {
  biography: Biography;
  social: SocialMedia;
  contact: ContactInfo;
  site: SiteSettings;
}

// Common setting keys (type-safe)
export type SettingKey =
  // Core Profile
  | "core_name"
  | "core_current_profession_id"
  | "core_biography"
  | "core_featured_biography"
  | "core_main_picture"
  | "core_visible"
  // Social Media
  | "social_github"
  | "social_linkedin"
  | "social_twitter"
  | "social_instagram"
  | "social_youtube"
  | "social_discord"
  | "social_telegram"
  | "social_website"
  // Contact
  | "contact_email"
  | "contact_phone"
  | "contact_address"
  | "contact_city"
  | "contact_country"
  | "contact_timezone"
  // Site
  | "site_title"
  | "site_description"
  | "site_theme"
  | "site_language"
  | "site_projects_per_page"
  | "site_maintenance_mode";

// Setting value types based on key
export interface SettingValues {
  // Core Profile
  core_name: string;
  core_current_profession_id: string;
  core_biography: string;
  core_featured_biography: string;
  core_main_picture: string;
  core_visible: boolean;
  // Social Media
  social_github: string;
  social_linkedin: string;
  social_twitter: string;
  social_instagram: string;
  social_youtube: string;
  social_discord: string;
  social_telegram: string;
  social_website: string;
  // Contact
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  contact_city: string;
  contact_country: string;
  contact_timezone: string;
  // Site
  site_title: string;
  site_description: string;
  site_theme: "light" | "dark" | "system";
  site_language: string;
  site_projects_per_page: number;
  site_maintenance_mode: boolean;
}

// Form types for admin
export interface SettingsFormData {
  // Core Profile
  coreName: string;
  coreCurrentProfessionId?: string;
  coreBiography?: string;
  coreFeaturedBiography?: string;
  coreMainPicture?: string;
  coreVisible: boolean;
  // Social Media
  socialGithub?: string;
  socialLinkedin?: string;
  socialTwitter?: string;
  socialInstagram?: string;
  socialYoutube?: string;
  socialDiscord?: string;
  socialTelegram?: string;
  socialWebsite?: string;
  // Contact
  contactEmail: string;
  contactPhone?: string;
  contactAddress?: string;
  contactCity?: string;
  contactCountry?: string;
  contactTimezone?: string;
  // Site
  siteTitle: string;
  siteDescription: string;
  siteTheme: "light" | "dark" | "system";
  siteLanguage: string;
  siteProjectsPerPage: number;
  siteMaintenanceMode: boolean;
}

// API response types
export interface SettingsResponse {
  settings: Record<string, string>;
}

export interface CompleteSettingsResponse {
  biography: Biography;
  social: SocialMedia;
  contact: ContactInfo;
  site: SiteSettings;
}

export interface SettingUpdateRequest {
  key: SettingKey;
  value: string;
}

export interface SettingsBulkUpdateRequest {
  settings: Record<SettingKey, string>;
}

export interface CompleteSettingsUpdateRequest {
  biography?: Partial<Biography>;
  social?: Partial<NewSocialMedia>;
  contact?: Partial<NewContactInfo>;
  site?: Partial<NewSiteSettings>;
}
