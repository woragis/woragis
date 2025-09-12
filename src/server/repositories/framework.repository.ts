import { eq, desc, asc, and, like, sql } from "drizzle-orm";
import { db } from "../db";
import { frameworks, projectFrameworks } from "../db/schemas";
import type {
  Framework,
  NewFramework,
  FrameworkFilters,
  ProficiencyLevel,
} from "@/types";

export class FrameworkRepository {
  // Basic CRUD operations
  async findAll(): Promise<Framework[]> {
    return await db
      .select()
      .from(frameworks)
      .orderBy(asc(frameworks.order), asc(frameworks.name));
  }

  async findVisible(): Promise<Framework[]> {
    return await db
      .select()
      .from(frameworks)
      .where(eq(frameworks.visible, true))
      .orderBy(asc(frameworks.order), asc(frameworks.name));
  }

  async findById(id: string): Promise<Framework | null> {
    const result = await db
      .select()
      .from(frameworks)
      .where(eq(frameworks.id, id));
    return result[0] || null;
  }

  async findBySlug(slug: string): Promise<Framework | null> {
    const result = await db
      .select()
      .from(frameworks)
      .where(eq(frameworks.slug, slug));
    return result[0] || null;
  }

  async create(framework: NewFramework): Promise<Framework> {
    const result = await db.insert(frameworks).values(framework).returning();
    return result[0];
  }

  async update(
    id: string,
    framework: Partial<NewFramework>
  ): Promise<Framework | null> {
    const result = await db
      .update(frameworks)
      .set({ ...framework, updatedAt: new Date() })
      .where(eq(frameworks.id, id))
      .returning();
    return result[0] || null;
  }

  async delete(id: string): Promise<void> {
    await db.delete(frameworks).where(eq(frameworks.id, id));
  }

  // Search and filtering
  async search(filters: FrameworkFilters): Promise<Framework[]> {
    let query = db.select().from(frameworks);

    if (filters.visible !== undefined) {
      query = query.where(eq(frameworks.visible, filters.visible));
    }

    if (filters.search) {
      query = query.where(like(frameworks.name, `%${filters.search}%`));
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    return await query.orderBy(asc(frameworks.order), asc(frameworks.name));
  }

  // Project relations
  async getProjectCount(frameworkId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(projectFrameworks)
      .where(eq(projectFrameworks.frameworkId, frameworkId));

    return result[0]?.count || 0;
  }

  async findWithProjectCount(
    frameworkId: string
  ): Promise<{ framework: Framework; projectCount: number } | null> {
    const framework = await this.findById(frameworkId);
    if (!framework) return null;

    const projectCount = await this.getProjectCount(frameworkId);
    return { framework, projectCount };
  }

  async findPopular(
    limit: number = 10
  ): Promise<Array<{ framework: Framework; projectCount: number }>> {
    const result = await db
      .select({
        framework: frameworks,
        projectCount: sql<number>`count(${projectFrameworks.id})`,
      })
      .from(frameworks)
      .leftJoin(
        projectFrameworks,
        eq(frameworks.id, projectFrameworks.frameworkId)
      )
      .groupBy(frameworks.id)
      .orderBy(desc(sql`count(${projectFrameworks.id})`))
      .limit(limit);

    return result.map(({ framework, projectCount }) => ({
      framework,
      projectCount,
    }));
  }

  // Version analysis
  async getVersionDistribution(
    frameworkId: string
  ): Promise<Array<{ version: string; count: number }>> {
    const result = await db
      .select({
        version: projectFrameworks.version,
        count: sql<number>`count(*)`,
      })
      .from(projectFrameworks)
      .where(eq(projectFrameworks.frameworkId, frameworkId))
      .groupBy(projectFrameworks.version)
      .orderBy(desc(sql`count(*)`));

    return result.map(({ version, count }) => ({
      version: version || "unknown",
      count,
    }));
  }

  // Proficiency analysis
  async getProficiencyDistribution(
    frameworkId: string
  ): Promise<Array<{ proficiency: string; count: number }>> {
    const result = await db
      .select({
        proficiency: projectFrameworks.proficiency,
        count: sql<number>`count(*)`,
      })
      .from(projectFrameworks)
      .where(eq(projectFrameworks.frameworkId, frameworkId))
      .groupBy(projectFrameworks.proficiency)
      .orderBy(desc(sql`count(*)`));

    return result.map(({ proficiency, count }) => ({
      proficiency: proficiency || "unknown",
      count,
    }));
  }

  // Ordering operations
  async updateOrder(
    frameworkOrders: { id: string; order: number }[]
  ): Promise<void> {
    const promises = frameworkOrders.map(({ id, order }) =>
      db
        .update(frameworks)
        .set({ order, updatedAt: new Date() })
        .where(eq(frameworks.id, id))
    );
    await Promise.all(promises);
  }
}
