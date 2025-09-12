import { useQuery } from "@tanstack/react-query";
import type { Category } from "@/types";

// Query keys for public categories
export const publicCategoryKeys = {
  all: ["public-categories"] as const,
  lists: () => [...publicCategoryKeys.all, "list"] as const,
  details: () => [...publicCategoryKeys.all, "detail"] as const,
  detail: (id: string) => [...publicCategoryKeys.details(), id] as const,
  bySlug: (slug: string) => [...publicCategoryKeys.all, "slug", slug] as const,
};

// Hook for fetching all public categories
export function usePublicCategories() {
  return useQuery({
    queryKey: publicCategoryKeys.lists(),
    queryFn: async (): Promise<Category[]> => {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch public categories");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching a single public category by ID
export function usePublicCategory(id: string) {
  return useQuery({
    queryKey: publicCategoryKeys.detail(id),
    queryFn: async (): Promise<Category | null> => {
      const response = await fetch(`/api/categories/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch public category");
      }
      return response.json();
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching a public category by slug
export function usePublicCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: publicCategoryKeys.bySlug(slug),
    queryFn: async (): Promise<Category | null> => {
      const response = await fetch(`/api/categories/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch public category by slug");
      }
      return response.json();
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
