import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { testimonialTagApi } from "@/lib/api";
import type {
  TestimonialTag,
  NewTestimonialTag,
  TestimonialTagFilters,
  TestimonialTagWithCount,
} from "@/types/testimonial-tags";

// Query keys
const queryKeys = {
  testimonialTags: {
    all: ["testimonialTags"] as const,
    lists: () => [...queryKeys.testimonialTags.all, "list"] as const,
    list: (filters: TestimonialTagFilters) =>
      [...queryKeys.testimonialTags.lists(), filters] as const,
    details: () => [...queryKeys.testimonialTags.all, "detail"] as const,
    detail: (id: string) =>
      [...queryKeys.testimonialTags.details(), id] as const,
    visible: () => [...queryKeys.testimonialTags.all, "visible"] as const,
    withCount: () => [...queryKeys.testimonialTags.all, "withCount"] as const,
    popular: (limit?: number) =>
      [...queryKeys.testimonialTags.all, "popular", limit] as const,
  },
};

// Testimonial tag hooks
export const useTestimonialTags = (filters?: TestimonialTagFilters) => {
  return useQuery({
    queryKey: queryKeys.testimonialTags.list(filters || {}),
    queryFn: async () => {
      const response = await testimonialTagApi.getAllTestimonialTags(
        filters || {}
      );
      return response.data || [];
    },
    enabled: true,
  });
};

export const useVisibleTestimonialTags = () => {
  return useQuery({
    queryKey: queryKeys.testimonialTags.visible(),
    queryFn: async () => {
      const response = await testimonialTagApi.getVisibleTestimonialTags();
      return response.data || [];
    },
  });
};

export const useTestimonialTag = (id: string) => {
  return useQuery({
    queryKey: queryKeys.testimonialTags.detail(id),
    queryFn: async () => {
      const response = await testimonialTagApi.getTestimonialTagById(id);
      return response.data || null;
    },
    enabled: !!id,
  });
};

export const useCreateTestimonialTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: NewTestimonialTag) => {
      const response = await testimonialTagApi.createTestimonialTag(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.testimonialTags.all,
      });
    },
  });
};

export const useUpdateTestimonialTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<NewTestimonialTag>;
    }) => {
      const response = await testimonialTagApi.updateTestimonialTag(id, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.testimonialTags.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.testimonialTags.all,
      });
    },
  });
};

export const useDeleteTestimonialTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await testimonialTagApi.deleteTestimonialTag(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.testimonialTags.all,
      });
    },
  });
};

export const useTestimonialTagsWithCount = () => {
  return useQuery({
    queryKey: queryKeys.testimonialTags.withCount(),
    queryFn: async () => {
      const response = await testimonialTagApi.getTestimonialTagsWithCount();
      return response.data || [];
    },
  });
};

export const usePopularTestimonialTags = (limit?: number) => {
  return useQuery({
    queryKey: queryKeys.testimonialTags.popular(limit),
    queryFn: async () => {
      const response = await testimonialTagApi.getPopularTestimonialTags(limit);
      return response.data || [];
    },
  });
};

export const useUpdateTestimonialTagOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tagOrders: { id: string; order: number }[]) => {
      const response = await testimonialTagApi.updateTestimonialTagOrder(
        tagOrders
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.testimonialTags.all,
      });
    },
  });
};
