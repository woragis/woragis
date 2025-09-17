import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { instrumentsApi } from "@/lib/api/about/instruments";
import {
  type Instrument,
  type NewInstrument,
} from "@/server/db/schemas/about/instruments";

// Query keys
const queryKeys = {
  instruments: {
    admin: ["instruments", "admin"] as const,
    public: ["instruments", "public"] as const,
    detail: (id: string) => ["instruments", "admin", id] as const,
  },
};

// Admin hooks
export const useInstruments = () => {
  return useQuery({
    queryKey: queryKeys.instruments.admin,
    queryFn: async () => {
      const response = await instrumentsApi.getInstruments();
      return response.data || [];
    },
  });
};

export const useInstrument = (id: string) => {
  return useQuery({
    queryKey: queryKeys.instruments.detail(id),
    queryFn: async () => {
      const response = await instrumentsApi.getInstrument(id);
      return response.data || null;
    },
    enabled: !!id,
  });
};

export const useCreateInstrument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (instrument: NewInstrument) => {
      const response = await instrumentsApi.createInstrument(instrument);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.instruments.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.instruments.public });
    },
  });
};

export const useUpdateInstrument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      instrument,
    }: {
      id: string;
      instrument: Partial<NewInstrument>;
    }) => {
      const response = await instrumentsApi.updateInstrument(id, instrument);
      return response.data!;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.instruments.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.instruments.public });
      queryClient.invalidateQueries({
        queryKey: queryKeys.instruments.detail(id),
      });
    },
  });
};

export const useDeleteInstrument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await instrumentsApi.deleteInstrument(id);
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.instruments.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.instruments.public });
    },
  });
};

export const useToggleInstrumentVisibility = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await instrumentsApi.toggleInstrumentVisibility(id);
      if (!response.success) {
        throw new Error(
          response.error || "Failed to toggle instrument visibility"
        );
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.instruments.admin });
      queryClient.invalidateQueries({ queryKey: queryKeys.instruments.public });
      queryClient.invalidateQueries({
        queryKey: queryKeys.instruments.detail(variables),
      });
    },
  });
};

// Public hooks
export const usePublicInstruments = () => {
  return useQuery({
    queryKey: queryKeys.instruments.public,
    queryFn: async () => {
      const response = await instrumentsApi.getPublicInstruments();
      return response.data || [];
    },
  });
};
