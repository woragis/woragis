import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";

export const settings = pgTable("settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Note: Core Profile has been moved to biography system

// Social Media Settings
export const socialMedia = pgTable("social_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  github: text("github"),
  linkedin: text("linkedin"),
  twitter: text("twitter"),
  instagram: text("instagram"),
  youtube: text("youtube"),
  discord: text("discord"),
  telegram: text("telegram"),
  website: text("website"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Contact Information Settings
export const contactInfo = pgTable("contact_info", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  country: text("country"),
  timezone: text("timezone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Site Settings
export const siteSettings = pgTable("site_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  theme: text("theme").default("system").notNull(),
  language: text("language").default("en").notNull(),
  projectsPerPage: integer("projects_per_page").default(6).notNull(),
  maintenanceMode: boolean("maintenance_mode").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Export types
export type Settings = typeof settings.$inferSelect;
export type NewSettings = typeof settings.$inferInsert;

// Note: Core Profile types have been moved to biography system

export type SocialMedia = typeof socialMedia.$inferSelect;
export type NewSocialMedia = typeof socialMedia.$inferInsert;

export type ContactInfo = typeof contactInfo.$inferSelect;
export type NewContactInfo = typeof contactInfo.$inferInsert;

export type SiteSettings = typeof siteSettings.$inferSelect;
export type NewSiteSettings = typeof siteSettings.$inferInsert;
