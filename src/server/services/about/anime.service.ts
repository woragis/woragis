import { animeRepository } from "@/server/repositories";
import type { Anime, NewAnime, AnimeFilters, ApiResponse } from "@/types";
import { BaseService } from "../base.service";

export class AnimeService extends BaseService {
  async getAllAnime(filters?: AnimeFilters): Promise<ApiResponse<Anime[]>> {
    try {
      const anime = filters
        ? await animeRepository.search(filters)
        : await animeRepository.findAll();
      return this.success(anime);
    } catch (error) {
      return this.handleError(error, "getAllAnime");
    }
  }

  async getVisibleAnime(): Promise<ApiResponse<Anime[]>> {
    try {
      const anime = await animeRepository.findVisible();
      return this.success(anime);
    } catch (error) {
      return this.handleError(error, "getVisibleAnime");
    }
  }

  async getAnimeById(id: string): Promise<ApiResponse<Anime | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid anime ID",
        };
      }

      const anime = await animeRepository.findById(id);
      return this.success(anime);
    } catch (error) {
      return this.handleError(error, "getAnimeById");
    }
  }

  async createAnime(animeData: NewAnime): Promise<ApiResponse<Anime>> {
    try {
      const requiredFields: (keyof NewAnime)[] = ["title"];
      const validationErrors = this.validateRequired(animeData, requiredFields);

      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation failed: ${validationErrors.join(", ")}`,
        };
      }

      const anime = await animeRepository.create(animeData);
      return this.success(anime, "Anime created successfully");
    } catch (error) {
      return this.handleError(error, "createAnime");
    }
  }

  async updateAnime(
    id: string,
    animeData: Partial<NewAnime>
  ): Promise<ApiResponse<Anime | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid anime ID",
        };
      }

      const anime = await animeRepository.update(id, animeData);
      if (!anime) {
        return {
          success: false,
          error: "Anime not found",
        };
      }

      return this.success(anime, "Anime updated successfully");
    } catch (error) {
      return this.handleError(error, "updateAnime");
    }
  }

  async deleteAnime(id: string): Promise<ApiResponse<void>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid anime ID",
        };
      }

      await animeRepository.delete(id);
      return this.success(undefined, "Anime deleted successfully");
    } catch (error) {
      return this.handleError(error, "deleteAnime");
    }
  }

  async searchAnime(filters: AnimeFilters): Promise<ApiResponse<Anime[]>> {
    try {
      const anime = await animeRepository.search(filters);
      return this.success(anime);
    } catch (error) {
      return this.handleError(error, "searchAnime");
    }
  }
}
