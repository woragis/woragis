import {
  pgTable,
  text,
  boolean,
  timestamp,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";

export const instrumentKnowledgeLevel = pgEnum("instrument_knowledge_level", [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
]);

export const instrumentLearningStatus = pgEnum("instrument_learning_status", [
  "want_to_learn",
  "learning",
  "learned",
  "not_interested",
]);

export const instruments = pgTable("instruments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  knowledgeLevel: instrumentKnowledgeLevel("knowledge_level"),
  learningStatus: instrumentLearningStatus("learning_status").notNull(),
  yearsOfExperience: text("years_of_experience"),
  description: text("description"),
  visible: boolean("visible").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Instrument = typeof instruments.$inferSelect;
export type NewInstrument = typeof instruments.$inferInsert;
