import { eq, desc, asc, and, like, sql } from "drizzle-orm";
import { db } from "../db";
import { tags, projectTags } from "../db/schemas";
import type { Tag, NewTag, TagFilters } from "@/types";

export class TagRepository {
  // Basic CRUD operations
  async findAll(userId?: string): Promise<Tag[]> {
    const query = db.select().from(tags);
    if (userId) {
      query.where(eq(tags.userId, userId));
    }
    return await query.orderBy(asc(tags.name));
  }

  async findVisible(userId?: string): Promise<Tag[]> {
    const conditions = [eq(tags.visible, true)];
    if (userId) {
      conditions.push(eq(tags.userId, userId));
    }
    return await db
      .select()
      .from(tags)
      .where(and(...conditions))
      .orderBy(asc(tags.name));
  }

  async findById(id: string, userId?: string): Promise<Tag | null> {
    const conditions = [eq(tags.id, id)];
    if (userId) {
      conditions.push(eq(tags.userId, userId));
    }
    const result = await db
      .select()
      .from(tags)
      .where(and(...conditions));
    return result[0] || null;
  }

  async findBySlug(slug: string, userId?: string): Promise<Tag | null> {
    const conditions = [eq(tags.slug, slug)];
    if (userId) {
      conditions.push(eq(tags.userId, userId));
    }
    const result = await db
      .select()
      .from(tags)
      .where(and(...conditions));
    return result[0] || null;
  }

  async create(tag: NewTag): Promise<Tag> {
    const result = await db.insert(tags).values(tag).returning();
    return result[0];
  }

  async update(
    id: string,
    tag: Partial<NewTag>,
    userId?: string
  ): Promise<Tag | null> {
    const conditions = [eq(tags.id, id)];
    if (userId) {
      conditions.push(eq(tags.userId, userId));
    }
    const result = await db
      .update(tags)
      .set({ ...tag, updatedAt: new Date() })
      .where(and(...conditions))
      .returning();
    return result[0] || null;
  }

  async delete(id: string, userId?: string): Promise<void> {
    const conditions = [eq(tags.id, id)];
    if (userId) {
      conditions.push(eq(tags.userId, userId));
    }
    await db.delete(tags).where(and(...conditions));
  }

  // Search and filtering
  async search(filters: TagFilters, userId?: string): Promise<Tag[]> {
    const conditions = [];

    if (userId) {
      conditions.push(eq(tags.userId, userId));
    }

    if (filters.visible !== undefined) {
      conditions.push(eq(tags.visible, filters.visible));
    }

    if (filters.search) {
      conditions.push(like(tags.name, `%${filters.search}%`));
    }

    let query = db.select().from(tags);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    return await query.orderBy(asc(tags.name));
  }

  // Project relations
  async getProjectCount(tagId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(projectTags)
      .where(eq(projectTags.tagId, tagId));

    return result[0]?.count || 0;
  }

  async findWithProjectCount(
    tagId: string
  ): Promise<{ tag: Tag; projectCount: number } | null> {
    const tag = await this.findById(tagId);
    if (!tag) return null;

    const projectCount = await this.getProjectCount(tagId);
    return { tag, projectCount };
  }

  async findPopular(
    limit: number = 10
  ): Promise<Array<{ tag: Tag; projectCount: number }>> {
    const result = await db
      .select({
        tag: tags,
        projectCount: sql<number>`count(${projectTags.id})`,
      })
      .from(tags)
      .leftJoin(projectTags, eq(tags.id, projectTags.tagId))
      .groupBy(tags.id)
      .orderBy(desc(sql`count(${projectTags.id})`))
      .limit(limit);

    return result.map(({ tag, projectCount }) => ({ tag, projectCount }));
  }
}
