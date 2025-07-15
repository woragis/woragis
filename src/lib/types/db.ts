// --- Base Interfaces ---
export interface Project {
    id: number;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}

export interface Category {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}

export interface Niche {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}

export interface Place {
    id: number;
    projectId: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}

// --- Junction Table Interfaces ---
export interface ProjectCategoryLink {
    projectId: number;
    categoryId: number;
}

export interface NicheProjectLink {
    projectId: number;
    nicheId: number;
}

// --- Interfaces for Data with Relations (for when you join data) ---

// Project with related Categories and Niches (through junction tables)
// and directly related Places
export interface ProjectDetailed extends Project {
    projectCategories: ProjectCategoryLinkWithCategory[];
    nicheProjects: NicheProjectLinkWithNiche[];
    places: Place[];
}

export interface CategoryWithProjects extends Category {
    projectCategories: ProjectCategoryLinkWithProject[];
}

export interface NicheWithProjects extends Niche {
    nicheProjects: NicheProjectLinkWithProject[];
}

// --- Interfaces for Junction Table Links with their related entities ---
export interface ProjectCategoryLinkWithCategory extends ProjectCategoryLink {
    category: Category;
}

export interface ProjectCategoryLinkWithProject extends ProjectCategoryLink {
    project: Project;
}

export interface NicheProjectLinkWithNiche extends NicheProjectLink {
    niche: Niche;
}

export interface NicheProjectLinkWithProject extends NicheProjectLink {
    project: Project;
}
