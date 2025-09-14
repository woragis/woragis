import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectTagApi } from "@/lib/api";
import type {
  ProjectTag,
  NewProjectTag,
  ProjectTagFilters,
  ProjectTagWithCount,
} from "@/types/project-tags";

// Query keys
const queryKeys = {
  projectTags: {
    all: ["projectTags"] as const,
    lists: () => [...queryKeys.projectTags.all, "list"] as const,
    list: (filters: ProjectTagFilters) =>
      [...queryKeys.projectTags.lists(), filters] as const,
    details: () => [...queryKeys.projectTags.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.projectTags.details(), id] as const,
    visible: () => [...queryKeys.projectTags.all, "visible"] as const,
    withCount: () => [...queryKeys.projectTags.all, "withCount"] as const,
    popular: (limit?: number) =>
      [...queryKeys.projectTags.all, "popular", limit] as const,
  },
};

// Project tag hooks
export const useProjectTags = (filters?: ProjectTagFilters) => {
  return useQuery({
    queryKey: queryKeys.projectTags.list(filters || {}),
    queryFn: async () => {
      const response = await projectTagApi.getAllProjectTags(filters || {});
      return response.data || [];
    },
    enabled: true,
  });
};

export const useVisibleProjectTags = () => {
  return useQuery({
    queryKey: queryKeys.projectTags.visible(),
    queryFn: async () => {
      const response = await projectTagApi.getVisibleProjectTags();
      return response.data || [];
    },
  });
};

export const useProjectTag = (id: string) => {
  return useQuery({
    queryKey: queryKeys.projectTags.detail(id),
    queryFn: async () => {
      const response = await projectTagApi.getProjectTagById(id);
      return response.data || null;
    },
    enabled: !!id,
  });
};

export const useCreateProjectTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: NewProjectTag) => {
      const response = await projectTagApi.createProjectTag(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projectTags.all });
    },
  });
};

export const useUpdateProjectTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<NewProjectTag>;
    }) => {
      const response = await projectTagApi.updateProjectTag(id, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projectTags.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.projectTags.all });
    },
  });
};

export const useDeleteProjectTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await projectTagApi.deleteProjectTag(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projectTags.all });
    },
  });
};

export const useProjectTagsWithCount = () => {
  return useQuery({
    queryKey: queryKeys.projectTags.withCount(),
    queryFn: async () => {
      const response = await projectTagApi.getProjectTagsWithCount();
      return response.data || [];
    },
  });
};

export const usePopularProjectTags = (limit?: number) => {
  return useQuery({
    queryKey: queryKeys.projectTags.popular(limit),
    queryFn: async () => {
      const response = await projectTagApi.getPopularProjectTags(limit);
      return response.data || [];
    },
  });
};

export const useUpdateProjectTagOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tagOrders: { id: string; order: number }[]) => {
      const response = await projectTagApi.updateProjectTagOrder(tagOrders);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projectTags.all });
    },
  });
};
