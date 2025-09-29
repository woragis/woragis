import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/api";

export interface UploadFile {
  filename: string;
  relativePath: string;
  fullPath: string;
  url: string;
  size: number;
  createdAt: Date;
  modifiedAt: Date;
  extension: string;
  isReferenced: boolean;
  category: string;
  canDelete: boolean;
}

export interface UploadStats {
  total: number;
  referenced: number;
  orphaned: number;
  byCategory: Record<string, {
    total: number;
    referenced: number;
    orphaned: number;
  }>;
}

export interface UploadsResponse {
  files: UploadFile[];
  stats: UploadStats;
}

export const useUploads = () => {
  return useQuery<UploadsResponse>({
    queryKey: ["uploads"],
    queryFn: async () => {
      const response = await apiClient.get("/admin/uploads");
      // The API returns { success: true, data: { files: [], stats: {} } }
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDeleteUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (filePath: string) => {
      const response = await apiClient.delete(`/admin/uploads?path=${encodeURIComponent(filePath)}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch uploads data
      queryClient.invalidateQueries({ queryKey: ["uploads"] });
    },
  });
};

export const useUploadStats = () => {
  const { data, isLoading, error } = useUploads();
  
  return {
    stats: data?.stats,
    isLoading,
    error,
  };
};

export const useOrphanedFiles = () => {
  const { data, isLoading, error } = useUploads();
  
  return {
    files: data?.files.filter(file => !file.isReferenced) || [],
    isLoading,
    error,
  };
};

export const useFilesByCategory = (category?: string) => {
  const { data, isLoading, error } = useUploads();
  
  const files = category 
    ? data?.files.filter(file => file.category === category) || []
    : data?.files || [];
  
  return {
    files,
    isLoading,
    error,
  };
};
