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
import { users } from "./auth";

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  technologies: text("technologies").notNull(), // JSON string array
  image: text("image").notNull(),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  featured: boolean("featured").default(true),
  order: integer("order").notNull().default(0),
  visible: boolean("visible").default(true),
  public: boolean("public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  projectTags: many(projectTags),
  projectCategories: many(projectCategories),
  projectLanguages: many(projectLanguages),
  projectFrameworks: many(projectFrameworks),
}));
