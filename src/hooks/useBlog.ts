import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogApi } from "@/lib/api";
import type {
  BlogPost,
  NewBlogPost,
  BlogPostFilters,
  BlogPostOrderUpdate,
} from "@/types";

// Query keys
export const blogKeys = {
  all: ["blog"] as const,
  lists: () => [...blogKeys.all, "list"] as const,
  list: (filters: BlogPostFilters) => [...blogKeys.lists(), filters] as const,
  details: () => [...blogKeys.all, "detail"] as const,
  detail: (id: string) => [...blogKeys.details(), id] as const,
  stats: () => [...blogKeys.all, "stats"] as const,
  categories: () => [...blogKeys.all, "categories"] as const,
  tags: () => [...blogKeys.all, "tags"] as const,
};

// Hooks for fetching blog posts
export function useBlogPosts(filters: BlogPostFilters = {}) {
  return useQuery({
    queryKey: blogKeys.list(filters),
    queryFn: async () => {
      const response = await blogApi.getAllBlogPosts(filters);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch blog posts");
      }
      return response.data;
    },
  });
}

export function useBlogPost(id: string) {
  return useQuery({
    queryKey: blogKeys.detail(id),
    queryFn: async () => {
      const response = await blogApi.getBlogPostById(id);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch blog post");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

export function useBlogStats() {
  return useQuery({
    queryKey: blogKeys.stats(),
    queryFn: async () => {
      const response = await blogApi.getBlogStats();
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch blog stats");
      }
      return response.data;
    },
  });
}

export function useBlogCategories() {
  return useQuery({
    queryKey: blogKeys.categories(),
    queryFn: async () => {
      const response = await blogApi.getBlogCategories();
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch blog categories");
      }
      return response.data;
    },
  });
}

export function useBlogTags() {
  return useQuery({
    queryKey: blogKeys.tags(),
    queryFn: async () => {
      const response = await blogApi.getBlogTags();
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch blog tags");
      }
      return response.data;
    },
  });
}

// Hooks for blog post mutations
export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogPost: NewBlogPost) => {
      const response = await blogApi.createBlogPost(blogPost);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create blog post");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      blogPost,
    }: {
      id: string;
      blogPost: Partial<NewBlogPost>;
    }) => {
      const response = await blogApi.updateBlogPost(id, blogPost);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to update blog post");
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      queryClient.setQueryData(blogKeys.detail(variables.id), data);
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await blogApi.deleteBlogPost(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete blog post");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}

export function useUpdateBlogPostOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogPostOrders: BlogPostOrderUpdate[]) => {
      const response = await blogApi.updateBlogPostOrder(blogPostOrders);
      if (!response.success) {
        throw new Error(response.error || "Failed to update blog post order");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}

export function useToggleBlogPostVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await blogApi.toggleBlogPostVisibility(id);
      if (!response.success || !response.data) {
        throw new Error(
          response.error || "Failed to toggle blog post visibility"
        );
      }
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      queryClient.setQueryData(blogKeys.detail(id), data);
    },
  });
}

export function useToggleBlogPostFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await blogApi.toggleBlogPostFeatured(id);
      if (!response.success || !response.data) {
        throw new Error(
          response.error || "Failed to toggle blog post featured status"
        );
      }
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      queryClient.setQueryData(blogKeys.detail(id), data);
    },
  });
}

export function useToggleBlogPostPublished() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await blogApi.toggleBlogPostPublished(id);
      if (!response.success || !response.data) {
        throw new Error(
          response.error || "Failed to toggle blog post published status"
        );
      }
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      queryClient.setQueryData(blogKeys.detail(id), data);
    },
  });
}

export function useIncrementBlogPostViewCount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await blogApi.incrementBlogPostViewCount(id);
      if (!response.success) {
        throw new Error(
          response.error || "Failed to increment blog post view count"
        );
      }
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(id) });
    },
  });
}

export function useIncrementBlogPostLikeCount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await blogApi.incrementBlogPostLikeCount(id);
      if (!response.success) {
        throw new Error(
          response.error || "Failed to increment blog post like count"
        );
      }
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(id) });
    },
  });
}
