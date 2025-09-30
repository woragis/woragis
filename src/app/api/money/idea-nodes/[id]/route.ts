import { NextRequest } from "next/server";
import { ideaNodesService } from "@/server/services/money";
import { authMiddleware } from "@/lib/auth";
import { handleServiceResult, withErrorHandling, handleAuthError } from "@/utils/response-helpers";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/money/idea-nodes/[id] - Get node by ID
export const GET = withErrorHandling(async (request: NextRequest, context: RouteContext) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }
  const { id } = await context.params;
  
  const result = await ideaNodesService.getNodeById(id);
  return handleServiceResult(result, "Node fetched successfully");
});

// PATCH /api/money/idea-nodes/[id] - Update node
export const PATCH = withErrorHandling(async (request: NextRequest, context: RouteContext) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }
  const { id } = await context.params;
  
  const data = await request.json();
  const result = await ideaNodesService.updateNode(id, data);
  return handleServiceResult(result, "Node updated successfully");
});

// DELETE /api/money/idea-nodes/[id] - Delete node
export const DELETE = withErrorHandling(async (request: NextRequest, context: RouteContext) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }
  const { id } = await context.params;
  
  const result = await ideaNodesService.deleteNode(id);
  return handleServiceResult(result, "Node deleted successfully");
});
