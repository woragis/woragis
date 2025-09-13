import { useQuery } from "@tanstack/react-query";
import { testimonialApi } from "@/lib/api";
import type { Testimonial, TestimonialFilters } from "@/types";

// Query keys for public testimonials
export const publicTestimonialKeys = {
  all: ["public-testimonials"] as const,
  lists: () => [...publicTestimonialKeys.all, "list"] as const,
  list: (filters: TestimonialFilters) =>
    [...publicTestimonialKeys.lists(), filters] as const,
  featured: (limit?: number) =>
    [...publicTestimonialKeys.lists(), "featured", limit] as const,
  details: () => [...publicTestimonialKeys.all, "detail"] as const,
  detail: (id: string) => [...publicTestimonialKeys.details(), id] as const,
};

// Hook for fetching all public testimonials
export function usePublicTestimonials(filters: TestimonialFilters = {}) {
  return useQuery({
    queryKey: publicTestimonialKeys.list(filters),
    queryFn: async () => {
      const response = await testimonialApi.getPublicTestimonials(filters);
      if (!response.success || !response.data) {
        throw new Error(
          response.error || "Failed to fetch public testimonials"
        );
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching featured public testimonials
export function usePublicFeaturedTestimonials(limit?: number) {
  return useQuery({
    queryKey: publicTestimonialKeys.featured(limit),
    queryFn: async () => {
      const response = await testimonialApi.getPublicTestimonials({
        featured: true,
        limit,
      });
      if (!response.success || !response.data) {
        throw new Error(
          response.error || "Failed to fetch featured public testimonials"
        );
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching a single public testimonial
export function usePublicTestimonial(id: string) {
  return useQuery({
    queryKey: publicTestimonialKeys.detail(id),
    queryFn: async () => {
      const response = await testimonialApi.getTestimonialById(id);
      if (!response.success) {
        if (
          response.error?.includes("404") ||
          response.error?.includes("not found")
        ) {
          return null;
        }
        throw new Error(response.error || "Failed to fetch public testimonial");
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
