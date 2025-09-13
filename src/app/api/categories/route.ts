import { NextRequest } from "next/server";
import { categoryService } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
} from "@/utils/response-helpers";

// GET /api/categories - Get public categories for frontend
export const GET = withErrorHandling(async (request: NextRequest) => {
  const result = await categoryService.getPublicCategories();
  return handleServiceResult(result, "Categories fetched successfully");
});
