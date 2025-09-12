import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "@/server/services";

// GET /api/categories/[slug] - Get public category by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const result = await categoryService.getPublicCategoryBySlug(slug);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  if (!result.data) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json(result.data);
}
