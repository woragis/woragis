import {
  pgTable,
  text,
  boolean,
  timestamp,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";

export const languageProficiencyLevel = pgEnum("language_proficiency_level", [
  "beginner",
  "elementary",
  "intermediate",
  "upper_intermediate",
  "advanced",
  "native",
]);

export const languageLearningStatus = pgEnum("language_learning_status", [
  "want_to_learn",
  "learning",
  "learned",
  "not_interested",
]);

export const languages = pgTable("languages", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  proficiencyLevel: languageProficiencyLevel("proficiency_level"),
  learningStatus: languageLearningStatus("learning_status").notNull(),
  yearsOfExperience: text("years_of_experience"),
  description: text("description"),
  visible: boolean("visible").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Language = typeof languages.$inferSelect;
export type NewLanguage = typeof languages.$inferInsert;
