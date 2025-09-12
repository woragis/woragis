import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const settings = pgTable("settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Future settings-related tables can be added here
// export const userPreferences = pgTable("user_preferences", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   userId: uuid("user_id").notNull(),
//   preferenceKey: text("preference_key").notNull(),
//   preferenceValue: text("preference_value").notNull(),
//   // ... other fields
// });
