import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogTagApi } from "@/lib/api";
import type {
  BlogTag,
  NewBlogTag,
  BlogTagFilters,
  BlogTagWithCount,
} from "@/types/blog-tags";

// Query keys
const queryKeys = {
  blogTags: {
    all: ["blogTags"] as const,
    lists: () => [...queryKeys.blogTags.all, "list"] as const,
    list: (filters: BlogTagFilters) =>
      [...queryKeys.blogTags.lists(), filters] as const,
    details: () => [...queryKeys.blogTags.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.blogTags.details(), id] as const,
    visible: () => [...queryKeys.blogTags.all, "visible"] as const,
    withCount: () => [...queryKeys.blogTags.all, "withCount"] as const,
    popular: (limit?: number) =>
      [...queryKeys.blogTags.all, "popular", limit] as const,
  },
};

// Blog tag hooks
export const useBlogTags = (filters?: BlogTagFilters, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.blogTags.list(filters || {}),
    queryFn: async () => {
      const response = await blogTagApi.getAllBlogTags(filters || {});
      return response.data || [];
    },
    enabled: options?.enabled ?? true,
  });
};

export const useVisibleBlogTags = () => {
  return useQuery({
    queryKey: queryKeys.blogTags.visible(),
    queryFn: async () => {
      const response = await blogTagApi.getVisibleBlogTags();
      return response.data || [];
    },
  });
};

export const useBlogTag = (id: string) => {
  return useQuery({
    queryKey: queryKeys.blogTags.detail(id),
    queryFn: async () => {
      const response = await blogTagApi.getBlogTagById(id);
      return response.data || null;
    },
    enabled: !!id,
  });
};

export const useCreateBlogTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: NewBlogTag) => {
      const response = await blogTagApi.createBlogTag(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogTags.all });
    },
  });
};

export const useUpdateBlogTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<NewBlogTag>;
    }) => {
      const response = await blogTagApi.updateBlogTag(id, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.blogTags.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.blogTags.all });
    },
  });
};

export const useDeleteBlogTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await blogTagApi.deleteBlogTag(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogTags.all });
    },
  });
};

export const useBlogTagsWithCount = () => {
  return useQuery({
    queryKey: queryKeys.blogTags.withCount(),
    queryFn: async () => {
      const response = await blogTagApi.getBlogTagsWithCount();
      return response.data || [];
    },
  });
};

export const usePopularBlogTags = (limit?: number) => {
  return useQuery({
    queryKey: queryKeys.blogTags.popular(limit),
    queryFn: async () => {
      const response = await blogTagApi.getPopularBlogTags(limit);
      return response.data || [];
    },
  });
};

export const useUpdateBlogTagOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tagOrders: { id: string; order: number }[]) => {
      const response = await blogTagApi.updateBlogTagOrder(tagOrders);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogTags.all });
    },
  });
};
