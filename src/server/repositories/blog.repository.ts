import { eq, desc, asc, and, like, sql, inArray } from "drizzle-orm";
import { db } from "../db";
import { blogPosts } from "../db/schemas";
import type {
  BlogPost,
  NewBlogPost,
  BlogPostOrderUpdate,
  BlogPostFilters,
} from "@/types";

export class BlogRepository {
  // Basic CRUD operations
  async findAll(userId?: string): Promise<BlogPost[]> {
    const query = db.select().from(blogPosts);
    if (userId) {
      query.where(eq(blogPosts.userId, userId));
    }
    return await query.orderBy(desc(blogPosts.createdAt));
  }

  async findVisible(userId?: string): Promise<BlogPost[]> {
    const conditions = [eq(blogPosts.visible, true)];
    if (userId) {
      conditions.push(eq(blogPosts.userId, userId));
    }
    return await db
      .select()
      .from(blogPosts)
      .where(and(...conditions))
      .orderBy(desc(blogPosts.createdAt));
  }

  async findPublished(): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.published, true),
          eq(blogPosts.visible, true),
          eq(blogPosts.public, true)
        )
      )
      .orderBy(desc(blogPosts.createdAt));
  }

  async findFeatured(limit: number = 3, userId?: string): Promise<BlogPost[]> {
    const conditions = [eq(blogPosts.featured, true)];
    if (userId) {
      conditions.push(eq(blogPosts.userId, userId));
    }
    return await db
      .select()
      .from(blogPosts)
      .where(and(...conditions))
      .orderBy(desc(blogPosts.createdAt))
      .limit(limit);
  }

  async findPublicFeatured(limit: number = 3): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.featured, true),
          eq(blogPosts.visible, true),
          eq(blogPosts.public, true),
          eq(blogPosts.published, true)
        )
      )
      .orderBy(desc(blogPosts.createdAt))
      .limit(limit);
  }

  async findPublicRecent(limit: number = 6): Promise<BlogPost[]> {
    return await db
      .select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.visible, true),
          eq(blogPosts.public, true),
          eq(blogPosts.published, true)
        )
      )
      .orderBy(desc(blogPosts.createdAt))
      .limit(limit);
  }

  async findById(id: string, userId?: string): Promise<BlogPost | null> {
    const conditions = [eq(blogPosts.id, id)];
    if (userId) {
      conditions.push(eq(blogPosts.userId, userId));
    }
    const result = await db
      .select()
      .from(blogPosts)
      .where(and(...conditions));
    return result[0] || null;
  }

  async findBySlug(slug: string, userId?: string): Promise<BlogPost | null> {
    const conditions = [eq(blogPosts.slug, slug)];
    if (userId) {
      conditions.push(eq(blogPosts.userId, userId));
    }
    const result = await db
      .select()
      .from(blogPosts)
      .where(and(...conditions));
    return result[0] || null;
  }

  async findPublicBySlug(slug: string): Promise<BlogPost | null> {
    const result = await db
      .select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.slug, slug),
          eq(blogPosts.visible, true),
          eq(blogPosts.public, true),
          eq(blogPosts.published, true)
        )
      );
    return result[0] || null;
  }

  async create(blogPost: NewBlogPost): Promise<BlogPost> {
    const result = await db.insert(blogPosts).values(blogPost).returning();
    return result[0];
  }

  async update(
    id: string,
    blogPost: Partial<NewBlogPost>,
    userId?: string
  ): Promise<BlogPost | null> {
    const conditions = [eq(blogPosts.id, id)];
    if (userId) {
      conditions.push(eq(blogPosts.userId, userId));
    }
    const result = await db
      .update(blogPosts)
      .set({ ...blogPost, updatedAt: new Date() })
      .where(and(...conditions))
      .returning();
    return result[0] || null;
  }

  async delete(id: string, userId?: string): Promise<void> {
    const conditions = [eq(blogPosts.id, id)];
    if (userId) {
      conditions.push(eq(blogPosts.userId, userId));
    }
    await db.delete(blogPosts).where(and(...conditions));
  }

  // Advanced operations
  async updateOrder(
    blogPostOrders: BlogPostOrderUpdate[],
    userId?: string
  ): Promise<void> {
    const promises = blogPostOrders.map(({ id, order }) => {
      const conditions = [eq(blogPosts.id, id)];
      if (userId) {
        conditions.push(eq(blogPosts.userId, userId));
      }
      return db
        .update(blogPosts)
        .set({ order, updatedAt: new Date() })
        .where(and(...conditions));
    });
    await Promise.all(promises);
  }

  async toggleVisibility(
    id: string,
    userId?: string
  ): Promise<BlogPost | null> {
    const blogPost = await this.findById(id, userId);
    if (!blogPost) return null;

    return await this.update(id, { visible: !blogPost.visible }, userId);
  }

  async toggleFeatured(id: string, userId?: string): Promise<BlogPost | null> {
    const blogPost = await this.findById(id, userId);
    if (!blogPost) return null;

    return await this.update(id, { featured: !blogPost.featured }, userId);
  }

  async togglePublished(id: string, userId?: string): Promise<BlogPost | null> {
    const blogPost = await this.findById(id, userId);
    if (!blogPost) return null;

    const published = !blogPost.published;
    const publishedAt = published ? new Date() : null;

    return await this.update(id, { published, publishedAt }, userId);
  }

  async incrementViewCount(id: string): Promise<void> {
    await db
      .update(blogPosts)
      .set({
        viewCount: sql`${blogPosts.viewCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, id));
  }

  async incrementLikeCount(id: string): Promise<void> {
    await db
      .update(blogPosts)
      .set({
        likeCount: sql`${blogPosts.likeCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, id));
  }

  async search(filters: BlogPostFilters, userId?: string): Promise<BlogPost[]> {
    const conditions = [];

    if (userId) {
      conditions.push(eq(blogPosts.userId, userId));
    }

    if (filters.published !== undefined) {
      conditions.push(eq(blogPosts.published, filters.published));
    }

    if (filters.featured !== undefined) {
      conditions.push(eq(blogPosts.featured, filters.featured));
    }

    if (filters.visible !== undefined) {
      conditions.push(eq(blogPosts.visible, filters.visible));
    }

    if (filters.public !== undefined) {
      conditions.push(eq(blogPosts.public, filters.public));
    }

    if (filters.category) {
      conditions.push(eq(blogPosts.category, filters.category));
    }

    if (filters.tags && filters.tags.length > 0) {
      // For JSON array search, we'll use a simple LIKE search for now
      const tagConditions = filters.tags.map((tag) =>
        like(blogPosts.tags, `%${tag}%`)
      );
      conditions.push(sql`${blogPosts.tags} ?| ${filters.tags}`);
    }

    if (filters.search) {
      conditions.push(
        and(
          like(blogPosts.title, `%${filters.search}%`),
          like(blogPosts.excerpt, `%${filters.search}%`),
          like(blogPosts.content, `%${filters.search}%`)
        )
      );
    }

    let query = db.select().from(blogPosts);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const sortBy = filters.sortBy || "createdAt";
    const sortOrder = filters.sortOrder || "desc";

    if (sortBy === "title") {
      query = query.orderBy(
        sortOrder === "asc" ? asc(blogPosts.title) : desc(blogPosts.title)
      );
    } else if (sortBy === "publishedAt") {
      // Use createdAt as fallback for publishedAt since it might be null
      query = query.orderBy(
        sortOrder === "asc"
          ? asc(blogPosts.createdAt)
          : desc(blogPosts.createdAt)
      );
    } else if (sortBy === "viewCount") {
      query = query.orderBy(
        sortOrder === "asc"
          ? asc(blogPosts.viewCount)
          : desc(blogPosts.viewCount)
      );
    } else if (sortBy === "updatedAt") {
      query = query.orderBy(
        sortOrder === "asc"
          ? asc(blogPosts.updatedAt)
          : desc(blogPosts.updatedAt)
      );
    } else {
      query = query.orderBy(
        sortOrder === "asc"
          ? asc(blogPosts.createdAt)
          : desc(blogPosts.createdAt)
      );
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    return await query;
  }

  // Statistics
  async getTotalCount(userId?: string): Promise<number> {
    const conditions = [];
    if (userId) {
      conditions.push(eq(blogPosts.userId, userId));
    }

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(blogPosts)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return result[0]?.count || 0;
  }

  async getPublishedCount(userId?: string): Promise<number> {
    const conditions = [eq(blogPosts.published, true)];
    if (userId) {
      conditions.push(eq(blogPosts.userId, userId));
    }

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(blogPosts)
      .where(and(...conditions));

    return result[0]?.count || 0;
  }

  async getTotalViews(userId?: string): Promise<number> {
    const conditions = [];
    if (userId) {
      conditions.push(eq(blogPosts.userId, userId));
    }

    const result = await db
      .select({ total: sql<number>`sum(${blogPosts.viewCount})` })
      .from(blogPosts)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return result[0]?.total || 0;
  }

  // Get categories and tags
  async getCategories(
    userId?: string
  ): Promise<{ name: string; count: number }[]> {
    const conditions = [];
    if (userId) {
      conditions.push(eq(blogPosts.userId, userId));
    }

    const result = await db
      .select({
        name: blogPosts.category,
        count: sql<number>`count(*)`,
      })
      .from(blogPosts)
      .where(
        and(
          conditions.length > 0 ? and(...conditions) : undefined,
          sql`${blogPosts.category} IS NOT NULL`
        )
      )
      .groupBy(blogPosts.category);

    return result.map((row) => ({
      name: row.name || "Uncategorized",
      count: row.count,
    }));
  }

  async getTags(userId?: string): Promise<{ name: string; count: number }[]> {
    // This is a simplified implementation
    // In a real app, you might want to normalize tags into a separate table
    const conditions = [];
    if (userId) {
      conditions.push(eq(blogPosts.userId, userId));
    }

    const result = await db
      .select({ tags: blogPosts.tags })
      .from(blogPosts)
      .where(
        and(
          conditions.length > 0 ? and(...conditions) : undefined,
          sql`${blogPosts.tags} IS NOT NULL`
        )
      );

    const tagCounts: { [key: string]: number } = {};
    result.forEach((row) => {
      if (row.tags) {
        try {
          const tags = JSON.parse(row.tags);
          tags.forEach((tag: string) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        } catch (error) {
          // Handle invalid JSON
        }
      }
    });

    return Object.entries(tagCounts).map(([name, count]) => ({
      name,
      count,
    }));
  }
}
