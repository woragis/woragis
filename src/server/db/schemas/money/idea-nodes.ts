import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  real,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { ideas } from "./ideas";
import { aiChats } from "./ai-chats";

export const ideaNodes = pgTable("idea_nodes", {
  id: uuid("id").primaryKey().defaultRandom(),
  ideaId: uuid("idea_id")
    .notNull()
    .references(() => ideas.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content"), // Node description/content
  type: text("type").default("default"), // node, note, task, etc.
  // Canvas position
  positionX: real("position_x").notNull().default(0),
  positionY: real("position_y").notNull().default(0),
  // Canvas dimensions
  width: real("width").default(200),
  height: real("height").default(100),
  // Visual properties
  color: text("color"), // hex color
  // Connections to other nodes (stored as array of node IDs)
  connections: jsonb("connections").$type<string[]>().default([]),
  visible: boolean("visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const ideaNodesRelations = relations(ideaNodes, ({ one, many }) => ({
  idea: one(ideas, {
    fields: [ideaNodes.ideaId],
    references: [ideas.id],
  }),
  aiChats: many(aiChats),
}));
