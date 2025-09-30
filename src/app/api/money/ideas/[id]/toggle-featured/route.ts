import { NextRequest } from "next/server";
import { ideasService } from "@/server/services/money";
import { authMiddleware } from "@/lib/auth";
import { handleServiceResult, withErrorHandling, handleAuthError } from "@/utils/response-helpers";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PATCH /api/money/ideas/[id]/toggle-featured
export const PATCH = withErrorHandling(async (request: NextRequest, context: RouteContext) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }
  const { id } = await context.params;
  
  const result = await ideasService.toggleIdeaFeatured(id, authResult.userId);
  return handleServiceResult(result, "Idea featured status toggled successfully");
});
