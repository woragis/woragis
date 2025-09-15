import { pgTable, text, uuid, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "../auth";
import { experiences } from "../experience";

export const aboutCore = pgTable("about_core", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  currentProfessionId: uuid("current_profession_id").references(
    () => experiences.id,
    { onDelete: "set null" }
  ),
  biography: text("biography"), // Markdown formatted
  featuredBiography: text("featured_biography"), // Plain text for home page
  visible: boolean("visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const aboutCoreRelations = relations(aboutCore, ({ one }) => ({
  user: one(users, {
    fields: [aboutCore.userId],
    references: [users.id],
  }),
  currentProfession: one(experiences, {
    fields: [aboutCore.currentProfessionId],
    references: [experiences.id],
  }),
}));
