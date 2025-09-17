import { db } from "../db";
import { experiences } from "../db/schemas";
import type { Experience, NewExperience } from "@/types/experience";
import { eq, desc, and } from "drizzle-orm";

export class ExperienceRepository {
  async findAll(): Promise<Experience[]> {
    const results = await db
      .select()
      .from(experiences)
      .where(eq(experiences.visible, true))
      .orderBy(experiences.order, desc(experiences.createdAt));
    
    return results.map(exp => ({
      id: exp.id,
      userId: exp.userId,
      title: exp.title,
      company: exp.company,
      period: exp.period,
      location: exp.location,
      description: exp.description,
      achievements: exp.achievements,
      technologies: exp.technologies,
      icon: exp.icon,
      order: exp.order,
      visible: exp.visible ?? true,
      createdAt: exp.createdAt ?? new Date(),
      updatedAt: exp.updatedAt ?? new Date(),
    }));
  }

  async findAllForAdmin(): Promise<Experience[]> {
    const results = await db
      .select()
      .from(experiences)
      .orderBy(experiences.order, desc(experiences.createdAt));
    
    return results.map(exp => ({
      id: exp.id,
      userId: exp.userId,
      title: exp.title,
      company: exp.company,
      period: exp.period,
      location: exp.location,
      description: exp.description,
      achievements: exp.achievements,
      technologies: exp.technologies,
      icon: exp.icon,
      order: exp.order,
      visible: exp.visible ?? true,
      createdAt: exp.createdAt ?? new Date(),
      updatedAt: exp.updatedAt ?? new Date(),
    }));
  }

  async findById(id: string): Promise<Experience | null> {
    const result = await db
      .select()
      .from(experiences)
      .where(eq(experiences.id, id))
      .limit(1);

    if (!result[0]) return null;
    
    const exp = result[0];
    return {
      id: exp.id,
      userId: exp.userId,
      title: exp.title,
      company: exp.company,
      period: exp.period,
      location: exp.location,
      description: exp.description,
      achievements: exp.achievements,
      technologies: exp.technologies,
      icon: exp.icon,
      order: exp.order,
      visible: exp.visible ?? true,
      createdAt: exp.createdAt ?? new Date(),
      updatedAt: exp.updatedAt ?? new Date(),
    };
  }

  async create(data: NewExperience, userId: string): Promise<Experience> {
    const experienceData = { ...data, userId };
    const result = await db.insert(experiences).values(experienceData).returning();

    const exp = result[0];
    return {
      id: exp.id,
      userId: exp.userId,
      title: exp.title,
      company: exp.company,
      period: exp.period,
      location: exp.location,
      description: exp.description,
      achievements: exp.achievements,
      technologies: exp.technologies,
      icon: exp.icon,
      order: exp.order,
      visible: exp.visible ?? true,
      createdAt: exp.createdAt ?? new Date(),
      updatedAt: exp.updatedAt ?? new Date(),
    };
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

    if (!result[0]) return null;
    
    const exp = result[0];
    return {
      id: exp.id,
      userId: exp.userId,
      title: exp.title,
      company: exp.company,
      period: exp.period,
      location: exp.location,
      description: exp.description,
      achievements: exp.achievements,
      technologies: exp.technologies,
      icon: exp.icon,
      order: exp.order,
      visible: exp.visible ?? true,
      createdAt: exp.createdAt ?? new Date(),
      updatedAt: exp.updatedAt ?? new Date(),
    };
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

    if (!result[0]) return null;
    
    const exp = result[0];
    return {
      id: exp.id,
      userId: exp.userId,
      title: exp.title,
      company: exp.company,
      period: exp.period,
      location: exp.location,
      description: exp.description,
      achievements: exp.achievements,
      technologies: exp.technologies,
      icon: exp.icon,
      order: exp.order,
      visible: exp.visible ?? true,
      createdAt: exp.createdAt ?? new Date(),
      updatedAt: exp.updatedAt ?? new Date(),
    };
  }

  async toggleVisible(id: string): Promise<Experience | null> {
    const experience = await this.findById(id);
    if (!experience) return null;

    return await this.update(id, { visible: !experience.visible });
  }
}
