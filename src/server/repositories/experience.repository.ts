import { db } from "../db";
import {
  experiences,
  type Experience,
  type NewExperience,
} from "../db/schemas";
import { eq, desc, and } from "drizzle-orm";

export class ExperienceRepository {
  async findAll(): Promise<Experience[]> {
    return await db
      .select()
      .from(experiences)
      .where(eq(experiences.visible, true))
      .orderBy(experiences.order, desc(experiences.createdAt));
  }

  async findAllForAdmin(): Promise<Experience[]> {
    return await db
      .select()
      .from(experiences)
      .orderBy(experiences.order, desc(experiences.createdAt));
  }

  async findById(id: string): Promise<Experience | null> {
    const result = await db
      .select()
      .from(experiences)
      .where(eq(experiences.id, id))
      .limit(1);

    return result[0] || null;
  }

  async create(data: NewExperience): Promise<Experience> {
    const result = await db.insert(experiences).values(data).returning();

    return result[0];
  }

  async update(
    id: string,
    data: Partial<NewExperience>
  ): Promise<Experience | null> {
    const result = await db
      .update(experiences)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(experiences.id, id))
      .returning();

    return result[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(experiences)
      .where(eq(experiences.id, id))
      .returning();

    return result.length > 0;
  }

  async updateOrder(id: string, order: number): Promise<Experience | null> {
    const result = await db
      .update(experiences)
      .set({ order, updatedAt: new Date() })
      .where(eq(experiences.id, id))
      .returning();

    return result[0] || null;
  }

  async toggleVisible(id: string): Promise<Experience | null> {
    const experience = await this.findById(id);
    if (!experience) return null;

    return await this.update(id, { visible: !experience.visible });
  }
}
