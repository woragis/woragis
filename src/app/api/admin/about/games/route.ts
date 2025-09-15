import { NextRequest } from "next/server";
import { gameService } from "@/server/services";
import { authMiddleware } from "@/lib/auth-middleware";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
} from "@/utils/response-helpers";
import type { NewGame, GameFilters } from "@/types";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const { searchParams } = new URL(request.url);
  const filters: GameFilters = {
    search: searchParams.get("search") || undefined,
    category: searchParams.get("category") || undefined,
    limit: searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined,
    offset: searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : undefined,
  };

  const result = await gameService.getAllGames(filters, authResult.userId);
  return handleServiceResult(result, "Games fetched successfully");
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const body = await request.json();
  const gameData: NewGame = body;

  const result = await gameService.createGame(gameData, authResult.userId);
  return handleServiceResult(result, "Game created successfully", 201);
});
