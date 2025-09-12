import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type {
  Testimonial,
  NewTestimonial,
  TestimonialFilters,
  TestimonialOrderUpdate,
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
      const params = new URLSearchParams();
      if (filters.featured !== undefined)
        params.append("featured", filters.featured.toString());
      if (filters.visible !== undefined)
        params.append("visible", filters.visible.toString());
      if (filters.public !== undefined)
        params.append("public", filters.public.toString());
      if (filters.rating !== undefined)
        params.append("rating", filters.rating.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.offset) params.append("offset", filters.offset.toString());

      const response = await api.get(
        `/admin/testimonials?${params.toString()}`
      );
      return response.data.data as Testimonial[];
    },
  });
}

export function useTestimonial(id: string) {
  return useQuery({
    queryKey: testimonialKeys.detail(id),
    queryFn: async () => {
      const response = await api.get(`/admin/testimonials/${id}`);
      return response.data.data as Testimonial;
    },
    enabled: !!id,
  });
}

export function useTestimonialStats() {
  return useQuery({
    queryKey: testimonialKeys.stats(),
    queryFn: async () => {
      const [totalResponse, avgRatingResponse] = await Promise.all([
        api.get("/admin/testimonials/stats/total"),
        api.get("/admin/testimonials/stats/average-rating"),
      ]);
      return {
        total: totalResponse.data.data as number,
        averageRating: avgRatingResponse.data.data as number,
      };
    },
  });
}

// Hooks for testimonial mutations
export function useCreateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testimonial: NewTestimonial) => {
      const response = await api.post("/admin/testimonials", testimonial);
      return response.data.data as Testimonial;
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
      const response = await api.put(`/admin/testimonials/${id}`, testimonial);
      return response.data.data as Testimonial;
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
      await api.delete(`/admin/testimonials/${id}`);
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
      await api.patch("/admin/testimonials/order", { testimonialOrders });
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
      const response = await api.patch(
        `/admin/testimonials/${id}/toggle-visibility`
      );
      return response.data.data as Testimonial;
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
      const response = await api.patch(
        `/admin/testimonials/${id}/toggle-featured`
      );
      return response.data.data as Testimonial;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: testimonialKeys.all });
      queryClient.setQueryData(testimonialKeys.detail(id), data);
    },
  });
}
