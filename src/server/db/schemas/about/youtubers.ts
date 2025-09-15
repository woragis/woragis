import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "../auth";

// Enum for youtuber category
export const youtuberCategoryEnum = pgEnum("youtuber_category", [
  "current",
  "childhood",
]);

export const youtubers = pgTable("youtubers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  channelName: text("channel_name").notNull(),
  description: text("description"),
  category: youtuberCategoryEnum("category").notNull().default("current"),
  youtubeUrl: text("youtube_url"),
  profileImage: text("profile_image"),
  subscriberCount: text("subscriber_count"), // Store as text since it can be very large
  contentType: text("content_type"), // What type of content they make
  notes: text("notes"),
  order: integer("order").default(0),
  visible: boolean("visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const youtubersRelations = relations(youtubers, ({ one }) => ({
  user: one(users, {
    fields: [youtubers.userId],
    references: [users.id],
  }),
}));
