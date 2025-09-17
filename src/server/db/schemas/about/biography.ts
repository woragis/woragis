import { pgTable, text, boolean, timestamp, uuid } from "drizzle-orm/pg-core";

export const biography = pgTable("biography", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  featuredBiography: text("featured_biography"),
  fullBiography: text("full_biography"),
  visible: boolean("visible").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Biography = typeof biography.$inferSelect;
export type NewBiography = typeof biography.$inferInsert;
