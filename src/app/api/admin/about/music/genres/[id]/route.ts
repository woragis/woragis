import { NextRequest } from "next/server";
import { musicGenreService } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
  notFoundResponse,
  deletedResponse,
} from "@/utils/response-helpers";
import type { NewMusicGenre } from "@/types";

// GET /api/admin/about/music/genres/[id] - Get music genre by ID
export const GET = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params;
    const result = await musicGenreService.getGenreById(id);

    if (!result.success) {
      return notFoundResponse(result.error || "Music genre not found");
    }

    return handleServiceResult(result, "Music genre fetched successfully");
  }
);

// PUT /api/admin/about/music/genres/[id] - Update music genre
export const PUT = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params;
    const body = await request.json();
    const genreData: Partial<NewMusicGenre> = body;

    const result = await musicGenreService.updateGenre(id, genreData);

    if (!result.success) {
      return notFoundResponse(result.error || "Music genre not found");
    }

    return handleServiceResult(result, "Music genre updated successfully");
  }
);

// DELETE /api/admin/about/music/genres/[id] - Delete music genre
export const DELETE = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params;
    const result = await musicGenreService.deleteGenre(id);

    if (!result.success) {
      return notFoundResponse(result.error || "Music genre not found");
    }

    return deletedResponse("Music genre deleted successfully");
  }
);
