import { eq, desc, asc, and, like, sql } from "drizzle-orm";
import { db } from "../db";
import {
  projects,
  projectTagAssignments,
  projectFrameworks,
  projectTags,
  frameworks,
} from "../db/schemas";
import type {
  Project,
  NewProject,
  ProjectOrderUpdate,
  ProjectFilters,
  ProjectWithRelations,
  ProjectTag,
  Framework,
} from "@/types";

export class ProjectRepository {
  // Basic CRUD operations
  async findAll(userId?: string): Promise<Project[]> {
    const query = db.select().from(projects);
    if (userId) {
      query.where(eq(projects.userId, userId));
    }
    return await query.orderBy(asc(projects.order));
  }

  async findVisible(userId?: string): Promise<Project[]> {
    const conditions = [eq(projects.visible, true)];
    if (userId) {
      conditions.push(eq(projects.userId, userId));
    }
    return await db
      .select()
      .from(projects)
      .where(and(...conditions))
      .orderBy(asc(projects.order));
  }

  async findPublic(): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(and(eq(projects.visible, true), eq(projects.public, true)))
      .orderBy(asc(projects.order));
  }

  async findFeatured(limit: number = 3, userId?: string): Promise<Project[]> {
    const conditions = [eq(projects.featured, true)];
    if (userId) {
      conditions.push(eq(projects.userId, userId));
    }
    return await db
      .select()
      .from(projects)
      .where(and(...conditions))
      .orderBy(asc(projects.order))
      .limit(limit);
  }

  async findPublicFeatured(limit: number = 3): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.featured, true),
          eq(projects.visible, true),
          eq(projects.public, true)
        )
      )
      .orderBy(asc(projects.order))
      .limit(limit);
  }

  async findById(id: string, userId?: string): Promise<Project | null> {
    const conditions = [eq(projects.id, id)];
    if (userId) {
      conditions.push(eq(projects.userId, userId));
    }
    const result = await db
      .select()
      .from(projects)
      .where(and(...conditions));
    return result[0] || null;
  }

  async findPublicById(id: string): Promise<Project | null> {
    const result = await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.id, id),
          eq(projects.visible, true),
          eq(projects.public, true)
        )
      );
    return result[0] || null;
  }

  async create(project: NewProject): Promise<Project> {
    const result = await db.insert(projects).values(project).returning();
    return result[0];
  }

  async update(
    id: string,
    project: Partial<NewProject>,
    userId?: string
  ): Promise<Project | null> {
    const conditions = [eq(projects.id, id)];
    if (userId) {
      conditions.push(eq(projects.userId, userId));
    }
    const result = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(and(...conditions))
      .returning();
    return result[0] || null;
  }

  async delete(id: string, userId?: string): Promise<void> {
    const conditions = [eq(projects.id, id)];
    if (userId) {
      conditions.push(eq(projects.userId, userId));
    }
    await db.delete(projects).where(and(...conditions));
  }

  // Advanced operations
  async updateOrder(
    projectOrders: ProjectOrderUpdate[],
    userId?: string
  ): Promise<void> {
    const promises = projectOrders.map(({ id, order }) => {
      const conditions = [eq(projects.id, id)];
      if (userId) {
        conditions.push(eq(projects.userId, userId));
      }
      return db
        .update(projects)
        .set({ order, updatedAt: new Date() })
        .where(and(...conditions));
    });
    await Promise.all(promises);
  }

  async toggleVisibility(id: string, userId?: string): Promise<Project | null> {
    const project = await this.findById(id, userId);
    if (!project) return null;

    return await this.update(id, { visible: !project.visible }, userId);
  }

  async toggleFeatured(id: string, userId?: string): Promise<Project | null> {
    const project = await this.findById(id, userId);
    if (!project) return null;

    return await this.update(id, { featured: !project.featured }, userId);
  }

  async search(filters: ProjectFilters, userId?: string): Promise<Project[]> {
    const conditions = [];

    if (userId) {
      conditions.push(eq(projects.userId, userId));
    }

    if (filters.featured !== undefined) {
      conditions.push(eq(projects.featured, filters.featured));
    }

    if (filters.visible !== undefined) {
      conditions.push(eq(projects.visible, filters.visible));
    }

    if (filters.search) {
      conditions.push(
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
      conditions.push(like(projects.technologies, `%${techFilter}%`));
    }

    let query = db.select().from(projects);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
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
  async findWithRelations(
    id: string,
    userId?: string
  ): Promise<ProjectWithRelations | null> {
    const project = await this.findById(id, userId);
    if (!project) return null;

    const [projectTags, projectFrameworks] = await Promise.all([
      this.getProjectTags(id),
      this.getProjectFrameworks(id),
    ]);

    return {
      ...project,
      tags: projectTags,
      frameworks: projectFrameworks,
    };
  }

  async findPublicWithRelations(
    id: string
  ): Promise<ProjectWithRelations | null> {
    const project = await this.findPublicById(id);
    if (!project) return null;

    const [projectTags, projectFrameworks] = await Promise.all([
      this.getProjectTags(id),
      this.getProjectFrameworks(id),
    ]);

    return {
      ...project,
      tags: projectTags,
      frameworks: projectFrameworks,
    };
  }

  async getProjectTags(projectId: string): Promise<ProjectTag[]> {
    const result = await db
      .select({
        id: projectTags.id,
        userId: projectTags.userId,
        name: projectTags.name,
        slug: projectTags.slug,
        description: projectTags.description,
        color: projectTags.color,
        visible: projectTags.visible,
        order: projectTags.order,
        createdAt: projectTags.createdAt,
        updatedAt: projectTags.updatedAt,
      })
      .from(projectTagAssignments)
      .innerJoin(projectTags, eq(projectTagAssignments.tagId, projectTags.id))
      .where(eq(projectTagAssignments.projectId, projectId));

    return result;
  }

  async getProjectFrameworks(projectId: string): Promise<Framework[]> {
    const result = await db
      .select({
        id: frameworks.id,
        userId: frameworks.userId,
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

    await db.insert(projectTagAssignments).values(values);
  }

  async removeTag(projectId: string, tagId: string): Promise<void> {
    await db
      .delete(projectTagAssignments)
      .where(
        and(
          eq(projectTagAssignments.projectId, projectId),
          eq(projectTagAssignments.tagId, tagId)
        )
      );
  }

  async updateTags(projectId: string, tagIds: string[]): Promise<void> {
    // Remove existing tags
    await db
      .delete(projectTagAssignments)
      .where(eq(projectTagAssignments.projectId, projectId));

    // Add new tags
    await this.assignTags(projectId, tagIds);
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
