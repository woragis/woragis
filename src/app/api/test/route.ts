import { NextRequest } from "next/server";
import { db } from "@/server/db";
import {
  successResponse,
  internalServerErrorResponse,
  withErrorHandling,
} from "@/utils/response-helpers";

export const GET = withErrorHandling(async (request: NextRequest) => {
  // Simple test query
  const result = await db.execute("SELECT 1 as test");
  return successResponse(result, "Database connection test successful");
});
