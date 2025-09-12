import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "@/server/services";
import { requireAuth, type AuthenticatedUser } from "@/lib/auth-middleware";
import type { NewCategory, CategoryFilters } from "@/types";

// GET /api/admin/categories - Get all categories with optional filtering
export const GET = requireAuth(
  async (request: NextRequest, user: AuthenticatedUser) => {
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

    const result = await categoryService.searchCategories(filters, user.userId);

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
  }
);

// POST /api/admin/categories - Create new category
export const POST = requireAuth(
  async (request: NextRequest, user: AuthenticatedUser) => {
    const body = await request.json();
    const categoryData: NewCategory = body;

    const result = await categoryService.createCategory(
      categoryData,
      user.userId
    );

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result, { status: 201 });
  }
);
