import { db } from '$lib/server/db';
import { niches, nicheProjects } from '$lib/server/db/schema';
import { eq, ilike, and, isNull, sql } from 'drizzle-orm';
import type { Niche, NicheWithProjects } from '$lib/types/db';

interface NicheCreateInput {
    name: string;
}

interface NicheUpdateInput {
    name?: string;
}

interface NicheSearchOptions {
    search?: string;
    includeDeleted?: boolean;
}

export const nicheRepository = {
    async createNiche(data: NicheCreateInput): Promise<Niche> {
        const [newNiche] = await db.insert(niches).values({
            name: data.name,
        }).returning();
        return newNiche;
    },

    async getNicheById(id: number): Promise<NicheWithProjects | undefined> {
        return db.query.niches.findFirst({
            where: and(eq(niches.id, id), isNull(niches.deletedAt)),
            with: {
                nicheProjects: { with: { project: true } }
            },
        });
    },

    async getNicheByIdIncludingDeleted(id: number): Promise<NicheWithProjects | undefined> {
        return db.query.niches.findFirst({
            where: eq(niches.id, id),
            with: {
                nicheProjects: { with: { project: true } }
            },
        });
    },

    async getAllNiches(options: NicheSearchOptions = {}): Promise<NicheWithProjects[]> {
        const { search, includeDeleted } = options;
        const whereConditions = [];

        if (!includeDeleted) {
            whereConditions.push(isNull(niches.deletedAt));
        }

        if (search) {
            whereConditions.push(ilike(niches.name, `%${search}%`));
        }

        return db.query.niches.findMany({
            where: and(...whereConditions),
            with: {
                nicheProjects: { with: { project: true } }
            },
            orderBy: niches.name,
        });
    },

    async updateNiche(id: number, data: NicheUpdateInput): Promise<Niche | undefined> {
        const [updatedNiche] = await db.update(niches)
            .set({
                ...data,
                updatedAt: sql`CURRENT_TIMESTAMP`,
            })
            .where(eq(niches.id, id))
            .returning();
        return updatedNiche;
    },

    async softDeleteNiche(id: number): Promise<void> {
        await db.update(niches)
            .set({ deletedAt: sql`CURRENT_TIMESTAMP` })
            .where(eq(niches.id, id));
    },

    async restoreNiche(id: number): Promise<void> {
        await db.update(niches)
            .set({ deletedAt: null })
            .where(eq(niches.id, id));
    },

    async hardDeleteNiche(id: number): Promise<void> {
        await db.delete(niches).where(eq(niches.id, id));
    },
};
