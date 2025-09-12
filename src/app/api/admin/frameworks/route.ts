import { NextRequest, NextResponse } from "next/server";
import { frameworkService } from "@/server/services";
import type { NewFramework, FrameworkFilters } from "@/types";

// GET /api/admin/frameworks - Get all frameworks with optional filtering
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filters: FrameworkFilters = {
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

  const result = await frameworkService.searchFrameworks(filters);

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}

// POST /api/admin/frameworks - Create new framework
export async function POST(request: NextRequest) {
  const body = await request.json();
  const frameworkData: NewFramework = body;

  const result = await frameworkService.createFramework(frameworkData);

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result, { status: 201 });
}
