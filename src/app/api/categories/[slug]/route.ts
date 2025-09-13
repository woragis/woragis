import { NextRequest } from "next/server";
import { categoryService } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
  notFoundResponse,
} from "@/utils/response-helpers";

// GET /api/categories/[slug] - Get public category by slug
export const GET = withErrorHandling(
  async (request: NextRequest, { params }: { params: { slug: string } }) => {
    const { slug } = params;

    const result = await categoryService.getPublicCategoryBySlug(slug);

    if (!result.success) {
      return notFoundResponse(result.error || "Category not found");
    }

    return handleServiceResult(result, "Category fetched successfully");
  }
);
