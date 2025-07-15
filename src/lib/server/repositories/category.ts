import { db } from '$lib/server/db';
import { categories, projectCategories } from '$lib/server/db/schema';
import { eq, ilike, and, isNull, sql } from 'drizzle-orm';
import type { Category, CategoryWithProjects } from '$lib/types/db';

interface CategoryCreateInput {
    name: string;
}

interface CategoryUpdateInput {
    name?: string;
}

interface CategorySearchOptions {
    search?: string;
    includeDeleted?: boolean;
}

export const categoryRepository = {
    async createCategory(data: CategoryCreateInput): Promise<Category> {
        const [newCategory] = await db.insert(categories).values({
            name: data.name,
        }).returning();
        return newCategory;
    },

    async getCategoryById(id: number): Promise<CategoryWithProjects | undefined> {
        return db.query.categories.findFirst({
            where: and(eq(categories.id, id), isNull(categories.deletedAt)),
            with: {
                projectCategories: { with: { project: true } }
            },
        });
    },

    async getCategoryByIdIncludingDeleted(id: number): Promise<CategoryWithProjects | undefined> {
        return db.query.categories.findFirst({
            where: eq(categories.id, id),
            with: {
                projectCategories: { with: { project: true } }
            },
        });
    },

    async getAllCategories(options: CategorySearchOptions = {}): Promise<CategoryWithProjects[]> {
        const { search, includeDeleted } = options;
        const whereConditions = [];

        if (!includeDeleted) {
            whereConditions.push(isNull(categories.deletedAt));
        }

        if (search) {
            whereConditions.push(ilike(categories.name, `%${search}%`));
        }

        return db.query.categories.findMany({
            where: and(...whereConditions),
            with: {
                projectCategories: { with: { project: true } }
            },
            orderBy: categories.name,
        });
    },

    async updateCategory(id: number, data: CategoryUpdateInput): Promise<Category | undefined> {
        const [updatedCategory] = await db.update(categories)
            .set({
                ...data,
                updatedAt: sql`CURRENT_TIMESTAMP`,
            })
            .where(eq(categories.id, id))
            .returning();
        return updatedCategory;
    },

    async softDeleteCategory(id: number): Promise<void> {
        await db.update(categories)
            .set({ deletedAt: sql`CURRENT_TIMESTAMP` })
            .where(eq(categories.id, id));
    },

    async restoreCategory(id: number): Promise<void> {
        await db.update(categories)
            .set({ deletedAt: null })
            .where(eq(categories.id, id));
    },

    async hardDeleteCategory(id: number): Promise<void> {
        await db.delete(categories).where(eq(categories.id, id));
    },
};
