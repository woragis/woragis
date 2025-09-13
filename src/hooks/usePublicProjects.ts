import { useQuery } from "@tanstack/react-query";
import { projectApi } from "@/lib/api";
import type { Project, ProjectWithRelations } from "@/types";

// Query keys for public projects
export const publicProjectKeys = {
  all: ["public-projects"] as const,
  lists: () => [...publicProjectKeys.all, "list"] as const,
  featured: (limit?: number) =>
    [...publicProjectKeys.lists(), "featured", limit] as const,
  details: () => [...publicProjectKeys.all, "detail"] as const,
  detail: (id: string) => [...publicProjectKeys.details(), id] as const,
  withRelations: (id: string) =>
    [...publicProjectKeys.detail(id), "relations"] as const,
};

// Hook for fetching all public projects
export function usePublicProjects() {
  return useQuery({
    queryKey: publicProjectKeys.lists(),
    queryFn: async () => {
      const response = await projectApi.getVisibleProjects();
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch public projects");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching featured public projects
export function usePublicFeaturedProjects(limit?: number) {
  return useQuery({
    queryKey: publicProjectKeys.featured(limit),
    queryFn: async () => {
      const response = await projectApi.getFeaturedProjects(limit);
      if (!response.success || !response.data) {
        throw new Error(
          response.error || "Failed to fetch featured public projects"
        );
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching a single public project
export function usePublicProject(id: string) {
  return useQuery({
    queryKey: publicProjectKeys.detail(id),
    queryFn: async () => {
      const response = await projectApi.getProjectById(id);
      if (!response.success) {
        if (
          response.error?.includes("404") ||
          response.error?.includes("not found")
        ) {
          return null;
        }
        throw new Error(response.error || "Failed to fetch public project");
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching a public project with relations
export function usePublicProjectWithRelations(id: string) {
  return useQuery({
    queryKey: publicProjectKeys.withRelations(id),
    queryFn: async () => {
      const response = await projectApi.getProjectWithRelations(id);
      if (!response.success) {
        if (
          response.error?.includes("404") ||
          response.error?.includes("not found")
        ) {
          return null;
        }
        throw new Error(
          response.error || "Failed to fetch public project with relations"
        );
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
