import {
  pgTable,
  text,
  uuid,
  timestamp,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { blogPosts } from "./blog";
import { projects } from "./projects";
import { experiences } from "./experience";
import { education } from "./education";
import { testimonials } from "./testimonials";

// Language codes supported by the system
export type SupportedLanguage = "en" | "es" | "pt" | "it" | "fr" | "ja" | "zh" | "ko";

// Base translation table for blog posts
export const blogPostTranslations = pgTable(
  "blog_post_translations",
  {
    blogPostId: uuid("blog_post_id")
      .notNull()
      .references(() => blogPosts.id, { onDelete: "cascade" }),
    languageCode: text("language_code").notNull().$type<SupportedLanguage>(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.blogPostId, table.languageCode] }),
    blogPostIdIdx: index("blog_post_translations_blog_post_id_idx").on(table.blogPostId),
    languageCodeIdx: index("blog_post_translations_language_code_idx").on(table.languageCode),
  })
);

// Translation table for projects
export const projectTranslations = pgTable(
  "project_translations",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    languageCode: text("language_code").notNull().$type<SupportedLanguage>(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    longDescription: text("long_description"),
    content: text("content"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.projectId, table.languageCode] }),
    projectIdIdx: index("project_translations_project_id_idx").on(table.projectId),
    languageCodeIdx: index("project_translations_language_code_idx").on(table.languageCode),
  })
);

// Translation table for experiences
export const experienceTranslations = pgTable(
  "experience_translations",
  {
    experienceId: uuid("experience_id")
      .notNull()
      .references(() => experiences.id, { onDelete: "cascade" }),
    languageCode: text("language_code").notNull().$type<SupportedLanguage>(),
    title: text("title").notNull(),
    company: text("company").notNull(),
    period: text("period").notNull(),
    location: text("location").notNull(),
    description: text("description").notNull(),
    achievements: text("achievements").notNull(), // JSON string of translated achievements
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.experienceId, table.languageCode] }),
    experienceIdIdx: index("experience_translations_experience_id_idx").on(table.experienceId),
    languageCodeIdx: index("experience_translations_language_code_idx").on(table.languageCode),
  })
);

// Translation table for education
export const educationTranslations = pgTable(
  "education_translations",
  {
    educationId: uuid("education_id")
      .notNull()
      .references(() => education.id, { onDelete: "cascade" }),
    languageCode: text("language_code").notNull().$type<SupportedLanguage>(),
    degree: text("degree").notNull(),
    school: text("school").notNull(),
    year: text("year").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.educationId, table.languageCode] }),
    educationIdIdx: index("education_translations_education_id_idx").on(table.educationId),
    languageCodeIdx: index("education_translations_language_code_idx").on(table.languageCode),
  })
);

// Translation table for testimonials
export const testimonialTranslations = pgTable(
  "testimonial_translations",
  {
    testimonialId: uuid("testimonial_id")
      .notNull()
      .references(() => testimonials.id, { onDelete: "cascade" }),
    languageCode: text("language_code").notNull().$type<SupportedLanguage>(),
    name: text("name").notNull(),
    role: text("role").notNull(),
    company: text("company").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.testimonialId, table.languageCode] }),
    testimonialIdIdx: index("testimonial_translations_testimonial_id_idx").on(table.testimonialId),
    languageCodeIdx: index("testimonial_translations_language_code_idx").on(table.languageCode),
  })
);


// Relations for blog post translations
export const blogPostTranslationsRelations = relations(blogPostTranslations, ({ one }) => ({
  blogPost: one(blogPosts, {
    fields: [blogPostTranslations.blogPostId],
    references: [blogPosts.id],
  }),
}));

// Relations for project translations
export const projectTranslationsRelations = relations(projectTranslations, ({ one }) => ({
  project: one(projects, {
    fields: [projectTranslations.projectId],
    references: [projects.id],
  }),
}));

// Relations for experience translations
export const experienceTranslationsRelations = relations(experienceTranslations, ({ one }) => ({
  experience: one(experiences, {
    fields: [experienceTranslations.experienceId],
    references: [experiences.id],
  }),
}));

// Relations for education translations
export const educationTranslationsRelations = relations(educationTranslations, ({ one }) => ({
  education: one(education, {
    fields: [educationTranslations.educationId],
    references: [education.id],
  }),
}));

// Relations for testimonial translations
export const testimonialTranslationsRelations = relations(testimonialTranslations, ({ one }) => ({
  testimonial: one(testimonials, {
    fields: [testimonialTranslations.testimonialId],
    references: [testimonials.id],
  }),
}));

