import { db } from "@/server/db";
import { projectTags, projectTagAssignments } from "@/server/db/schemas";
import { eq, and, like, sql, desc, asc } from "drizzle-orm";
import type {
  ProjectTagFilters,
  ProjectTagWithCount,
} from "@/types/project-tags";

export class ProjectTagRepository {
  async create(
    data: typeof projectTags.$inferInsert
  ): Promise<typeof projectTags.$inferSelect> {
    const [tag] = await db.insert(projectTags).values(data).returning();
    return tag;
  }

  async findById(id: string): Promise<typeof projectTags.$inferSelect | null> {
    const [tag] = await db
      .select()
      .from(projectTags)
      .where(eq(projectTags.id, id));
    return tag || null;
  }

  async findBySlug(
    slug: string
  ): Promise<typeof projectTags.$inferSelect | null> {
    const [tag] = await db
      .select()
      .from(projectTags)
      .where(eq(projectTags.slug, slug));
    return tag || null;
  }

  async update(
    id: string,
    data: Partial<typeof projectTags.$inferInsert>
  ): Promise<typeof projectTags.$inferSelect | null> {
    const [tag] = await db
      .update(projectTags)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(projectTags.id, id))
      .returning();
    return tag || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(projectTags).where(eq(projectTags.id, id));
    return result.rowCount > 0;
  }

  async search(
    filters: ProjectTagFilters,
    userId?: string
  ): Promise<(typeof projectTags.$inferSelect)[]> {
    const conditions = [];

    if (userId) {
      conditions.push(eq(projectTags.userId, userId));
    }

    if (filters.visible !== undefined) {
      conditions.push(eq(projectTags.visible, filters.visible));
    }

    if (filters.search) {
      conditions.push(
        sql`${projectTags.name} ILIKE ${`%${filters.search}%`} OR ${
          projectTags.description
        } ILIKE ${`%${filters.search}%`}`
      );
    }

    let query = db
      .select()
      .from(projectTags)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(projectTags.order), asc(projectTags.name));

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    return query;
  }

  async getVisibleTags(): Promise<(typeof projectTags.$inferSelect)[]> {
    return db
      .select()
      .from(projectTags)
      .where(eq(projectTags.visible, true))
      .orderBy(asc(projectTags.order), asc(projectTags.name));
  }

  async getTagsWithCount(userId?: string): Promise<ProjectTagWithCount[]> {
    const conditions = [];
    if (userId) {
      conditions.push(eq(projectTags.userId, userId));
    }

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
        projectCount: sql<number>`COALESCE(COUNT(${projectTagAssignments.projectId}), 0)`,
      })
      .from(projectTags)
      .leftJoin(
        projectTagAssignments,
        eq(projectTags.id, projectTagAssignments.tagId)
      )
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(projectTags.id)
      .orderBy(asc(projectTags.order), asc(projectTags.name));

    return result;
  }

  async updateOrder(tagOrders: { id: string; order: number }[]): Promise<void> {
    for (const { id, order } of tagOrders) {
      await db
        .update(projectTags)
        .set({ order, updatedAt: new Date() })
        .where(eq(projectTags.id, id));
    }
  }

  async getPopularTags(limit?: number): Promise<ProjectTagWithCount[]> {
    const query = db
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
        projectCount: sql<number>`COUNT(${projectTagAssignments.projectId})`,
      })
      .from(projectTags)
      .innerJoin(
        projectTagAssignments,
        eq(projectTags.id, projectTagAssignments.tagId)
      )
      .where(eq(projectTags.visible, true))
      .groupBy(projectTags.id)
      .orderBy(desc(sql`COUNT(${projectTagAssignments.projectId})`));

    if (limit) {
      return query.limit(limit);
    }

    return query;
  }
}
