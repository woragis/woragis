import { pgTable, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { blogPosts } from "./blog";
import { blogTags } from "./blog-tags";

export const blogPostTags = pgTable(
  "blog_post_tags",
  {
    blogPostId: uuid("blog_post_id")
      .notNull()
      .references(() => blogPosts.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => blogTags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.blogPostId, table.tagId] }),
  })
);

// Relations
export const blogPostTagsRelations = relations(blogPostTags, ({ one }) => ({
  blogPost: one(blogPosts, {
    fields: [blogPostTags.blogPostId],
    references: [blogPosts.id],
  }),
  tag: one(blogTags, {
    fields: [blogPostTags.tagId],
    references: [blogTags.id],
  }),
}));
