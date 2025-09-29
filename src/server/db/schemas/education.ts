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
import { users } from "./auth";

// Enum for education type
export const educationTypeEnum = pgEnum("education_type", [
  "degree",
  "certificate",
]);

// Enum for degree level (for degrees)
export const degreeLevelEnum = pgEnum("degree_level", [
  "bachelor",
  "master",
  "doctorate",
  "associate",
  "diploma",
]);

export const education = pgTable("education", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(), // e.g., "Bachelor of Computer Science", "AWS Certified Solutions Architect"
  institution: text("institution").notNull(), // University, Company, Organization
  description: text("description"),
  type: educationTypeEnum("type").notNull(), // degree or certificate
  degreeLevel: degreeLevelEnum("degree_level"), // Only for degrees
  fieldOfStudy: text("field_of_study"), // Computer Science, Business Administration, etc.
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  completionDate: timestamp("completion_date"),
  grade: text("grade"), // GPA, percentage, or letter grade
  credits: integer("credits"), // For degrees
  certificateId: text("certificate_id"), // Certificate number or ID
  issuer: text("issuer"), // For certificates - who issued it
  validityPeriod: text("validity_period"), // For certificates - how long it's valid
  pdfDocument: text("pdf_document"), // Path to uploaded PDF
  verificationUrl: text("verification_url"), // URL to verify the credential
  skills: text("skills"), // JSON array of skills gained
  order: integer("order").default(0),
  visible: boolean("visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const educationRelations = relations(education, ({ one }) => ({
  user: one(users, {
    fields: [education.userId],
    references: [users.id],
  }),
}));
