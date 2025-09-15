import { NextRequest } from "next/server";
import { lastListenedSongService } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
  notFoundResponse,
  deletedResponse,
} from "@/utils/response-helpers";
import type { NewLastListenedSong } from "@/types";

// GET /api/admin/about/music/songs/[id] - Get last listened song by ID
export const GET = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params;
    const result = await lastListenedSongService.getSongById(id);

    if (!result.success) {
      return notFoundResponse(result.error || "Last listened song not found");
    }

    return handleServiceResult(
      result,
      "Last listened song fetched successfully"
    );
  }
);

// PUT /api/admin/about/music/songs/[id] - Update last listened song
export const PUT = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params;
    const body = await request.json();
    const songData: Partial<NewLastListenedSong> = body;

    const result = await lastListenedSongService.updateSong(id, songData);

    if (!result.success) {
      return notFoundResponse(result.error || "Last listened song not found");
    }

    return handleServiceResult(
      result,
      "Last listened song updated successfully"
    );
  }
);

// DELETE /api/admin/about/music/songs/[id] - Delete last listened song
export const DELETE = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params;
    const result = await lastListenedSongService.deleteSong(id);

    if (!result.success) {
      return notFoundResponse(result.error || "Last listened song not found");
    }

    return deletedResponse("Last listened song deleted successfully");
  }
);
