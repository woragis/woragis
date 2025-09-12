import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "@/server/services";
import type { NewCategory } from "@/types";

// GET /api/admin/categories/[id] - Get category by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = await categoryService.getCategoryById(params.id);

  if (!result.success) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result);
}

// PUT /api/admin/categories/[id] - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const categoryData: Partial<NewCategory> = body;

  const result = await categoryService.updateCategory(params.id, categoryData);

  if (!result.success) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result);
}

// DELETE /api/admin/categories/[id] - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = await categoryService.deleteCategory(params.id);

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result);
}
