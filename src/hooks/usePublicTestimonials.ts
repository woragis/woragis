import { useQuery } from "@tanstack/react-query";
import type { Testimonial } from "@/types";

// Query keys for public testimonials
export const publicTestimonialKeys = {
  all: ["public-testimonials"] as const,
  lists: () => [...publicTestimonialKeys.all, "list"] as const,
  featured: (limit?: number) =>
    [...publicTestimonialKeys.lists(), "featured", limit] as const,
  details: () => [...publicTestimonialKeys.all, "detail"] as const,
  detail: (id: string) => [...publicTestimonialKeys.details(), id] as const,
};

// Hook for fetching all public testimonials
export function usePublicTestimonials() {
  return useQuery({
    queryKey: publicTestimonialKeys.lists(),
    queryFn: async (): Promise<Testimonial[]> => {
      const response = await fetch("/api/testimonials");
      if (!response.ok) {
        throw new Error("Failed to fetch public testimonials");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching featured public testimonials
export function usePublicFeaturedTestimonials(limit?: number) {
  return useQuery({
    queryKey: publicTestimonialKeys.featured(limit),
    queryFn: async (): Promise<Testimonial[]> => {
      const params = new URLSearchParams();
      params.append("featured", "true");
      if (limit) {
        params.append("limit", limit.toString());
      }

      const response = await fetch(`/api/testimonials?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch featured public testimonials");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching a single public testimonial
export function usePublicTestimonial(id: string) {
  return useQuery({
    queryKey: publicTestimonialKeys.detail(id),
    queryFn: async (): Promise<Testimonial | null> => {
      const response = await fetch(`/api/testimonials/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch public testimonial");
      }
      return response.json();
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
