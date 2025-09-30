import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { ideaNodes } from "./idea-nodes";
import { users } from "../auth";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export const aiChats = pgTable("ai_chats", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  ideaNodeId: uuid("idea_node_id")
    .notNull()
    .references(() => ideaNodes.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  // Chat messages stored as JSON array
  messages: jsonb("messages").$type<ChatMessage[]>().notNull().default([]),
  // AI agent/model configuration
  agent: text("agent").notNull().default("gpt-4"), // gpt-4, gpt-3.5-turbo, claude, etc.
  model: text("model"), // specific model version
  systemPrompt: text("system_prompt"), // custom system prompt
  temperature: text("temperature").default("0.7"), // stored as text to preserve precision
  maxTokens: text("max_tokens"), // max tokens per response
  visible: boolean("visible").default(true),
  archived: boolean("archived").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const aiChatsRelations = relations(aiChats, ({ one }) => ({
  user: one(users, {
    fields: [aiChats.userId],
    references: [users.id],
  }),
  ideaNode: one(ideaNodes, {
    fields: [aiChats.ideaNodeId],
    references: [ideaNodes.id],
  }),
}));
