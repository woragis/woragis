import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "../auth";

export const musicGenres = pgTable("music_genres", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  order: integer("order").default(0),
  visible: boolean("visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const lastListenedSongs = pgTable("last_listened_songs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  album: text("album"),
  spotifyUrl: text("spotify_url"),
  youtubeUrl: text("youtube_url"),
  listenedAt: timestamp("listened_at").defaultNow(),
  order: integer("order").default(0),
  visible: boolean("visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const musicGenresRelations = relations(musicGenres, ({ one }) => ({
  user: one(users, {
    fields: [musicGenres.userId],
    references: [users.id],
  }),
}));

export const lastListenedSongsRelations = relations(
  lastListenedSongs,
  ({ one }) => ({
    user: one(users, {
      fields: [lastListenedSongs.userId],
      references: [users.id],
    }),
  })
);
