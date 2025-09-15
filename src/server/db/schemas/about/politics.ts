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

export const politicalViews = pgTable("political_views", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  personName: text("person_name").notNull(),
  description: text("description"),
  website: text("website"),
  socialMedia: text("social_media"), // JSON object with platform: handle
  picture: text("picture"),
  politicalParty: text("political_party"),
  position: text("position"), // Their political position/role
  notes: text("notes"),
  order: integer("order").default(0),
  visible: boolean("visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const politicalViewsRelations = relations(politicalViews, ({ one }) => ({
  user: one(users, {
    fields: [politicalViews.userId],
    references: [users.id],
  }),
}));
