import { NextRequest } from "next/server";
import { animeService } from "@/server/services";
import { authMiddleware } from "@/lib/auth";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
} from "@/utils/response-helpers";
import type { NewAnime, AnimeFilters } from "@/types";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");
  const validStatuses = [
    "want_to_watch",
    "watching",
    "completed",
    "dropped",
    "on_hold",
  ];
  const status =
    statusParam && validStatuses.includes(statusParam)
      ? (statusParam as any)
      : undefined;

  const filters: AnimeFilters = {
    search: searchParams.get("search") || undefined,
    status,
    limit: searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined,
    offset: searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!)
      : undefined,
  };

  const result = await animeService.getAllAnime(filters, authResult.userId);
  return handleServiceResult(result, "Anime fetched successfully");
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
  const animeData: NewAnime = body;

  const result = await animeService.createAnime(animeData, authResult.userId);
  return handleServiceResult(result, "Anime created successfully", 201);
});
