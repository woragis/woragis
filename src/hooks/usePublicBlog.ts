import { useQuery } from "@tanstack/react-query";
import { blogApi } from "@/lib/api";
import type { BlogPost, BlogPostFilters } from "@/types";

// Query keys for public blog posts
export const publicBlogKeys = {
  all: ["public-blog"] as const,
  lists: () => [...publicBlogKeys.all, "list"] as const,
  list: (filters: BlogPostFilters) =>
    [...publicBlogKeys.lists(), filters] as const,
  featured: (limit?: number) =>
    [...publicBlogKeys.lists(), "featured", limit] as const,
  recent: (limit?: number) =>
    [...publicBlogKeys.lists(), "recent", limit] as const,
  details: () => [...publicBlogKeys.all, "detail"] as const,
  detail: (slug: string) => [...publicBlogKeys.details(), slug] as const,
};

// Hook for fetching all public blog posts
export function usePublicBlogPosts(filters: BlogPostFilters = {}) {
  return useQuery({
    queryKey: publicBlogKeys.list(filters),
    queryFn: async () => {
      const response = await blogApi.getPublicBlogPosts(filters);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch public blog posts");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching featured public blog posts
export function usePublicFeaturedBlogPosts(limit?: number) {
  return useQuery({
    queryKey: publicBlogKeys.featured(limit),
    queryFn: async () => {
      const response = await blogApi.getPublicBlogPosts({
        featured: true,
        limit,
      });
      if (!response.success || !response.data) {
        throw new Error(
          response.error || "Failed to fetch featured public blog posts"
        );
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching recent public blog posts
export function usePublicRecentBlogPosts(limit?: number) {
  return useQuery({
    queryKey: publicBlogKeys.recent(limit),
    queryFn: async () => {
      const response = await blogApi.getPublicBlogPosts({
        sortBy: "createdAt",
        sortOrder: "desc",
        limit,
      });
      if (!response.success || !response.data) {
        throw new Error(
          response.error || "Failed to fetch recent public blog posts"
        );
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching a single public blog post by slug
export function usePublicBlogPost(slug: string) {
  return useQuery({
    queryKey: publicBlogKeys.detail(slug),
    queryFn: async () => {
      const response = await blogApi.getPublicBlogPostBySlug(slug);
      if (!response.success) {
        if (
          response.error?.includes("404") ||
          response.error?.includes("not found")
        ) {
          return null;
        }
        throw new Error(response.error || "Failed to fetch public blog post");
      }
      return response.data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
