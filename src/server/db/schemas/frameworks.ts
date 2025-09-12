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

export const frameworks = pgTable("frameworks", {
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
  version: text("version"), // Current version
  order: integer("order").default(0),
  visible: boolean("visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Junction table for many-to-many relationship between projects and frameworks
export const projectFrameworks = pgTable("project_frameworks", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  frameworkId: uuid("framework_id")
    .notNull()
    .references(() => frameworks.id, { onDelete: "cascade" }),
  version: text("version"), // Version used in this project
  proficiency: text("proficiency"), // beginner, intermediate, advanced, expert
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const frameworksRelations = relations(frameworks, ({ one, many }) => ({
  user: one(users, {
    fields: [frameworks.userId],
    references: [users.id],
  }),
  projectFrameworks: many(projectFrameworks),
}));

export const projectFrameworksRelations = relations(
  projectFrameworks,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectFrameworks.projectId],
      references: [projects.id],
    }),
    framework: one(frameworks, {
      fields: [projectFrameworks.frameworkId],
      references: [frameworks.id],
    }),
  })
);
