import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "@/server/services";
import type { NewCategory, CategoryFilters } from "@/types";

// GET /api/admin/categories - Get all categories with optional filtering
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filters: CategoryFilters = {
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

  const result = await categoryService.searchCategories(filters);

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}

// POST /api/admin/categories - Create new category
export async function POST(request: NextRequest) {
  const body = await request.json();
  const categoryData: NewCategory = body;

  const result = await categoryService.createCategory(categoryData);

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result, { status: 201 });
}
