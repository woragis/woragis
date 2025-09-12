import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectApi } from "@/lib/api-service";
import type {
  Project,
  NewProject,
  ProjectFilters,
  ProjectOrderUpdate,
  ProjectWithRelations,
} from "@/types";

// Query keys
export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: (filters: ProjectFilters) => [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all, "detail"] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  withRelations: (id: string) =>
    [...projectKeys.detail(id), "relations"] as const,
};

// Hooks for fetching projects
export function useProjects(filters: ProjectFilters = {}) {
  return useQuery({
    queryKey: projectKeys.list(filters),
    queryFn: async () => {
      const response = await projectApi.searchProjects(filters);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch projects");
      }
      return response.data;
    },
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: async () => {
      const response = await projectApi.getProjectById(id);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch project");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

export function useProjectWithRelations(id: string) {
  return useQuery({
    queryKey: projectKeys.withRelations(id),
    queryFn: async () => {
      const response = await projectApi.getProjectWithRelations(id);
      if (!response.success || !response.data) {
        throw new Error(
          response.error || "Failed to fetch project with relations"
        );
      }
      return response.data;
    },
    enabled: !!id,
  });
}

// Hooks for project mutations
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: NewProject) => {
      const response = await projectApi.createProject(project);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create project");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      project,
    }: {
      id: string;
      project: Partial<NewProject>;
    }) => {
      const response = await projectApi.updateProject(id, project);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to update project");
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.setQueryData(projectKeys.detail(variables.id), data);
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await projectApi.deleteProject(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete project");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useUpdateProjectOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectOrders: ProjectOrderUpdate[]) => {
      const response = await projectApi.updateProjectOrder(projectOrders);
      if (!response.success) {
        throw new Error(response.error || "Failed to update project order");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useToggleProjectVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await projectApi.toggleProjectVisibility(id);
      if (!response.success || !response.data) {
        throw new Error(
          response.error || "Failed to toggle project visibility"
        );
      }
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.setQueryData(projectKeys.detail(id), data);
    },
  });
}

export function useToggleProjectFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await projectApi.toggleProjectFeatured(id);
      if (!response.success || !response.data) {
        throw new Error(
          response.error || "Failed to toggle project featured status"
        );
      }
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
      queryClient.setQueryData(projectKeys.detail(id), data);
    },
  });
}
