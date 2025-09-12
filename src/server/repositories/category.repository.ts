import { eq, desc, asc, and, like, sql } from "drizzle-orm";
import { db } from "../db";
import { categories, projectCategories } from "../db/schemas";
import type { Category, NewCategory, CategoryFilters } from "@/types";

export class CategoryRepository {
  // Basic CRUD operations
  async findAll(): Promise<Category[]> {
    return await db
      .select()
      .from(categories)
      .orderBy(asc(categories.order), asc(categories.name));
  }

  async findVisible(): Promise<Category[]> {
    return await db
      .select()
      .from(categories)
      .where(eq(categories.visible, true))
      .orderBy(asc(categories.order), asc(categories.name));
  }

  async findById(id: string): Promise<Category | null> {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));
    return result[0] || null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug));
    return result[0] || null;
  }

  async create(category: NewCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  async update(
    id: string,
    category: Partial<NewCategory>
  ): Promise<Category | null> {
    const result = await db
      .update(categories)
      .set({ ...category, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    return result[0] || null;
  }

  async delete(id: string): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Search and filtering
  async search(filters: CategoryFilters): Promise<Category[]> {
    let query = db.select().from(categories);

    if (filters.visible !== undefined) {
      query = query.where(eq(categories.visible, filters.visible));
    }

    if (filters.search) {
      query = query.where(like(categories.name, `%${filters.search}%`));
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
