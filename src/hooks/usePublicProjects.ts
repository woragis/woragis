import { useQuery } from "@tanstack/react-query";
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
    queryFn: async (): Promise<Project[]> => {
      const response = await fetch("/api/projects");
      if (!response.ok) {
        throw new Error("Failed to fetch public projects");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching featured public projects
export function usePublicFeaturedProjects(limit?: number) {
  return useQuery({
    queryKey: publicProjectKeys.featured(limit),
    queryFn: async (): Promise<Project[]> => {
      const params = new URLSearchParams();
      params.append("featured", "true");
      if (limit) {
        params.append("limit", limit.toString());
      }

      const response = await fetch(`/api/projects?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch featured public projects");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching a single public project
export function usePublicProject(id: string) {
  return useQuery({
    queryKey: publicProjectKeys.detail(id),
    queryFn: async (): Promise<Project | null> => {
      const response = await fetch(`/api/projects/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch public project");
      }
      return response.json();
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
    queryFn: async (): Promise<ProjectWithRelations | null> => {
      const response = await fetch(`/api/projects/${id}?relations=true`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch public project with relations");
      }
      return response.json();
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
