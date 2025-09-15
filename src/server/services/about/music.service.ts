import {
  musicGenreRepository,
  lastListenedSongRepository,
} from "@/server/repositories";
import type {
  MusicGenre,
  NewMusicGenre,
  MusicGenreFilters,
  LastListenedSong,
  NewLastListenedSong,
  LastListenedSongFilters,
  ApiResponse,
} from "@/types";
import { BaseService } from "../base.service";

export class MusicGenreService extends BaseService {
  async getAllGenres(): Promise<ApiResponse<MusicGenre[]>> {
    try {
      const genres = await musicGenreRepository.findAll();
      return this.success(genres);
    } catch (error) {
      return this.handleError(error, "getAllGenres");
    }
  }

  async getVisibleGenres(): Promise<ApiResponse<MusicGenre[]>> {
    try {
      const genres = await musicGenreRepository.findVisible();
      return this.success(genres);
    } catch (error) {
      return this.handleError(error, "getVisibleGenres");
    }
  }

  async getGenreById(id: string): Promise<ApiResponse<MusicGenre | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid genre ID",
        };
      }

      const genre = await musicGenreRepository.findById(id);
      return this.success(genre);
    } catch (error) {
      return this.handleError(error, "getGenreById");
    }
  }

  async createGenre(
    genreData: NewMusicGenre,
    userId: string
  ): Promise<ApiResponse<MusicGenre>> {
    try {
      const requiredFields: (keyof NewMusicGenre)[] = ["name"];
      const validationErrors = this.validateRequired(genreData, requiredFields);

      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation failed: ${validationErrors.join(", ")}`,
        };
      }

      const genreWithUser = { ...genreData, userId };
      const genre = await musicGenreRepository.create(genreWithUser);
      return this.success(genre, "Genre created successfully");
    } catch (error) {
      return this.handleError(error, "createGenre");
    }
  }

  async updateGenre(
    id: string,
    genreData: Partial<NewMusicGenre>
  ): Promise<ApiResponse<MusicGenre | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid genre ID",
        };
      }

      const genre = await musicGenreRepository.update(id, genreData);
      if (!genre) {
        return {
          success: false,
          error: "Genre not found",
        };
      }

      return this.success(genre, "Genre updated successfully");
    } catch (error) {
      return this.handleError(error, "updateGenre");
    }
  }

  async deleteGenre(id: string): Promise<ApiResponse<void>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid genre ID",
        };
      }

      await musicGenreRepository.delete(id);
      return this.success(undefined, "Genre deleted successfully");
    } catch (error) {
      return this.handleError(error, "deleteGenre");
    }
  }

  async searchGenres(
    filters: MusicGenreFilters
  ): Promise<ApiResponse<MusicGenre[]>> {
    try {
      const genres = await musicGenreRepository.search(filters);
      return this.success(genres);
    } catch (error) {
      return this.handleError(error, "searchGenres");
    }
  }
}

export class LastListenedSongService extends BaseService {
  async getAllSongs(): Promise<ApiResponse<LastListenedSong[]>> {
    try {
      const songs = await lastListenedSongRepository.findAll();
      return this.success(songs);
    } catch (error) {
      return this.handleError(error, "getAllSongs");
    }
  }

  async getVisibleSongs(): Promise<ApiResponse<LastListenedSong[]>> {
    try {
      const songs = await lastListenedSongRepository.findVisible();
      return this.success(songs);
    } catch (error) {
      return this.handleError(error, "getVisibleSongs");
    }
  }

  async getSongById(id: string): Promise<ApiResponse<LastListenedSong | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid song ID",
        };
      }

      const song = await lastListenedSongRepository.findById(id);
      return this.success(song);
    } catch (error) {
      return this.handleError(error, "getSongById");
    }
  }

  async createSong(
    songData: NewLastListenedSong,
    userId: string
  ): Promise<ApiResponse<LastListenedSong>> {
    try {
      const requiredFields: (keyof NewLastListenedSong)[] = ["title", "artist"];
      const validationErrors = this.validateRequired(songData, requiredFields);

      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation failed: ${validationErrors.join(", ")}`,
        };
      }

      const songWithUser = { ...songData, userId };
      const song = await lastListenedSongRepository.create(songWithUser);
      return this.success(song, "Song created successfully");
    } catch (error) {
      return this.handleError(error, "createSong");
    }
  }

  async updateSong(
    id: string,
    songData: Partial<NewLastListenedSong>
  ): Promise<ApiResponse<LastListenedSong | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid song ID",
        };
      }

      const song = await lastListenedSongRepository.update(id, songData);
      if (!song) {
        return {
          success: false,
          error: "Song not found",
        };
      }

      return this.success(song, "Song updated successfully");
    } catch (error) {
      return this.handleError(error, "updateSong");
    }
  }

  async deleteSong(id: string): Promise<ApiResponse<void>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid song ID",
        };
      }

      await lastListenedSongRepository.delete(id);
      return this.success(undefined, "Song deleted successfully");
    } catch (error) {
      return this.handleError(error, "deleteSong");
    }
  }

  async searchSongs(
    filters: LastListenedSongFilters
  ): Promise<ApiResponse<LastListenedSong[]>> {
    try {
      const songs = await lastListenedSongRepository.search(filters);
      return this.success(songs);
    } catch (error) {
      return this.handleError(error, "searchSongs");
    }
  }
}
