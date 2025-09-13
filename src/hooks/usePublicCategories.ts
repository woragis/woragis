import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "@/lib/api";
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
    queryFn: async () => {
      const response = await categoryApi.getVisibleCategories();
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch public categories");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching a single public category by ID
export function usePublicCategory(id: string) {
  return useQuery({
    queryKey: publicCategoryKeys.detail(id),
    queryFn: async () => {
      const response = await categoryApi.getCategoryById(id);
      if (!response.success) {
        if (
          response.error?.includes("404") ||
          response.error?.includes("not found")
        ) {
          return null;
        }
        throw new Error(response.error || "Failed to fetch public category");
      }
      return response.data;
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
    queryFn: async () => {
      const response = await categoryApi.getCategoryBySlug(slug);
      if (!response.success) {
        if (
          response.error?.includes("404") ||
          response.error?.includes("not found")
        ) {
          return null;
        }
        throw new Error(
          response.error || "Failed to fetch public category by slug"
        );
      }
      return response.data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
