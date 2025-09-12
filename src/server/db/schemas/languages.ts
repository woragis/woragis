import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projects } from "./projects";
import { users } from "./auth";

export const languages = pgTable("languages", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon"), // Icon name or URL
  color: text("color"), // Hex color code for UI
  website: text("website"), // Official website URL
  order: integer("order").default(0),
  visible: boolean("visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Junction table for many-to-many relationship between projects and languages
export const projectLanguages = pgTable("project_languages", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  languageId: uuid("language_id")
    .notNull()
    .references(() => languages.id, { onDelete: "cascade" }),
  proficiency: text("proficiency"), // beginner, intermediate, advanced, expert
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const languagesRelations = relations(languages, ({ one, many }) => ({
  user: one(users, {
    fields: [languages.userId],
    references: [users.id],
  }),
  projectLanguages: many(projectLanguages),
}));

export const projectLanguagesRelations = relations(
  projectLanguages,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectLanguages.projectId],
      references: [projects.id],
    }),
    language: one(languages, {
      fields: [projectLanguages.languageId],
      references: [languages.id],
    }),
  })
);
