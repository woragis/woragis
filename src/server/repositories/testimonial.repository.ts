import { eq, desc, asc, and, like, sql } from "drizzle-orm";
import { db } from "../db";
import { testimonials } from "../db/schemas";
import type {
  Testimonial,
  NewTestimonial,
  TestimonialOrderUpdate,
  TestimonialFilters,
} from "@/types";

export class TestimonialRepository {
  // Basic CRUD operations
  async findAll(userId?: string): Promise<Testimonial[]> {
    const query = db.select().from(testimonials);
    if (userId) {
      query.where(eq(testimonials.userId, userId));
    }
    return await query.orderBy(asc(testimonials.order));
  }

  async findVisible(userId?: string): Promise<Testimonial[]> {
    const conditions = [eq(testimonials.visible, true)];
    if (userId) {
      conditions.push(eq(testimonials.userId, userId));
    }
    return await db
      .select()
      .from(testimonials)
      .where(and(...conditions))
      .orderBy(asc(testimonials.order));
  }

  async findPublic(): Promise<Testimonial[]> {
    return await db
      .select()
      .from(testimonials)
      .where(and(eq(testimonials.visible, true), eq(testimonials.public, true)))
      .orderBy(asc(testimonials.order));
  }

  async findFeatured(
    limit: number = 3,
    userId?: string
  ): Promise<Testimonial[]> {
    const conditions = [eq(testimonials.featured, true)];
    if (userId) {
      conditions.push(eq(testimonials.userId, userId));
    }
    return await db
      .select()
      .from(testimonials)
      .where(and(...conditions))
      .orderBy(asc(testimonials.order))
      .limit(limit);
  }

  async findPublicFeatured(limit: number = 3): Promise<Testimonial[]> {
    return await db
      .select()
      .from(testimonials)
      .where(
        and(
          eq(testimonials.featured, true),
          eq(testimonials.visible, true),
          eq(testimonials.public, true)
        )
      )
      .orderBy(asc(testimonials.order))
      .limit(limit);
  }

  async findById(id: string, userId?: string): Promise<Testimonial | null> {
    const conditions = [eq(testimonials.id, id)];
    if (userId) {
      conditions.push(eq(testimonials.userId, userId));
    }
    const result = await db
      .select()
      .from(testimonials)
      .where(and(...conditions));
    return result[0] || null;
  }

  async findPublicById(id: string): Promise<Testimonial | null> {
    const result = await db
      .select()
      .from(testimonials)
      .where(
        and(
          eq(testimonials.id, id),
          eq(testimonials.visible, true),
          eq(testimonials.public, true)
        )
      );
    return result[0] || null;
  }

  async create(testimonial: NewTestimonial): Promise<Testimonial> {
    const result = await db
      .insert(testimonials)
      .values(testimonial)
      .returning();
    return result[0];
  }

  async update(
    id: string,
    testimonial: Partial<NewTestimonial>,
    userId?: string
  ): Promise<Testimonial | null> {
    const conditions = [eq(testimonials.id, id)];
    if (userId) {
      conditions.push(eq(testimonials.userId, userId));
    }
    const result = await db
      .update(testimonials)
      .set({ ...testimonial, updatedAt: new Date() })
      .where(and(...conditions))
      .returning();
    return result[0] || null;
  }

  async delete(id: string, userId?: string): Promise<void> {
    const conditions = [eq(testimonials.id, id)];
    if (userId) {
      conditions.push(eq(testimonials.userId, userId));
    }
    await db.delete(testimonials).where(and(...conditions));
  }

  // Advanced operations
  async updateOrder(
    testimonialOrders: TestimonialOrderUpdate[],
    userId?: string
  ): Promise<void> {
    const promises = testimonialOrders.map(({ id, order }) => {
      const conditions = [eq(testimonials.id, id)];
      if (userId) {
        conditions.push(eq(testimonials.userId, userId));
      }
      return db
        .update(testimonials)
        .set({ order, updatedAt: new Date() })
        .where(and(...conditions));
    });
    await Promise.all(promises);
  }

  async toggleVisibility(
    id: string,
    userId?: string
  ): Promise<Testimonial | null> {
    const testimonial = await this.findById(id, userId);
    if (!testimonial) return null;

    return await this.update(id, { visible: !testimonial.visible }, userId);
  }

  async toggleFeatured(
    id: string,
    userId?: string
  ): Promise<Testimonial | null> {
    const testimonial = await this.findById(id, userId);
    if (!testimonial) return null;

    return await this.update(id, { featured: !testimonial.featured }, userId);
  }

  async search(
    filters: TestimonialFilters,
    userId?: string
  ): Promise<Testimonial[]> {
    const conditions = [];

    if (userId) {
      conditions.push(eq(testimonials.userId, userId));
    }

    if (filters.featured !== undefined) {
      conditions.push(eq(testimonials.featured, filters.featured));
    }

    if (filters.visible !== undefined) {
      conditions.push(eq(testimonials.visible, filters.visible));
    }

    if (filters.public !== undefined) {
      conditions.push(eq(testimonials.public, filters.public));
    }

    if (filters.rating !== undefined) {
      conditions.push(eq(testimonials.rating, filters.rating));
    }

    if (filters.search) {
      conditions.push(
        and(
          like(testimonials.name, `%${filters.search}%`),
          like(testimonials.content, `%${filters.search}%`),
          like(testimonials.company, `%${filters.search}%`)
        )
      );
    }

    let query = db.select().from(testimonials);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    query = query.orderBy(asc(testimonials.order)) as any;

    if (filters.limit !== undefined) {
      query = query.limit(filters.limit) as any;
    }

    if (filters.offset !== undefined) {
      query = query.offset(filters.offset) as any;
    }

    return await query;
  }

  // Statistics
  async getAverageRating(userId?: string): Promise<number> {
    const conditions = [eq(testimonials.visible, true)];
    if (userId) {
      conditions.push(eq(testimonials.userId, userId));
    }

    const result = await db
      .select({ avgRating: sql<number>`avg(${testimonials.rating})` })
      .from(testimonials)
      .where(and(...conditions));

    return result[0]?.avgRating || 0;
  }

  async getTotalCount(userId?: string): Promise<number> {
    const conditions = [];
    if (userId) {
      conditions.push(eq(testimonials.userId, userId));
    }

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(testimonials)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return result[0]?.count || 0;
  }
}
