import { pgTable, text, boolean, timestamp, uuid } from "drizzle-orm/pg-core";

export const hobbies = pgTable("hobbies", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"),
  visible: boolean("visible").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Hobby = typeof hobbies.$inferSelect;
export type NewHobby = typeof hobbies.$inferInsert;
