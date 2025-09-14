import { db } from "@/server/db";
import {
  testimonialTags,
  testimonialTagAssignments,
} from "@/server/db/schemas";
import { eq, and, like, sql, desc, asc } from "drizzle-orm";
import type {
  TestimonialTagFilters,
  TestimonialTagWithCount,
} from "@/types/testimonial-tags";

export class TestimonialTagRepository {
  async create(
    data: typeof testimonialTags.$inferInsert
  ): Promise<typeof testimonialTags.$inferSelect> {
    const [tag] = await db.insert(testimonialTags).values(data).returning();
    return tag;
  }

  async findById(
    id: string
  ): Promise<typeof testimonialTags.$inferSelect | null> {
    const [tag] = await db
      .select()
      .from(testimonialTags)
      .where(eq(testimonialTags.id, id));
    return tag || null;
  }

  async findBySlug(
    slug: string
  ): Promise<typeof testimonialTags.$inferSelect | null> {
    const [tag] = await db
      .select()
      .from(testimonialTags)
      .where(eq(testimonialTags.slug, slug));
    return tag || null;
  }

  async update(
    id: string,
    data: Partial<typeof testimonialTags.$inferInsert>
  ): Promise<typeof testimonialTags.$inferSelect | null> {
    const [tag] = await db
      .update(testimonialTags)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(testimonialTags.id, id))
      .returning();
    return tag || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(testimonialTags)
      .where(eq(testimonialTags.id, id));
    return result.rowCount > 0;
  }

  async search(
    filters: TestimonialTagFilters,
    userId?: string
  ): Promise<(typeof testimonialTags.$inferSelect)[]> {
    const conditions = [];

    if (userId) {
      conditions.push(eq(testimonialTags.userId, userId));
    }

    if (filters.visible !== undefined) {
      conditions.push(eq(testimonialTags.visible, filters.visible));
    }

    if (filters.search) {
      conditions.push(
        sql`${testimonialTags.name} ILIKE ${`%${filters.search}%`} OR ${
          testimonialTags.description
        } ILIKE ${`%${filters.search}%`}`
      );
    }

    let query = db
      .select()
      .from(testimonialTags)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(testimonialTags.order), asc(testimonialTags.name));

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    return query;
  }

  async getVisibleTags(): Promise<(typeof testimonialTags.$inferSelect)[]> {
    return db
      .select()
      .from(testimonialTags)
      .where(eq(testimonialTags.visible, true))
      .orderBy(asc(testimonialTags.order), asc(testimonialTags.name));
  }

  async getTagsWithCount(userId?: string): Promise<TestimonialTagWithCount[]> {
    const conditions = [];
    if (userId) {
      conditions.push(eq(testimonialTags.userId, userId));
    }

    const result = await db
      .select({
        id: testimonialTags.id,
        userId: testimonialTags.userId,
        name: testimonialTags.name,
        slug: testimonialTags.slug,
        description: testimonialTags.description,
        color: testimonialTags.color,
        visible: testimonialTags.visible,
        order: testimonialTags.order,
        createdAt: testimonialTags.createdAt,
        updatedAt: testimonialTags.updatedAt,
        testimonialCount: sql<number>`COALESCE(COUNT(${testimonialTagAssignments.testimonialId}), 0)`,
      })
      .from(testimonialTags)
      .leftJoin(
        testimonialTagAssignments,
        eq(testimonialTags.id, testimonialTagAssignments.tagId)
      )
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(testimonialTags.id)
      .orderBy(asc(testimonialTags.order), asc(testimonialTags.name));

    return result;
  }

  async updateOrder(tagOrders: { id: string; order: number }[]): Promise<void> {
    for (const { id, order } of tagOrders) {
      await db
        .update(testimonialTags)
        .set({ order, updatedAt: new Date() })
        .where(eq(testimonialTags.id, id));
    }
  }

  async getPopularTags(limit?: number): Promise<TestimonialTagWithCount[]> {
    const query = db
      .select({
        id: testimonialTags.id,
        userId: testimonialTags.userId,
        name: testimonialTags.name,
        slug: testimonialTags.slug,
        description: testimonialTags.description,
        color: testimonialTags.color,
        visible: testimonialTags.visible,
        order: testimonialTags.order,
        createdAt: testimonialTags.createdAt,
        updatedAt: testimonialTags.updatedAt,
        testimonialCount: sql<number>`COUNT(${testimonialTagAssignments.testimonialId})`,
      })
      .from(testimonialTags)
      .innerJoin(
        testimonialTagAssignments,
        eq(testimonialTags.id, testimonialTagAssignments.tagId)
      )
      .where(eq(testimonialTags.visible, true))
      .groupBy(testimonialTags.id)
      .orderBy(desc(sql`COUNT(${testimonialTagAssignments.testimonialId})`));

    if (limit) {
      return query.limit(limit);
    }

    return query;
  }
}
