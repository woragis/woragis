import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projectTags } from "./tags";
import { projectCategories } from "./categories";
import { projectLanguages } from "./languages";
import { projectFrameworks } from "./frameworks";

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  technologies: text("technologies").notNull(), // JSON string array
  image: text("image").notNull(),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  featured: boolean("featured").default(false),
  order: integer("order").notNull().default(0),
  visible: boolean("visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const projectsRelations = relations(projects, ({ many }) => ({
  projectTags: many(projectTags),
  projectCategories: many(projectCategories),
  projectLanguages: many(projectLanguages),
  projectFrameworks: many(projectFrameworks),
}));
