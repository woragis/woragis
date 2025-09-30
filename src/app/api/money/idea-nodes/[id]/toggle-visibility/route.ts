import { NextRequest } from "next/server";
import { ideaNodesService } from "@/server/services/money";
import { authMiddleware } from "@/lib/auth";
import { handleServiceResult, withErrorHandling, handleAuthError } from "@/utils/response-helpers";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PATCH /api/money/idea-nodes/[id]/toggle-visibility
export const PATCH = withErrorHandling(async (request: NextRequest, context: RouteContext) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }
  const { id } = await context.params;
  
  const result = await ideaNodesService.toggleNodeVisibility(id);
  return handleServiceResult(result, "Node visibility toggled successfully");
});
