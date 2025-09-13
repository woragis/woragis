import { NextRequest } from "next/server";
import { tagService } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
} from "@/utils/response-helpers";
import type { NewTag, TagFilters } from "@/types";

// GET /api/admin/tags - Get all tags with optional filtering
export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const filters: TagFilters = {
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

  const result = await tagService.searchTags(filters);
  return handleServiceResult(result, "Tags fetched successfully");
});

// POST /api/admin/tags - Create new tag
export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();
  const tagData: NewTag = body;

  const result = await tagService.createTag(tagData);
  return handleServiceResult(result, "Tag created successfully", 201);
});
