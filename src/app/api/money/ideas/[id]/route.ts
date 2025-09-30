import { NextRequest } from "next/server";
import { ideasService } from "@/server/services/money";
import { authMiddleware } from "@/lib/auth";
import { handleServiceResult, withErrorHandling, handleAuthError } from "@/utils/response-helpers";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/money/ideas/[id] - Get idea by ID
export const GET = withErrorHandling(async (request: NextRequest, context: RouteContext) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }
  const { id } = await context.params;
  
  const result = await ideasService.getIdeaById(id, authResult.userId);
  return handleServiceResult(result, "Idea fetched successfully");
});

// PATCH /api/money/ideas/[id] - Update idea
export const PATCH = withErrorHandling(async (request: NextRequest, context: RouteContext) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }
  const { id } = await context.params;
  
  const data = await request.json();
  const result = await ideasService.updateIdea(id, data, authResult.userId);
  return handleServiceResult(result, "Idea updated successfully");
});

// DELETE /api/money/ideas/[id] - Delete idea
export const DELETE = withErrorHandling(async (request: NextRequest, context: RouteContext) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }
  const { id } = await context.params;
  
  const result = await ideasService.deleteIdea(id, authResult.userId);
  return handleServiceResult(result, "Idea deleted successfully");
});
