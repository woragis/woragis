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

// Enum for anime status
export const animeStatusEnum = pgEnum("anime_status", [
  "want_to_watch",
  "watching",
  "completed",
  "dropped",
  "on_hold",
]);

export const animeList = pgTable("anime_list", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  status: animeStatusEnum("status").notNull().default("want_to_watch"),
  myAnimeListId: text("myanimelist_id"), // External ID for MyAnimeList
  coverImage: text("cover_image"),
  genres: text("genres"), // JSON array of genres
  episodes: integer("episodes"),
  currentEpisode: integer("current_episode").default(0),
  rating: integer("rating"), // 1-10 rating
  notes: text("notes"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  order: integer("order").default(0),
  visible: boolean("visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const animeListRelations = relations(animeList, ({ one }) => ({
  user: one(users, {
    fields: [animeList.userId],
    references: [users.id],
  }),
}));
