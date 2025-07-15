import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

// --- Tables ---

export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }), // New: Soft delete timestamp
});

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }), // New
});

export const projectCategories = sqliteTable('project_categories', {
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.projectId, table.categoryId] }),
});

export const niches = sqliteTable('niches', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }), // New
});

export const nicheProjects = sqliteTable('niche_projects', {
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  nicheId: integer('nniche_id')
    .notNull()
    .references(() => niches.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.projectId, table.nicheId] }),
});

export const places = sqliteTable('places', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }), // New
});

// --- Relations (remain the same) ---
export const projectsRelations = relations(projects, ({ many, one }) => ({
  projectCategories: many(projectCategories),
  nicheProjects: many(nicheProjects),
  places: many(places),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  projectCategories: many(projectCategories),
}));

export const nichesRelations = relations(niches, ({ many }) => ({
  nicheProjects: many(nicheProjects),
}));

export const placesRelations = relations(places, ({ one }) => ({
  project: one(projects, {
    fields: [places.projectId],
    references: [projects.id],
  }),
}));

export const projectCategoriesRelations = relations(projectCategories, ({ one }) => ({
  project: one(projects, {
    fields: [projectCategories.projectId],
    references: [projects.id],
  }),
  category: one(categories, {
    fields: [projectCategories.categoryId],
    references: [categories.id],
  }),
}));

export const nicheProjectsRelations = relations(nicheProjects, ({ one }) => ({
  project: one(projects, {
    fields: [nicheProjects.projectId],
    references: [projects.id],
  }),
  niche: one(niches, {
    fields: [nicheProjects.nicheId],
    references: [niches.id],
  }),
}));
