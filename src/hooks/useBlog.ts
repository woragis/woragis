import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
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
      const params = new URLSearchParams();
      if (filters.published !== undefined)
        params.append("published", filters.published.toString());
      if (filters.featured !== undefined)
        params.append("featured", filters.featured.toString());
      if (filters.visible !== undefined)
        params.append("visible", filters.visible.toString());
      if (filters.public !== undefined)
        params.append("public", filters.public.toString());
      if (filters.category) params.append("category", filters.category);
      if (filters.tags && filters.tags.length > 0)
        params.append("tags", filters.tags.join(","));
      if (filters.search) params.append("search", filters.search);
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.offset) params.append("offset", filters.offset.toString());
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

      const response = await api.get(`/admin/blog?${params.toString()}`);
      return response.data.data as BlogPost[];
    },
  });
}

export function useBlogPost(id: string) {
  return useQuery({
    queryKey: blogKeys.detail(id),
    queryFn: async () => {
      const response = await api.get(`/admin/blog/${id}`);
      return response.data.data as BlogPost;
    },
    enabled: !!id,
  });
}

export function useBlogStats() {
  return useQuery({
    queryKey: blogKeys.stats(),
    queryFn: async () => {
      const response = await api.get("/admin/blog/stats");
      return response.data.data as {
        total: number;
        published: number;
        totalViews: number;
      };
    },
  });
}

export function useBlogCategories() {
  return useQuery({
    queryKey: blogKeys.categories(),
    queryFn: async () => {
      const response = await api.get("/admin/blog/categories");
      return response.data.data as { name: string; count: number }[];
    },
  });
}

export function useBlogTags() {
  return useQuery({
    queryKey: blogKeys.tags(),
    queryFn: async () => {
      const response = await api.get("/admin/blog/tags");
      return response.data.data as { name: string; count: number }[];
    },
  });
}

// Hooks for blog post mutations
export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogPost: NewBlogPost) => {
      const response = await api.post("/admin/blog", blogPost);
      return response.data.data as BlogPost;
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
      const response = await api.put(`/admin/blog/${id}`, blogPost);
      return response.data.data as BlogPost;
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
      await api.delete(`/admin/blog/${id}`);
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
      await api.patch("/admin/blog/order", { blogPostOrders });
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
      const response = await api.patch(`/admin/blog/${id}/toggle-visibility`);
      return response.data.data as BlogPost;
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
      const response = await api.patch(`/admin/blog/${id}/toggle-featured`);
      return response.data.data as BlogPost;
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
      const response = await api.patch(`/admin/blog/${id}/toggle-published`);
      return response.data.data as BlogPost;
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
      await api.patch(`/admin/blog/${id}/increment-views`);
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
      await api.patch(`/admin/blog/${id}/increment-likes`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(id) });
    },
  });
}
