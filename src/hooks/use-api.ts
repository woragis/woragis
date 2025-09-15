import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectApi, languageApi, frameworkApi, settingsApi } from "@/lib/api";
import type {
  Project,
  NewProject,
  ProjectFilters,
  ProjectOrderUpdate,
} from "@/types/projects";
import type { Language, NewLanguage, LanguageFilters } from "@/types/languages";
import type {
  Framework,
  NewFramework,
  FrameworkFilters,
} from "@/types/frameworks";
import type { Setting, NewSetting } from "@/types/settings";

// Query keys
export const queryKeys = {
  projects: {
    all: ["projects"] as const,
    lists: () => [...queryKeys.projects.all, "list"] as const,
    list: (filters: ProjectFilters) =>
      [...queryKeys.projects.lists(), filters] as const,
    details: () => [...queryKeys.projects.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.projects.details(), id] as const,
    featured: (limit?: number) =>
      [...queryKeys.projects.all, "featured", limit] as const,
    visible: () => [...queryKeys.projects.all, "visible"] as const,
  },
  languages: {
    all: ["languages"] as const,
    lists: () => [...queryKeys.languages.all, "list"] as const,
    list: (filters: LanguageFilters) =>
      [...queryKeys.languages.lists(), filters] as const,
    details: () => [...queryKeys.languages.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.languages.details(), id] as const,
    visible: () => [...queryKeys.languages.all, "visible"] as const,
    popular: (limit?: number) =>
      [...queryKeys.languages.all, "popular", limit] as const,
  },
  frameworks: {
    all: ["frameworks"] as const,
    lists: () => [...queryKeys.frameworks.all, "list"] as const,
    list: (filters: FrameworkFilters) =>
      [...queryKeys.frameworks.lists(), filters] as const,
    details: () => [...queryKeys.frameworks.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.frameworks.details(), id] as const,
    visible: () => [...queryKeys.frameworks.all, "visible"] as const,
    popular: (limit?: number) =>
      [...queryKeys.frameworks.all, "popular", limit] as const,
  },
  settings: {
    all: ["settings"] as const,
    lists: () => [...queryKeys.settings.all, "list"] as const,
    detail: (key: string) =>
      [...queryKeys.settings.all, "detail", key] as const,
  },
};

// Project hooks
export const useProjects = (filters?: ProjectFilters) => {
  return useQuery({
    queryKey: queryKeys.projects.list(filters || {}),
    queryFn: () => projectApi.searchProjects(filters || {}),
    enabled: !!filters,
  });
};

export const useVisibleProjects = () => {
  return useQuery({
    queryKey: queryKeys.projects.visible(),
    queryFn: () => projectApi.getVisibleProjects(),
  });
};

export const useFeaturedProjects = (limit?: number) => {
  return useQuery({
    queryKey: queryKeys.projects.featured(limit),
    queryFn: () => projectApi.getFeaturedProjects(limit),
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: () => projectApi.getProjectById(id),
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewProject) => projectApi.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewProject> }) =>
      projectApi.updateProject(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectApi.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
};

// Language hooks
export const useLanguages = (filters?: LanguageFilters) => {
  return useQuery({
    queryKey: queryKeys.languages.list(filters || {}),
    queryFn: () => languageApi.searchLanguages(filters || {}),
    enabled: !!filters,
  });
};

export const useVisibleLanguages = () => {
  return useQuery({
    queryKey: queryKeys.languages.visible(),
    queryFn: () => languageApi.getVisibleLanguages(),
  });
};

export const useLanguage = (id: string) => {
  return useQuery({
    queryKey: queryKeys.languages.detail(id),
    queryFn: () => languageApi.getLanguageById(id),
    enabled: !!id,
  });
};

export const useCreateLanguage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewLanguage) => languageApi.createLanguage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.languages.all });
    },
  });
};

export const useUpdateLanguage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewLanguage> }) =>
      languageApi.updateLanguage(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.languages.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.languages.all });
    },
  });
};

export const useDeleteLanguage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => languageApi.deleteLanguage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.languages.all });
    },
  });
};

// Framework hooks
export const useFrameworks = (filters?: FrameworkFilters) => {
  return useQuery({
    queryKey: queryKeys.frameworks.list(filters || {}),
    queryFn: () => frameworkApi.searchFrameworks(filters || {}),
    enabled: !!filters,
  });
};

export const useVisibleFrameworks = () => {
  return useQuery({
    queryKey: queryKeys.frameworks.visible(),
    queryFn: () => frameworkApi.getVisibleFrameworks(),
  });
};

export const useFramework = (id: string) => {
  return useQuery({
    queryKey: queryKeys.frameworks.detail(id),
    queryFn: () => frameworkApi.getFrameworkById(id),
    enabled: !!id,
  });
};

export const useCreateFramework = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewFramework) => frameworkApi.createFramework(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.frameworks.all });
    },
  });
};

export const useUpdateFramework = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewFramework> }) =>
      frameworkApi.updateFramework(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.frameworks.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.frameworks.all });
    },
  });
};

export const useDeleteFramework = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => frameworkApi.deleteFramework(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.frameworks.all });
    },
  });
};

// Settings hooks
export const useSettings = () => {
  return useQuery({
    queryKey: queryKeys.settings.lists(),
    queryFn: () => settingsApi.getAllSettings(),
  });
};

export const useSetting = (key: string) => {
  return useQuery({
    queryKey: queryKeys.settings.detail(key),
    queryFn: () => settingsApi.getSettingByKey(key),
    enabled: !!key,
  });
};

export const useUpdateSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      settingsApi.updateSetting(key, value),
    onSuccess: (_, { key }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.settings.detail(key),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
    },
  });
};
