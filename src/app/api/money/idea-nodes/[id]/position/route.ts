import { NextRequest } from "next/server";
import { ideaNodesService } from "@/server/services/money";
import { authMiddleware } from "@/lib/auth";
import { handleServiceResult, withErrorHandling, handleAuthError } from "@/utils/response-helpers";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PATCH /api/money/idea-nodes/[id]/position - Update node position
export const PATCH = withErrorHandling(async (request: NextRequest, context: RouteContext) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }
  const { id } = await context.params;
  
  const { positionX, positionY } = await request.json();
  const result = await ideaNodesService.updateNodePosition(id, { positionX, positionY });
  return handleServiceResult(result, "Node position updated successfully");
});
