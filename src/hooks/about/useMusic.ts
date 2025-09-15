import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { musicGenreApi, lastListenedSongApi } from "@/lib/api";
import type {
  MusicGenre,
  NewMusicGenre,
  MusicGenreFilters,
  LastListenedSong,
  NewLastListenedSong,
  LastListenedSongFilters,
} from "@/types";

// Query keys for music genres
export const musicGenreKeys = {
  all: ["musicGenres"] as const,
  lists: () => [...musicGenreKeys.all, "list"] as const,
  list: (filters: MusicGenreFilters) =>
    [...musicGenreKeys.lists(), filters] as const,
  details: () => [...musicGenreKeys.all, "detail"] as const,
  detail: (id: string) => [...musicGenreKeys.details(), id] as const,
  public: () => [...musicGenreKeys.all, "public"] as const,
};

// Query keys for last listened songs
export const lastListenedSongKeys = {
  all: ["lastListenedSongs"] as const,
  lists: () => [...lastListenedSongKeys.all, "list"] as const,
  list: (filters: LastListenedSongFilters) =>
    [...lastListenedSongKeys.lists(), filters] as const,
  details: () => [...lastListenedSongKeys.all, "detail"] as const,
  detail: (id: string) => [...lastListenedSongKeys.details(), id] as const,
  public: () => [...lastListenedSongKeys.all, "public"] as const,
};

// Music Genre Hooks
export function useMusicGenres(filters: MusicGenreFilters = {}) {
  return useQuery({
    queryKey: musicGenreKeys.list(filters),
    queryFn: async () => {
      const response = await musicGenreApi.searchGenres(filters);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch music genres");
      }
      return response.data;
    },
  });
}

export function usePublicMusicGenres() {
  return useQuery({
    queryKey: musicGenreKeys.public(),
    queryFn: async () => {
      const response = await musicGenreApi.getVisibleGenres();
      if (!response.success || !response.data) {
        throw new Error(
          response.error || "Failed to fetch public music genres"
        );
      }
      return response.data;
    },
  });
}

export function useMusicGenre(id: string) {
  return useQuery({
    queryKey: musicGenreKeys.detail(id),
    queryFn: async () => {
      const response = await musicGenreApi.getGenreById(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch music genre");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateMusicGenre() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (genre: NewMusicGenre) => {
      const response = await musicGenreApi.createGenre(genre);
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to create music genre");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: musicGenreKeys.all });
    },
  });
}

export function useUpdateMusicGenre() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      genre,
    }: {
      id: string;
      genre: Partial<NewMusicGenre>;
    }) => {
      const response = await musicGenreApi.updateGenre(id, genre);
      if (!response.success) {
        throw new Error(response.error || "Failed to update music genre");
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: musicGenreKeys.all });
      queryClient.setQueryData(musicGenreKeys.detail(variables.id), data);
    },
  });
}

export function useDeleteMusicGenre() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await musicGenreApi.deleteGenre(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete music genre");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: musicGenreKeys.all });
    },
  });
}

export function useToggleMusicGenreVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await musicGenreApi.toggleGenreVisibility(id);
      if (!response.success) {
        throw new Error(
          response.error || "Failed to toggle music genre visibility"
        );
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: musicGenreKeys.all });
      queryClient.setQueryData(musicGenreKeys.detail(variables), data);
    },
  });
}

// Last Listened Song Hooks
export function useLastListenedSongs(filters: LastListenedSongFilters = {}) {
  return useQuery({
    queryKey: lastListenedSongKeys.list(filters),
    queryFn: async () => {
      const response = await lastListenedSongApi.searchSongs(filters);
      if (!response.success || !response.data) {
        throw new Error(
          response.error || "Failed to fetch last listened songs"
        );
      }
      return response.data;
    },
  });
}

export function usePublicLastListenedSongs() {
  return useQuery({
    queryKey: lastListenedSongKeys.public(),
    queryFn: async () => {
      const response = await lastListenedSongApi.getVisibleSongs();
      if (!response.success || !response.data) {
        throw new Error(
          response.error || "Failed to fetch public last listened songs"
        );
      }
      return response.data;
    },
  });
}

export function useLastListenedSong(id: string) {
  return useQuery({
    queryKey: lastListenedSongKeys.detail(id),
    queryFn: async () => {
      const response = await lastListenedSongApi.getSongById(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch last listened song");
      }
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateLastListenedSong() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (song: NewLastListenedSong) => {
      const response = await lastListenedSongApi.createSong(song);
      if (!response.success || !response.data) {
        throw new Error(
          response.error || "Failed to create last listened song"
        );
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lastListenedSongKeys.all });
    },
  });
}

export function useUpdateLastListenedSong() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      song,
    }: {
      id: string;
      song: Partial<NewLastListenedSong>;
    }) => {
      const response = await lastListenedSongApi.updateSong(id, song);
      if (!response.success) {
        throw new Error(
          response.error || "Failed to update last listened song"
        );
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: lastListenedSongKeys.all });
      queryClient.setQueryData(lastListenedSongKeys.detail(variables.id), data);
    },
  });
}

export function useDeleteLastListenedSong() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await lastListenedSongApi.deleteSong(id);
      if (!response.success) {
        throw new Error(
          response.error || "Failed to delete last listened song"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lastListenedSongKeys.all });
    },
  });
}

export function useToggleLastListenedSongVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await lastListenedSongApi.toggleSongVisibility(id);
      if (!response.success) {
        throw new Error(
          response.error || "Failed to toggle last listened song visibility"
        );
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: lastListenedSongKeys.all });
      queryClient.setQueryData(lastListenedSongKeys.detail(variables), data);
    },
  });
}
