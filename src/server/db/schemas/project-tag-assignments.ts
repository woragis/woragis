import { pgTable, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projects } from "./projects";
import { projectTags } from "./project-tags";

export const projectTagAssignments = pgTable(
  "project_tag_assignments",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => projectTags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.projectId, table.tagId] }),
  })
);

// Relations
export const projectTagAssignmentsRelations = relations(
  projectTagAssignments,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectTagAssignments.projectId],
      references: [projects.id],
    }),
    tag: one(projectTags, {
      fields: [projectTagAssignments.tagId],
      references: [projectTags.id],
    }),
  })
);
