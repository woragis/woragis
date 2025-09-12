import { eq, desc, asc, and, like, sql } from "drizzle-orm";
import { db } from "../db";
import {
  projects,
  projectTags,
  projectCategories,
  projectLanguages,
  projectFrameworks,
} from "../db/schemas";
import { tags, categories, languages, frameworks } from "../db/schemas";
import type {
  Project,
  NewProject,
  ProjectOrderUpdate,
  ProjectFilters,
  ProjectWithRelations,
  Tag,
  Category,
  Language,
  Framework,
} from "@/types";

export class ProjectRepository {
  // Basic CRUD operations
  async findAll(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(asc(projects.order));
  }

  async findVisible(): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.visible, true))
      .orderBy(asc(projects.order));
  }

  async findFeatured(limit: number = 3): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.featured, true))
      .orderBy(asc(projects.order))
      .limit(limit);
  }

  async findById(id: string): Promise<Project | null> {
    const result = await db.select().from(projects).where(eq(projects.id, id));
    return result[0] || null;
  }

  async create(project: NewProject): Promise<Project> {
    const result = await db.insert(projects).values(project).returning();
    return result[0];
  }

  async update(
    id: string,
    project: Partial<NewProject>
  ): Promise<Project | null> {
    const result = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return result[0] || null;
  }

  async delete(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Advanced operations
  async updateOrder(projectOrders: ProjectOrderUpdate[]): Promise<void> {
    const promises = projectOrders.map(({ id, order }) =>
      db
        .update(projects)
        .set({ order, updatedAt: new Date() })
        .where(eq(projects.id, id))
    );
    await Promise.all(promises);
  }

  async toggleVisibility(id: string): Promise<Project | null> {
    const project = await this.findById(id);
    if (!project) return null;

    return await this.update(id, { visible: !project.visible });
  }

  async toggleFeatured(id: string): Promise<Project | null> {
    const project = await this.findById(id);
    if (!project) return null;

    return await this.update(id, { featured: !project.featured });
  }

  async search(filters: ProjectFilters): Promise<Project[]> {
    let query = db.select().from(projects);

    if (filters.featured !== undefined) {
      query = query.where(eq(projects.featured, filters.featured));
    }

    if (filters.visible !== undefined) {
      query = query.where(eq(projects.visible, filters.visible));
    }

    if (filters.search) {
      query = query.where(
        and(
          like(projects.title, `%${filters.search}%`),
          like(projects.description, `%${filters.search}%`)
        )
      );
    }

    if (filters.technologies && filters.technologies.length > 0) {
      // This would need a more complex query for JSON array search
      // For now, we'll implement a simple text search
      const techFilter = filters.technologies.join("|");
      query = query.where(like(projects.technologies, `%${techFilter}%`));
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    return await query.orderBy(asc(projects.order));
  }

  // Relations operations
  async findWithRelations(id: string): Promise<ProjectWithRelations | null> {
    const project = await this.findById(id);
    if (!project) return null;

    const [
      projectTags,
      projectCategories,
      projectLanguages,
      projectFrameworks,
    ] = await Promise.all([
      this.getProjectTags(id),
      this.getProjectCategories(id),
      this.getProjectLanguages(id),
      this.getProjectFrameworks(id),
    ]);

    return {
      ...project,
      tags: projectTags,
      categories: projectCategories,
      languages: projectLanguages,
      frameworks: projectFrameworks,
    };
  }

  async getProjectTags(projectId: string): Promise<Tag[]> {
    const result = await db
      .select({
        id: tags.id,
        name: tags.name,
        slug: tags.slug,
        description: tags.description,
        color: tags.color,
        visible: tags.visible,
        createdAt: tags.createdAt,
        updatedAt: tags.updatedAt,
      })
      .from(projectTags)
      .innerJoin(tags, eq(projectTags.tagId, tags.id))
      .where(eq(projectTags.projectId, projectId));

    return result;
  }

  async getProjectCategories(projectId: string): Promise<Category[]> {
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        icon: categories.icon,
        color: categories.color,
        order: categories.order,
        visible: categories.visible,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
      })
      .from(projectCategories)
      .innerJoin(categories, eq(projectCategories.categoryId, categories.id))
      .where(eq(projectCategories.projectId, projectId));

    return result;
  }

  async getProjectLanguages(projectId: string): Promise<Language[]> {
    const result = await db
      .select({
        id: languages.id,
        name: languages.name,
        slug: languages.slug,
        description: languages.description,
        icon: languages.icon,
        color: languages.color,
        website: languages.website,
        order: languages.order,
        visible: languages.visible,
        createdAt: languages.createdAt,
        updatedAt: languages.updatedAt,
      })
      .from(projectLanguages)
      .innerJoin(languages, eq(projectLanguages.languageId, languages.id))
      .where(eq(projectLanguages.projectId, projectId));

    return result;
  }

  async getProjectFrameworks(projectId: string): Promise<Framework[]> {
    const result = await db
      .select({
        id: frameworks.id,
        name: frameworks.name,
        slug: frameworks.slug,
        description: frameworks.description,
        icon: frameworks.icon,
        color: frameworks.color,
        website: frameworks.website,
        version: frameworks.version,
        order: frameworks.order,
        visible: frameworks.visible,
        createdAt: frameworks.createdAt,
        updatedAt: frameworks.updatedAt,
      })
      .from(projectFrameworks)
      .innerJoin(frameworks, eq(projectFrameworks.frameworkId, frameworks.id))
      .where(eq(projectFrameworks.projectId, projectId));

    return result;
  }

  // Tag relations
  async assignTags(projectId: string, tagIds: string[]): Promise<void> {
    if (tagIds.length === 0) return;

    const values = tagIds.map((tagId) => ({
      projectId,
      tagId,
    }));

    await db.insert(projectTags).values(values);
  }

  async removeTag(projectId: string, tagId: string): Promise<void> {
    await db
      .delete(projectTags)
      .where(
        and(eq(projectTags.projectId, projectId), eq(projectTags.tagId, tagId))
      );
  }

  async updateTags(projectId: string, tagIds: string[]): Promise<void> {
    // Remove existing tags
    await db.delete(projectTags).where(eq(projectTags.projectId, projectId));

    // Add new tags
    await this.assignTags(projectId, tagIds);
  }

  // Category relations
  async assignCategories(
    projectId: string,
    categoryIds: string[]
  ): Promise<void> {
    if (categoryIds.length === 0) return;

    const values = categoryIds.map((categoryId) => ({
      projectId,
      categoryId,
    }));

    await db.insert(projectCategories).values(values);
  }

  async removeCategory(projectId: string, categoryId: string): Promise<void> {
    await db
      .delete(projectCategories)
      .where(
        and(
          eq(projectCategories.projectId, projectId),
          eq(projectCategories.categoryId, categoryId)
        )
      );
  }

  async updateCategories(
    projectId: string,
    categoryIds: string[]
  ): Promise<void> {
    // Remove existing categories
    await db
      .delete(projectCategories)
      .where(eq(projectCategories.projectId, projectId));

    // Add new categories
    await this.assignCategories(projectId, categoryIds);
  }

  // Language relations
  async assignLanguages(
    projectId: string,
    languageAssignments: { languageId: string; proficiency?: string }[]
  ): Promise<void> {
    if (languageAssignments.length === 0) return;

    const values = languageAssignments.map(({ languageId, proficiency }) => ({
      projectId,
      languageId,
      proficiency,
    }));

    await db.insert(projectLanguages).values(values);
  }

  async removeLanguage(projectId: string, languageId: string): Promise<void> {
    await db
      .delete(projectLanguages)
      .where(
        and(
          eq(projectLanguages.projectId, projectId),
          eq(projectLanguages.languageId, languageId)
        )
      );
  }

  async updateLanguages(
    projectId: string,
    languageAssignments: { languageId: string; proficiency?: string }[]
  ): Promise<void> {
    // Remove existing languages
    await db
      .delete(projectLanguages)
      .where(eq(projectLanguages.projectId, projectId));

    // Add new languages
    await this.assignLanguages(projectId, languageAssignments);
  }

  // Framework relations
  async assignFrameworks(
    projectId: string,
    frameworkAssignments: {
      frameworkId: string;
      version?: string;
      proficiency?: string;
    }[]
  ): Promise<void> {
    if (frameworkAssignments.length === 0) return;

    const values = frameworkAssignments.map(
      ({ frameworkId, version, proficiency }) => ({
        projectId,
        frameworkId,
        version,
        proficiency,
      })
    );

    await db.insert(projectFrameworks).values(values);
  }

  async removeFramework(projectId: string, frameworkId: string): Promise<void> {
    await db
      .delete(projectFrameworks)
      .where(
        and(
          eq(projectFrameworks.projectId, projectId),
          eq(projectFrameworks.frameworkId, frameworkId)
        )
      );
  }

  async updateFrameworks(
    projectId: string,
    frameworkAssignments: {
      frameworkId: string;
      version?: string;
      proficiency?: string;
    }[]
  ): Promise<void> {
    // Remove existing frameworks
    await db
      .delete(projectFrameworks)
      .where(eq(projectFrameworks.projectId, projectId));

    // Add new frameworks
    await this.assignFrameworks(projectId, frameworkAssignments);
  }
}
