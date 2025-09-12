import { eq, desc, asc, and, like, sql } from "drizzle-orm";
import { db } from "../db";
import { tags, projectTags } from "../db/schemas";
import type { Tag, NewTag, TagFilters } from "@/types";

export class TagRepository {
  // Basic CRUD operations
  async findAll(): Promise<Tag[]> {
    return await db.select().from(tags).orderBy(asc(tags.name));
  }

  async findVisible(): Promise<Tag[]> {
    return await db
      .select()
      .from(tags)
      .where(eq(tags.visible, true))
      .orderBy(asc(tags.name));
  }

  async findById(id: string): Promise<Tag | null> {
    const result = await db.select().from(tags).where(eq(tags.id, id));
    return result[0] || null;
  }

  async findBySlug(slug: string): Promise<Tag | null> {
    const result = await db.select().from(tags).where(eq(tags.slug, slug));
    return result[0] || null;
  }

  async create(tag: NewTag): Promise<Tag> {
    const result = await db.insert(tags).values(tag).returning();
    return result[0];
  }

  async update(id: string, tag: Partial<NewTag>): Promise<Tag | null> {
    const result = await db
      .update(tags)
      .set({ ...tag, updatedAt: new Date() })
      .where(eq(tags.id, id))
      .returning();
    return result[0] || null;
  }

  async delete(id: string): Promise<void> {
    await db.delete(tags).where(eq(tags.id, id));
  }

  // Search and filtering
  async search(filters: TagFilters): Promise<Tag[]> {
    let query = db.select().from(tags);

    if (filters.visible !== undefined) {
      query = query.where(eq(tags.visible, filters.visible));
    }

    if (filters.search) {
      query = query.where(like(tags.name, `%${filters.search}%`));
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
