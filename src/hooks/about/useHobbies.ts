import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hobbiesApi } from "@/lib/api/about/hobbies";
import { type Hobby, type NewHobby } from "@/server/db/schemas/about/hobbies";

// Query keys
const queryKeys = {
  hobbies: {
    admin: ["hobbies", "admin"] as const,
    public: ["hobbies", "public"] as const,
    detail: (id: string) => ["hobbies", "admin", id] as const,
  },
};

// Admin hooks
export const useHobbies = () => {
  return useQuery({
    queryKey: queryKeys.hobbies.admin,
    queryFn: async () => {
      const response = await hobbiesApi.getHobbies();
      return response.data || [];
    },
  });
};

export const useHobby = (id: string) => {
  return useQuery({
    queryKey: queryKeys.hobbies.detail(id),
    queryFn: async () => {
      const response = await hobbiesApi.getHobby(id);
      return response.data || null;
    },
    enabled: !!id,
  });
};

export const useCreateHobby = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (hobby: NewHobby) => {
      const response = await hobbiesApi.createHobby(hobby);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.hobbies.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.hobbies.public });
    },
  });
};

export const useUpdateHobby = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      hobby,
    }: {
      id: string;
      hobby: Partial<NewHobby>;
    }) => {
      const response = await hobbiesApi.updateHobby(id, hobby);
      return response.data!;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.hobbies.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.hobbies.public });
      queryClient.invalidateQueries({ queryKey: queryKeys.hobbies.detail(id) });
    },
  });
};

export const useDeleteHobby = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await hobbiesApi.deleteHobby(id);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.hobbies.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.hobbies.public });
    },
  });
};

export const useToggleHobbyVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await hobbiesApi.toggleHobbyVisibility(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to toggle hobby visibility");
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.hobbies.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.hobbies.public });
      queryClient.invalidateQueries({
        queryKey: queryKeys.hobbies.detail(variables),
      });
    },
  });
};

// Public hooks
export const usePublicHobbies = () => {
  return useQuery({
    queryKey: queryKeys.hobbies.public,
    queryFn: async () => {
      const response = await hobbiesApi.getPublicHobbies();
      return response.data || [];
    },
  });
};
