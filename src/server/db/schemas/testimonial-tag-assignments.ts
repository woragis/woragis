import { pgTable, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { testimonials } from "./testimonials";
import { testimonialTags } from "./testimonial-tags";

export const testimonialTagAssignments = pgTable(
  "testimonial_tag_assignments",
  {
    testimonialId: uuid("testimonial_id")
      .notNull()
      .references(() => testimonials.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => testimonialTags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.testimonialId, table.tagId] }),
  })
);

// Relations
export const testimonialTagAssignmentsRelations = relations(
  testimonialTagAssignments,
  ({ one }) => ({
    testimonial: one(testimonials, {
      fields: [testimonialTagAssignments.testimonialId],
      references: [testimonials.id],
    }),
    tag: one(testimonialTags, {
      fields: [testimonialTagAssignments.tagId],
      references: [testimonialTags.id],
    }),
  })
);
