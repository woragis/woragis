import { NextRequest } from "next/server";
import { categoryService } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
  notFoundResponse,
  deletedResponse,
} from "@/utils/response-helpers";
import type { NewCategory } from "@/types";

// GET /api/admin/categories/[id] - Get category by ID
export const GET = withErrorHandling(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const result = await categoryService.getCategoryById(params.id);

    if (!result.success) {
      return notFoundResponse(result.error || "Category not found");
    }

    return handleServiceResult(result, "Category fetched successfully");
  }
);

// PUT /api/admin/categories/[id] - Update category
export const PUT = withErrorHandling(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const body = await request.json();
    const categoryData: Partial<NewCategory> = body;

    const result = await categoryService.updateCategory(
      params.id,
      categoryData
    );

    if (!result.success) {
      return notFoundResponse(result.error || "Category not found");
    }

    return handleServiceResult(result, "Category updated successfully");
  }
);

// DELETE /api/admin/categories/[id] - Delete category
export const DELETE = withErrorHandling(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const result = await categoryService.deleteCategory(params.id);

    if (!result.success) {
      return notFoundResponse(result.error || "Category not found");
    }

    return deletedResponse("Category deleted successfully");
  }
);
