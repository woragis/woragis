import { db } from '$lib/server/db';
import { projects, projectCategories, nicheProjects, places } from '$lib/server/db/schema';
import { eq, ilike, and, or, isNull, sql } from 'drizzle-orm';
import type { Project, ProjectDetailed } from '$lib/types/db';

interface ProjectCreateInput {
    name: string;
    description?: string;
}

interface ProjectUpdateInput {
    name?: string;
    description?: string;
}

interface ProjectSearchOptions {
    search?: string; // Search term for name or description
    includeDeleted?: boolean; // If true, include soft-deleted projects
    // Add more specific filters here if needed, e.g., categoryId?: number;
}

export const projectRepository = {
    /**
     * Creates a new project.
     * @param data Project creation data.
     * @returns The created project.
     */
    async createProject(data: ProjectCreateInput): Promise<Project> {
        const [newProject] = await db.insert(projects).values({
            name: data.name,
            description: data.description,
            // createdAt and updatedAt default to CURRENT_TIMESTAMP from schema
        }).returning();
        return newProject;
    },

    /**
     * Retrieves a project by its ID, excluding soft-deleted ones.
     * @param id The ID of the project.
     * @returns The project or undefined if not found or deleted.
     */
    async getProjectById(id: number): Promise<ProjectDetailed | undefined> {
        return db.query.projects.findFirst({
            where: and(eq(projects.id, id), isNull(projects.deletedAt)),
            with: {
                places: true,
                projectCategories: { with: { category: true } },
                nicheProjects: { with: { niche: true } },
            },
        });
    },

    /**
     * Retrieves a project by its ID, including soft-deleted ones (for admin views).
     * @param id The ID of the project.
     * @returns The project or undefined if not found.
     */
    async getProjectByIdIncludingDeleted(id: number): Promise<ProjectDetailed | undefined> {
        return db.query.projects.findFirst({
            where: eq(projects.id, id),
            with: {
                places: true,
                projectCategories: { with: { category: true } },
                nicheProjects: { with: { niche: true } },
            },
        });
    },

    /**
     * Retrieves all projects with optional search and filtering, excluding soft-deleted by default.
     * @param options Search and filtering options.
     * @returns An array of projects.
     */
    async getAllProjects(options: ProjectSearchOptions = {}): Promise<ProjectDetailed[]> {
        const { search, includeDeleted } = options;

        const whereConditions = [];

        // Soft delete filter
        if (!includeDeleted) {
            whereConditions.push(isNull(projects.deletedAt));
        }

        // Search filter (on name and description)
        if (search) {
            const searchTerm = `%${search}%`;
            whereConditions.push(
                or(
                    ilike(projects.name, searchTerm),
                    ilike(projects.description, searchTerm)
                )
            );
        }

        return db.query.projects.findMany({
            where: and(...whereConditions),
            with: {
                places: true,
                projectCategories: { with: { category: true } },
                nicheProjects: { with: { niche: true } },
            },
            orderBy: projects.name, // Example: order by name
        });
    },

    /**
     * Updates an existing project.
     * @param id The ID of the project to update.
     * @param data The fields to update.
     * @returns The updated project or undefined if not found.
     */
    async updateProject(id: number, data: ProjectUpdateInput): Promise<Project | undefined> {
        const [updatedProject] = await db.update(projects)
            .set({
                ...data,
                updatedAt: sql`CURRENT_TIMESTAMP`, // Manually update timestamp
            })
            .where(eq(projects.id, id))
            .returning();
        return updatedProject;
    },

    /**
     * Soft deletes a project by setting its `deletedAt` timestamp.
     * @param id The ID of the project to soft delete.
     */
    async softDeleteProject(id: number): Promise<void> {
        await db.update(projects)
            .set({ deletedAt: sql`CURRENT_TIMESTAMP` })
            .where(eq(projects.id, id));
    },

    /**
     * Restores a soft-deleted project by setting its `deletedAt` to null.
     * @param id The ID of the project to restore.
     */
    async restoreProject(id: number): Promise<void> {
        await db.update(projects)
            .set({ deletedAt: null })
            .where(eq(projects.id, id));
    },

    /**
     * Permanently deletes a project from the database. Use with caution.
     * @param id The ID of the project to hard delete.
     */
    async hardDeleteProject(id: number): Promise<void> {
        await db.delete(projects).where(eq(projects.id, id));
    },
};
