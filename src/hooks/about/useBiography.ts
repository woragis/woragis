import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { biographyApi } from "@/lib/api/about/biography";
import {
  type Biography,
  type NewBiography,
} from "@/server/db/schemas/about/biography";

// Query keys
const queryKeys = {
  biography: {
    admin: ["biography", "admin"] as const,
    public: ["biography", "public"] as const,
  },
};

// Admin hooks
export const useBiography = () => {
  return useQuery({
    queryKey: queryKeys.biography.admin,
    queryFn: async () => {
      const response = await biographyApi.getBiography();
      return response.data || null;
    },
  });
};

export const useCreateBiography = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (biography: NewBiography) => {
      const response = await biographyApi.createBiography(biography);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.biography.admin });
    },
  });
};

export const useUpdateBiography = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (biography: Partial<NewBiography>) => {
      const response = await biographyApi.updateBiography(biography);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.biography.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.biography.public });
    },
  });
};

export const useDeleteBiography = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await biographyApi.deleteBiography();
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.biography.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.biography.public });
    },
  });
};

// Public hooks
export const usePublicBiography = () => {
  return useQuery({
    queryKey: queryKeys.biography.public,
    queryFn: async () => {
      const response = await biographyApi.getPublicBiography();
      return response.data || null;
    },
  });
};
