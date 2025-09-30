import { NextRequest } from "next/server";
import { ideaNodesService } from "@/server/services/money";
import { authMiddleware } from "@/lib/auth";
import { handleServiceResult, withErrorHandling, handleAuthError } from "@/utils/response-helpers";

// PATCH /api/money/idea-nodes/positions - Bulk update node positions
export const PATCH = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }
  
  const { positions } = await request.json();
  const result = await ideaNodesService.updateNodePositions(positions);
  return handleServiceResult(result, "Node positions updated successfully");
});
