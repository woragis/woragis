import { NextRequest, NextResponse } from "next/server";
import { tagService } from "@/server/services";
import type { NewTag, TagFilters } from "@/types";

// GET /api/admin/tags - Get all tags with optional filtering
export async function GET(request: NextRequest) {
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

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}

// POST /api/admin/tags - Create new tag
export async function POST(request: NextRequest) {
  const body = await request.json();
  const tagData: NewTag = body;

  const result = await tagService.createTag(tagData);

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result, { status: 201 });
}
