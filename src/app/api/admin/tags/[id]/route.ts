import { NextRequest } from "next/server";
import { tagService } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
  notFoundResponse,
  deletedResponse,
} from "@/utils/response-helpers";
import type { NewTag } from "@/types";

// GET /api/admin/tags/[id] - Get tag by ID
export const GET = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params;
    const result = await tagService.getTagById(id);

    if (!result.success) {
      return notFoundResponse(result.error || "Tag not found");
    }

    return handleServiceResult(result, "Tag fetched successfully");
  }
);

// PUT /api/admin/tags/[id] - Update tag
export const PUT = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params;
    const body = await request.json();
    const tagData: Partial<NewTag> = body;

    const result = await tagService.updateTag(id, tagData);

    if (!result.success) {
      return notFoundResponse(result.error || "Tag not found");
    }

    return handleServiceResult(result, "Tag updated successfully");
  }
);

// DELETE /api/admin/tags/[id] - Delete tag
export const DELETE = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params;
    const result = await tagService.deleteTag(id);

    if (!result.success) {
      return notFoundResponse(result.error || "Tag not found");
    }

    return deletedResponse("Tag deleted successfully");
  }
);
