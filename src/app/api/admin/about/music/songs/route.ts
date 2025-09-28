import { NextRequest } from "next/server";
import { lastListenedSongService } from "@/server/services";
import { authMiddleware } from "@/lib/auth";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
} from "@/utils/response-helpers";
import type { NewLastListenedSong, LastListenedSongFilters } from "@/types";

// GET /api/admin/about/music/songs - Get all last listened songs
export const GET = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  const { searchParams } = new URL(request.url);
  const filters: LastListenedSongFilters = {
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

  const result = await lastListenedSongService.searchSongs(filters);
  return handleServiceResult(
    result,
    "Last listened songs fetched successfully"
  );
});

// POST /api/admin/about/music/songs - Create new last listened song
export const POST = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const body = await request.json();
  const songData: NewLastListenedSong = body;

  const result = await lastListenedSongService.createSong(
    songData,
    authResult.userId
  );
  return handleServiceResult(
    result,
    "Last listened song created successfully",
    201
  );
});
