import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "@/server/services";

// GET /api/categories - Get public categories for frontend
export async function GET(request: NextRequest) {
  const result = await categoryService.getPublicCategories();

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result.data);
}
