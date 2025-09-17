import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { testimonialApi } from "@/lib/api";
import type {
  Testimonial,
  NewTestimonial,
  TestimonialFilters,
  TestimonialOrderUpdate,
  TestimonialCreateRequest,
} from "@/types";

// Query keys
export const testimonialKeys = {
  all: ["testimonials"] as const,
  lists: () => [...testimonialKeys.all, "list"] as const,
  list: (filters: TestimonialFilters) =>
    [...testimonialKeys.lists(), filters] as const,
  details: () => [...testimonialKeys.all, "detail"] as const,
  detail: (id: string) => [...testimonialKeys.details(), id] as const,
  stats: () => [...testimonialKeys.all, "stats"] as const,
};

// Hooks for fetching testimonials
export function useTestimonials(filters: TestimonialFilters = {}) {
  return useQuery({
    queryKey: testimonialKeys.list(filters),
    queryFn: async () => {
      const response = await testimonialApi.getAllTestimonials(filters);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch testimonials");
      }
      return response.data;
    },
  });
}

export function useTestimonial(id: string) {
  return useQuery({
    queryKey: testimonialKeys.detail(id),
    queryFn: async () => {
      const response = await testimonialApi.getTestimonialById(id);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch testimonial");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

export function useTestimonialStats() {
  return useQuery({
    queryKey: testimonialKeys.stats(),
    queryFn: async () => {
      const [totalResponse, avgRatingResponse] = await Promise.all([
        testimonialApi.getTestimonialStats(),
        testimonialApi.getAverageRating(),
      ]);
      
      if (!totalResponse.success || totalResponse.data === undefined) {
        throw new Error(totalResponse.error || "Failed to fetch testimonial stats");
      }
      
      if (!avgRatingResponse.success || avgRatingResponse.data === undefined) {
        throw new Error(avgRatingResponse.error || "Failed to fetch average rating");
      }
      
      return {
        total: totalResponse.data,
        averageRating: avgRatingResponse.data,
      };
    },
  });
}

// Hooks for testimonial mutations
export function useCreateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      testimonial: TestimonialCreateRequest["testimonial"]
    ) => {
      const response = await testimonialApi.createTestimonial(testimonial);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create testimonial");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.all });
    },
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      testimonial,
    }: {
      id: string;
      testimonial: Partial<NewTestimonial>;
    }) => {
      const response = await testimonialApi.updateTestimonial(id, testimonial);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to update testimonial");
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.all });
      queryClient.setQueryData(testimonialKeys.detail(variables.id), data);
    },
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await testimonialApi.deleteTestimonial(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete testimonial");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.all });
    },
  });
}

export function useUpdateTestimonialOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testimonialOrders: TestimonialOrderUpdate[]) => {
      const response = await testimonialApi.updateTestimonialOrder(
        testimonialOrders
      );
      if (!response.success) {
        throw new Error(response.error || "Failed to update testimonial order");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.all });
    },
  });
}

export function useToggleTestimonialVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await testimonialApi.toggleTestimonialVisibility(id);
      if (!response.success || !response.data) {
        throw new Error(
          response.error || "Failed to toggle testimonial visibility"
        );
      }
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.all });
      queryClient.setQueryData(testimonialKeys.detail(id), data);
    },
  });
}

export function useToggleTestimonialFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await testimonialApi.toggleTestimonialFeatured(id);
      if (!response.success || !response.data) {
        throw new Error(
          response.error || "Failed to toggle testimonial featured status"
        );
      }
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.all });
      queryClient.setQueryData(testimonialKeys.detail(id), data);
    },
  });
}
