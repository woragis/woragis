import { gameRepository } from "@/server/repositories";
import type { Game, NewGame, GameFilters, ApiResponse } from "@/types";
import { BaseService } from "../base.service";

export class GameService extends BaseService {
  async getAllGames(filters?: GameFilters, userId?: string): Promise<ApiResponse<Game[]>> {
    try {
      const games = filters
        ? await gameRepository.search(filters, userId)
        : await gameRepository.findAll(userId);
      return this.success(games);
    } catch (error) {
      return this.handleError(error, "getAllGames");
    }
  }

  async getVisibleGames(): Promise<ApiResponse<Game[]>> {
    try {
      const games = await gameRepository.findVisible();
      return this.success(games);
    } catch (error) {
      return this.handleError(error, "getVisibleGames");
    }
  }

  async getGameById(id: string): Promise<ApiResponse<Game | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid game ID",
        };
      }

      const game = await gameRepository.findById(id);
      return this.success(game);
    } catch (error) {
      return this.handleError(error, "getGameById");
    }
  }

  async createGame(gameData: NewGame, userId: string): Promise<ApiResponse<Game>> {
    try {
      const requiredFields: (keyof NewGame)[] = ["title"];
      const validationErrors = this.validateRequired(gameData, requiredFields);

      if (validationErrors.length > 0) {
        return {
          success: false,
          error: `Validation failed: ${validationErrors.join(", ")}`,
        };
      }

      const gameWithUserId = { ...gameData, userId };
      const game = await gameRepository.create(gameWithUserId);
      return this.success(game, "Game created successfully");
    } catch (error) {
      return this.handleError(error, "createGame");
    }
  }

  async updateGame(
    id: string,
    gameData: Partial<NewGame>
  ): Promise<ApiResponse<Game | null>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid game ID",
        };
      }

      const game = await gameRepository.update(id, gameData);
      if (!game) {
        return {
          success: false,
          error: "Game not found",
        };
      }

      return this.success(game, "Game updated successfully");
    } catch (error) {
      return this.handleError(error, "updateGame");
    }
  }

  async deleteGame(id: string): Promise<ApiResponse<void>> {
    try {
      if (!this.validateId(id)) {
        return {
          success: false,
          error: "Invalid game ID",
        };
      }

      await gameRepository.delete(id);
      return this.success(undefined, "Game deleted successfully");
    } catch (error) {
      return this.handleError(error, "deleteGame");
    }
  }

  async searchGames(filters: GameFilters): Promise<ApiResponse<Game[]>> {
    try {
      const games = await gameRepository.search(filters);
      return this.success(games);
    } catch (error) {
      return this.handleError(error, "searchGames");
    }
  }
}
