import {
  pgTable,
  text,
  boolean,
  timestamp,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";

export const martialArtsKnowledgeLevel = pgEnum(
  "martial_arts_knowledge_level",
  ["beginner", "intermediate", "advanced", "expert"]
);

export const martialArtsLearningStatus = pgEnum(
  "martial_arts_learning_status",
  ["want_to_learn", "learning", "learned", "not_interested"]
);

export const martialArts = pgTable("martial_arts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  knowledgeLevel: martialArtsKnowledgeLevel("knowledge_level"),
  learningStatus: martialArtsLearningStatus("learning_status").notNull(),
  grade: text("grade"),
  belt: text("belt"),
  yearsOfExperience: text("years_of_experience"),
  description: text("description"),
  visible: boolean("visible").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type MartialArt = typeof martialArts.$inferSelect;
export type NewMartialArt = typeof martialArts.$inferInsert;
