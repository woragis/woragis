import { db } from "@/server/db";
import { blogTags, blogPostTags } from "@/server/db/schemas";
import { eq, and, like, sql, desc, asc } from "drizzle-orm";
import type { BlogTagFilters, BlogTagWithCount } from "@/types/blog-tags";

export class BlogTagRepository {
  async create(
    data: typeof blogTags.$inferInsert
  ): Promise<typeof blogTags.$inferSelect> {
    const [tag] = await db.insert(blogTags).values(data).returning();
    return tag;
  }

  async findById(id: string): Promise<typeof blogTags.$inferSelect | null> {
    const [tag] = await db.select().from(blogTags).where(eq(blogTags.id, id));
    return tag || null;
  }

  async findBySlug(slug: string): Promise<typeof blogTags.$inferSelect | null> {
    const [tag] = await db
      .select()
      .from(blogTags)
      .where(eq(blogTags.slug, slug));
    return tag || null;
  }

  async update(
    id: string,
    data: Partial<typeof blogTags.$inferInsert>
  ): Promise<typeof blogTags.$inferSelect | null> {
    const [tag] = await db
      .update(blogTags)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(blogTags.id, id))
      .returning();
    return tag || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(blogTags).where(eq(blogTags.id, id));
    return result.rowCount > 0;
  }

  async search(
    filters: BlogTagFilters,
    userId?: string
  ): Promise<(typeof blogTags.$inferSelect)[]> {
    const conditions = [];

    if (userId) {
      conditions.push(eq(blogTags.userId, userId));
    }

    if (filters.visible !== undefined) {
      conditions.push(eq(blogTags.visible, filters.visible));
    }

    if (filters.search) {
      conditions.push(
        sql`${blogTags.name} ILIKE ${`%${filters.search}%`} OR ${
          blogTags.description
        } ILIKE ${`%${filters.search}%`}`
      );
    }

    let query = db
      .select()
      .from(blogTags)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(blogTags.order), asc(blogTags.name));

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    return query;
  }

  async getVisibleTags(): Promise<(typeof blogTags.$inferSelect)[]> {
    return db
      .select()
      .from(blogTags)
      .where(eq(blogTags.visible, true))
      .orderBy(asc(blogTags.order), asc(blogTags.name));
  }

  async getTagsWithCount(userId?: string): Promise<BlogTagWithCount[]> {
    const conditions = [];
    if (userId) {
      conditions.push(eq(blogTags.userId, userId));
    }

    const result = await db
      .select({
        id: blogTags.id,
        userId: blogTags.userId,
        name: blogTags.name,
        slug: blogTags.slug,
        description: blogTags.description,
        color: blogTags.color,
        visible: blogTags.visible,
        order: blogTags.order,
        createdAt: blogTags.createdAt,
        updatedAt: blogTags.updatedAt,
        postCount: sql<number>`COALESCE(COUNT(${blogPostTags.blogPostId}), 0)`,
      })
      .from(blogTags)
      .leftJoin(blogPostTags, eq(blogTags.id, blogPostTags.tagId))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(blogTags.id)
      .orderBy(asc(blogTags.order), asc(blogTags.name));

    return result;
  }

  async updateOrder(tagOrders: { id: string; order: number }[]): Promise<void> {
    for (const { id, order } of tagOrders) {
      await db
        .update(blogTags)
        .set({ order, updatedAt: new Date() })
        .where(eq(blogTags.id, id));
    }
  }

  async getPopularTags(limit?: number): Promise<BlogTagWithCount[]> {
    const query = db
      .select({
        id: blogTags.id,
        userId: blogTags.userId,
        name: blogTags.name,
        slug: blogTags.slug,
        description: blogTags.description,
        color: blogTags.color,
        visible: blogTags.visible,
        order: blogTags.order,
        createdAt: blogTags.createdAt,
        updatedAt: blogTags.updatedAt,
        postCount: sql<number>`COUNT(${blogPostTags.blogPostId})`,
      })
      .from(blogTags)
      .innerJoin(blogPostTags, eq(blogTags.id, blogPostTags.tagId))
      .where(eq(blogTags.visible, true))
      .groupBy(blogTags.id)
      .orderBy(desc(sql`COUNT(${blogPostTags.blogPostId})`));

    if (limit) {
      return query.limit(limit);
    }

    return query;
  }
}
