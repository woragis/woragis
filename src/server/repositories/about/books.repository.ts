import { eq, desc, asc, and, like } from "drizzle-orm";
import { db } from "../../db";
import { bookList } from "../../db/schemas";
import type { Book, NewBook, BookFilters, BookStatus } from "@/types";

export class BookRepository {
  // Basic CRUD operations
  async findAll(userId?: string): Promise<Book[]> {
    const query = db.select().from(bookList) as any;
    if (userId) {
      query.where(eq(bookList.userId, userId));
    }
    return await query.orderBy(asc(bookList.order), asc(bookList.title));
  }

  async findVisible(userId?: string): Promise<Book[]> {
    const conditions = [eq(bookList.visible, true)];
    if (userId) {
      conditions.push(eq(bookList.userId, userId));
    }
    return await db
      .select()
      .from(bookList)
      .where(and(...conditions))
      .orderBy(asc(bookList.order), asc(bookList.title));
  }

  async findByStatus(status: BookStatus, userId?: string): Promise<Book[]> {
    const conditions = [eq(bookList.status, status)];
    if (userId) {
      conditions.push(eq(bookList.userId, userId));
    }
    return await db
      .select()
      .from(bookList)
      .where(and(...conditions))
      .orderBy(asc(bookList.order), asc(bookList.title));
  }

  async findById(id: string, userId?: string): Promise<Book | null> {
    const conditions = [eq(bookList.id, id)];
    if (userId) {
      conditions.push(eq(bookList.userId, userId));
    }
    const result = await db
      .select()
      .from(bookList)
      .where(and(...conditions));
    return result[0] || null;
  }

  async create(book: NewBook): Promise<Book> {
    const result = await db.insert(bookList).values(book).returning();
    return result[0];
  }

  async update(
    id: string,
    book: Partial<NewBook>,
    userId?: string
  ): Promise<Book | null> {
    const conditions = [eq(bookList.id, id)];
    if (userId) {
      conditions.push(eq(bookList.userId, userId));
    }
    const result = await db
      .update(bookList)
      .set({ ...book, updatedAt: new Date() })
      .where(and(...conditions))
      .returning();
    return result[0] || null;
  }

  async delete(id: string, userId?: string): Promise<void> {
    const conditions = [eq(bookList.id, id)];
    if (userId) {
      conditions.push(eq(bookList.userId, userId));
    }
    await db.delete(bookList).where(and(...conditions));
  }

  // Search and filtering
  async search(filters: BookFilters, userId?: string): Promise<Book[]> {
    const conditions = [];

    if (userId) {
      conditions.push(eq(bookList.userId, userId));
    }

    if (filters.visible !== undefined) {
      conditions.push(eq(bookList.visible, filters.visible));
    }

    if (filters.status) {
      conditions.push(eq(bookList.status, filters.status));
    }

    if (filters.search) {
      conditions.push(
        and(
          like(bookList.title, `%${filters.search}%`),
          like(bookList.author, `%${filters.search}%`)
        )
      );
    }

    let query = db.select().from(bookList) as any;

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    return await query.orderBy(asc(bookList.order), asc(bookList.title));
  }
}
