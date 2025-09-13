import { useQuery } from "@tanstack/react-query";
import { experienceApi } from "@/lib/api";
import { Experience } from "@/types";

// Public experience hooks
export const usePublicExperience = () => {
  return useQuery({
    queryKey: ["public-experience"],
    queryFn: async (): Promise<Experience[]> => {
      const response = await experienceApi.getPublicExperience();
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch experiences");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
