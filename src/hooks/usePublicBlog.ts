import { useQuery } from "@tanstack/react-query";
import type { BlogPost } from "@/types";

// Query keys for public blog posts
export const publicBlogKeys = {
  all: ["public-blog"] as const,
  lists: () => [...publicBlogKeys.all, "list"] as const,
  featured: (limit?: number) =>
    [...publicBlogKeys.lists(), "featured", limit] as const,
  recent: (limit?: number) =>
    [...publicBlogKeys.lists(), "recent", limit] as const,
  details: () => [...publicBlogKeys.all, "detail"] as const,
  detail: (slug: string) => [...publicBlogKeys.details(), slug] as const,
};

// Hook for fetching all public blog posts
export function usePublicBlogPosts() {
  return useQuery({
    queryKey: publicBlogKeys.lists(),
    queryFn: async (): Promise<BlogPost[]> => {
      const response = await fetch("/api/blog");
      if (!response.ok) {
        throw new Error("Failed to fetch public blog posts");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching featured public blog posts
export function usePublicFeaturedBlogPosts(limit?: number) {
  return useQuery({
    queryKey: publicBlogKeys.featured(limit),
    queryFn: async (): Promise<BlogPost[]> => {
      const params = new URLSearchParams();
      params.append("featured", "true");
      if (limit) {
        params.append("limit", limit.toString());
      }

      const response = await fetch(`/api/blog?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch featured public blog posts");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching recent public blog posts
export function usePublicRecentBlogPosts(limit?: number) {
  return useQuery({
    queryKey: publicBlogKeys.recent(limit),
    queryFn: async (): Promise<BlogPost[]> => {
      const params = new URLSearchParams();
      params.append("recent", "true");
      if (limit) {
        params.append("limit", limit.toString());
      }

      const response = await fetch(`/api/blog?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recent public blog posts");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching a single public blog post by slug
export function usePublicBlogPost(slug: string, incrementViews?: boolean) {
  return useQuery({
    queryKey: publicBlogKeys.detail(slug),
    queryFn: async (): Promise<BlogPost | null> => {
      const params = new URLSearchParams();
      if (incrementViews) {
        params.append("increment_views", "true");
      }

      const response = await fetch(`/api/blog/${slug}?${params.toString()}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch public blog post");
      }
      return response.json();
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
