import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { languagesApi } from "@/lib/api/about/languages";
import {
  type Language,
  type NewLanguage,
} from "@/server/db/schemas/about/languages";

// Query keys
const queryKeys = {
  languages: {
    admin: ["languages", "admin"] as const,
    public: ["languages", "public"] as const,
    detail: (id: string) => ["languages", "admin", id] as const,
  },
};

// Admin hooks
export const useLanguages = () => {
  return useQuery({
    queryKey: queryKeys.languages.admin,
    queryFn: async () => {
      const response = await languagesApi.getLanguages();
      return response.data || [];
    },
  });
};

export const useLanguage = (id: string) => {
  return useQuery({
    queryKey: queryKeys.languages.detail(id),
    queryFn: async () => {
      const response = await languagesApi.getLanguage(id);
      return response.data || null;
    },
    enabled: !!id,
  });
};

export const useCreateLanguage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (language: NewLanguage) => {
      const response = await languagesApi.createLanguage(language);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.languages.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.languages.public });
    },
  });
};

export const useUpdateLanguage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      language,
    }: {
      id: string;
      language: Partial<NewLanguage>;
    }) => {
      const response = await languagesApi.updateLanguage(id, language);
      return response.data!;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.languages.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.languages.public });
      queryClient.invalidateQueries({
        queryKey: queryKeys.languages.detail(id),
      });
    },
  });
};

export const useDeleteLanguage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await languagesApi.deleteLanguage(id);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.languages.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.languages.public });
    },
  });
};

export const useToggleLanguageVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await languagesApi.toggleLanguageVisibility(id);
      if (!response.success) {
        throw new Error(
          response.error || "Failed to toggle language visibility"
        );
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.languages.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.languages.public });
      queryClient.invalidateQueries({
        queryKey: queryKeys.languages.detail(variables),
      });
    },
  });
};

// Public hooks
export const usePublicLanguages = () => {
  return useQuery({
    queryKey: queryKeys.languages.public,
    queryFn: async () => {
      const response = await languagesApi.getPublicLanguages();
      return response.data || [];
    },
  });
};
