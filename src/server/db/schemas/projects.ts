import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
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
  content: text("content"), // Markdown content for rich project details
  videoUrl: text("video_url"), // Video URL for project demos
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
  projectFrameworks: many(projectFrameworks),
}));
