import { eq, desc, asc, and, like, sql } from "drizzle-orm";
import { db } from "../db";
import { categories, projectCategories } from "../db/schemas";
import type { Category, NewCategory, CategoryFilters } from "@/types";

export class CategoryRepository {
  // Basic CRUD operations
  async findAll(userId?: string): Promise<Category[]> {
    const query = db.select().from(categories);
    if (userId) {
      query.where(eq(categories.userId, userId));
    }
    return await query.orderBy(asc(categories.order), asc(categories.name));
  }

  async findVisible(userId?: string): Promise<Category[]> {
    const conditions = [eq(categories.visible, true)];
    if (userId) {
      conditions.push(eq(categories.userId, userId));
    }
    return await db
      .select()
      .from(categories)
      .where(and(...conditions))
      .orderBy(asc(categories.order), asc(categories.name));
  }

  async findPublic(): Promise<Category[]> {
    return await db
      .select()
      .from(categories)
      .where(and(eq(categories.visible, true), eq(categories.public, true)))
      .orderBy(asc(categories.order), asc(categories.name));
  }

  async findById(id: string, userId?: string): Promise<Category | null> {
    const conditions = [eq(categories.id, id)];
    if (userId) {
      conditions.push(eq(categories.userId, userId));
    }
    const result = await db
      .select()
      .from(categories)
      .where(and(...conditions));
    return result[0] || null;
  }

  async findBySlug(slug: string, userId?: string): Promise<Category | null> {
    const conditions = [eq(categories.slug, slug)];
    if (userId) {
      conditions.push(eq(categories.userId, userId));
    }
    const result = await db
      .select()
      .from(categories)
      .where(and(...conditions));
    return result[0] || null;
  }

  async findPublicBySlug(slug: string): Promise<Category | null> {
    const result = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.slug, slug),
          eq(categories.visible, true),
          eq(categories.public, true)
        )
      );
    return result[0] || null;
  }

  async create(category: NewCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  async update(
    id: string,
    category: Partial<NewCategory>,
    userId?: string
  ): Promise<Category | null> {
    const conditions = [eq(categories.id, id)];
    if (userId) {
      conditions.push(eq(categories.userId, userId));
    }
    const result = await db
      .update(categories)
      .set({ ...category, updatedAt: new Date() })
      .where(and(...conditions))
      .returning();
    return result[0] || null;
  }

  async delete(id: string, userId?: string): Promise<void> {
    const conditions = [eq(categories.id, id)];
    if (userId) {
      conditions.push(eq(categories.userId, userId));
    }
    await db.delete(categories).where(and(...conditions));
  }

  // Search and filtering
  async search(filters: CategoryFilters, userId?: string): Promise<Category[]> {
    const conditions = [];

    if (userId) {
      conditions.push(eq(categories.userId, userId));
    }

    if (filters.visible !== undefined) {
      conditions.push(eq(categories.visible, filters.visible));
    }

    if (filters.search) {
      conditions.push(like(categories.name, `%${filters.search}%`));
    }

    let query = db.select().from(categories);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    return await query.orderBy(asc(categories.order), asc(categories.name));
  }

  // Project relations
  async getProjectCount(categoryId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(projectCategories)
      .where(eq(projectCategories.categoryId, categoryId));

    return result[0]?.count || 0;
  }

  async findWithProjectCount(
    categoryId: string
  ): Promise<{ category: Category; projectCount: number } | null> {
    const category = await this.findById(categoryId);
    if (!category) return null;

    const projectCount = await this.getProjectCount(categoryId);
    return { category, projectCount };
  }

  async findPopular(
    limit: number = 10
  ): Promise<Array<{ category: Category; projectCount: number }>> {
    const result = await db
      .select({
        category: categories,
        projectCount: sql<number>`count(${projectCategories.id})`,
      })
      .from(categories)
      .leftJoin(
        projectCategories,
        eq(categories.id, projectCategories.categoryId)
      )
      .groupBy(categories.id)
      .orderBy(desc(sql`count(${projectCategories.id})`))
      .limit(limit);

    return result.map(({ category, projectCount }) => ({
      category,
      projectCount,
    }));
  }

  // Ordering operations
  async updateOrder(
    categoryOrders: { id: string; order: number }[]
  ): Promise<void> {
    const promises = categoryOrders.map(({ id, order }) =>
      db
        .update(categories)
        .set({ order, updatedAt: new Date() })
        .where(eq(categories.id, id))
    );
    await Promise.all(promises);
  }
}
