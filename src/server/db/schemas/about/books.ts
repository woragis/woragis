import {
  pgTable,
  text,
  uuid,
  timestamp,
  boolean,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "../auth";

// Enum for book status
export const bookStatusEnum = pgEnum("book_status", [
  "want_to_read",
  "reading",
  "completed",
  "dropped",
  "on_hold",
]);

export const bookList = pgTable("book_list", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  author: text("author").notNull(),
  description: text("description"),
  status: bookStatusEnum("status").notNull().default("want_to_read"),
  isbn: text("isbn"),
  coverImage: text("cover_image"),
  genres: text("genres"), // JSON array of genres
  pages: integer("pages"),
  currentPage: integer("current_page").default(0),
  rating: integer("rating"), // 1-10 rating
  notes: text("notes"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  plannedReadAt: timestamp("planned_read_at"), // When planning to read
  order: integer("order").default(0),
  visible: boolean("visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const bookListRelations = relations(bookList, ({ one }) => ({
  user: one(users, {
    fields: [bookList.userId],
    references: [users.id],
  }),
}));
