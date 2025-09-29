import { eq, and, desc, asc, like, sql, count } from "drizzle-orm";
import { db } from "@/server/db";
import { education } from "@/server/db/schemas/education";
import type {
  Education,
  NewEducation,
  EducationFilters,
} from "@/types/education";

export class EducationRepository {
  async create(data: NewEducation): Promise<Education> {
    const [newEducation] = await db.insert(education).values(data).returning();
    return newEducation;
  }

  async findById(id: string): Promise<Education | null> {
    const [result] = await db
      .select()
      .from(education)
      .where(eq(education.id, id))
      .limit(1);
    return result || null;
  }

  async findByUserId(userId: string): Promise<Education[]> {
    return await db
      .select()
      .from(education)
      .where(eq(education.userId, userId))
      .orderBy(asc(education.order), desc(education.createdAt));
  }

  async search(filters: EducationFilters): Promise<{
    data: Education[];
    total: number;
  }> {
    const conditions = [];

    if (filters.visible !== undefined) {
      conditions.push(eq(education.visible, filters.visible));
    }

    if (filters.type) {
      conditions.push(eq(education.type, filters.type));
    }

    if (filters.degreeLevel) {
      conditions.push(eq(education.degreeLevel, filters.degreeLevel));
    }

    if (filters.institution) {
      conditions.push(like(education.institution, `%${filters.institution}%`));
    }

    if (filters.search) {
      const searchCondition = sql`(
        ${education.title} ILIKE ${`%${filters.search}%`} OR
        ${education.institution} ILIKE ${`%${filters.search}%`} OR
        ${education.fieldOfStudy} ILIKE ${`%${filters.search}%`} OR
        ${education.description} ILIKE ${`%${filters.search}%`}
      )`;
      conditions.push(searchCondition);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const [totalResult] = await db
      .select({ count: count() })
      .from(education)
      .where(whereClause);
    const total = totalResult.count;

    // Get paginated data
    let query = db
      .select()
      .from(education)
      .where(whereClause)
      .orderBy(asc(education.order), desc(education.createdAt));

    if (filters.limit) {
      query = query.limit(filters.limit) as any;
    }

    if (filters.offset) {
      query = query.offset(filters.offset) as any;
    }

    const data = await query;

    return { data, total };
  }

  async update(id: string, data: Partial<NewEducation>): Promise<Education | null> {
    const [updated] = await db
      .update(education)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(education.id, id))
      .returning();
    return updated || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db.delete(education).where(eq(education.id, id));
    return (result as any).rowCount > 0;
  }

  async updateOrder(educationOrders: { id: string; order: number }[]): Promise<void> {
    const updatePromises = educationOrders.map(({ id, order }) =>
      this.update(id, { order })
    );
    await Promise.all(updatePromises);
  }

  async getVisibleEducation(userId: string): Promise<Education[]> {
    return await db
      .select()
      .from(education)
      .where(and(eq(education.userId, userId), eq(education.visible, true)))
      .orderBy(asc(education.order), desc(education.createdAt));
  }
}
