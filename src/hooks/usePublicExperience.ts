import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Experience, ApiResponse } from "@/types";

// Public experience hooks
export const usePublicExperience = () => {
  return useQuery({
    queryKey: ["public-experience"],
    queryFn: async () => {
      const response = await apiClient.get("/api/experience");
      const result = response.data as ApiResponse<Experience[]>;
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch experiences");
      }
      return result.data || [];
    },
  });
};
