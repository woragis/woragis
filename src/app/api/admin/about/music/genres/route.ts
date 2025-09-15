import { NextRequest } from "next/server";
import { musicGenreService } from "@/server/services";
import { authMiddleware } from "@/lib/auth-middleware";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
} from "@/utils/response-helpers";
import type { NewMusicGenre, MusicGenreFilters } from "@/types";

// GET /api/admin/about/music/genres - Get all music genres
export const GET = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  const { searchParams } = new URL(request.url);
  const filters: MusicGenreFilters = {
    visible:
      searchParams.get("visible") === "true"
        ? true
        : searchParams.get("visible") === "false"
        ? false
        : undefined,
    search: searchParams.get("search") || undefined,
    limit: searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined,
    offset: searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : undefined,
  };

  const result = await musicGenreService.searchGenres(filters);
  return handleServiceResult(result, "Music genres fetched successfully");
});

// POST /api/admin/about/music/genres - Create new music genre
export const POST = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const body = await request.json();
  const genreData: NewMusicGenre = body;

  const result = await musicGenreService.createGenre(
    genreData,
    authResult.userId
  );
  return handleServiceResult(result, "Music genre created successfully", 201);
});
