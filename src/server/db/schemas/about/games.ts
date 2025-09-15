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

// Enum for game category
export const gameCategoryEnum = pgEnum("game_category", [
  "childhood",
  "current",
  "planned",
]);

export const games = pgTable("games", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  category: gameCategoryEnum("category").notNull().default("current"),
  platform: text("platform"), // PC, PlayStation, Xbox, Nintendo Switch, etc.
  genre: text("genre"), // Action, RPG, Strategy, etc.
  coverImage: text("cover_image"),
  steamUrl: text("steam_url"),
  playtime: integer("playtime"), // Hours played
  rating: integer("rating"), // 1-10 rating
  notes: text("notes"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  plannedPlayAt: timestamp("planned_play_at"), // When planning to play
  order: integer("order").default(0),
  visible: boolean("visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const gamesRelations = relations(games, ({ one }) => ({
  user: one(users, {
    fields: [games.userId],
    references: [users.id],
  }),
}));
