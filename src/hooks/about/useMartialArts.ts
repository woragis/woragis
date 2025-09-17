import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { martialArtsApi } from "@/lib/api/about/martial-arts";
import {
  type MartialArt,
  type NewMartialArt,
} from "@/server/db/schemas/about/martial-arts";

// Query keys
const queryKeys = {
  martialArts: {
    admin: ["martialArts", "admin"] as const,
    public: ["martialArts", "public"] as const,
    detail: (id: string) => ["martialArts", "admin", id] as const,
  },
};

// Admin hooks
export const useMartialArts = () => {
  return useQuery({
    queryKey: queryKeys.martialArts.admin,
    queryFn: async () => {
      const response = await martialArtsApi.getMartialArts();
      return response.data || [];
    },
  });
};

export const useMartialArt = (id: string) => {
  return useQuery({
    queryKey: queryKeys.martialArts.detail(id),
    queryFn: async () => {
      const response = await martialArtsApi.getMartialArt(id);
      return response.data || null;
    },
    enabled: !!id,
  });
};

export const useCreateMartialArt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (martialArt: NewMartialArt) => {
      const response = await martialArtsApi.createMartialArt(martialArt);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.martialArts.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.martialArts.public });
    },
  });
};

export const useUpdateMartialArt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      martialArt,
    }: {
      id: string;
      martialArt: Partial<NewMartialArt>;
    }) => {
      const response = await martialArtsApi.updateMartialArt(id, martialArt);
      return response.data!;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.martialArts.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.martialArts.public });
      queryClient.invalidateQueries({
        queryKey: queryKeys.martialArts.detail(id),
      });
    },
  });
};

export const useDeleteMartialArt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await martialArtsApi.deleteMartialArt(id);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.martialArts.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.martialArts.public });
    },
  });
};

export const useToggleMartialArtVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await martialArtsApi.toggleMartialArtVisibility(id);
      if (!response.success) {
        throw new Error(
          response.error || "Failed to toggle martial art visibility"
        );
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.martialArts.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.martialArts.public });
      queryClient.invalidateQueries({
        queryKey: queryKeys.martialArts.detail(variables),
      });
    },
  });
};

// Public hooks
export const usePublicMartialArts = () => {
  return useQuery({
    queryKey: queryKeys.martialArts.public,
    queryFn: async () => {
      const response = await martialArtsApi.getPublicMartialArts();
      return response.data || [];
    },
  });
};
