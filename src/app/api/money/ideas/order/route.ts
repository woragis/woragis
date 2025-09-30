import { NextRequest } from "next/server";
import { ideasService } from "@/server/services/money";
import { authMiddleware } from "@/lib/auth";
import { handleServiceResult, withErrorHandling, handleAuthError } from "@/utils/response-helpers";

// PATCH /api/money/ideas/order - Update idea order
export const PATCH = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }
  
  const { orders } = await request.json();
  const result = await ideasService.updateIdeaOrder(orders, authResult.userId);
  return handleServiceResult(result, "Idea order updated successfully");
});
