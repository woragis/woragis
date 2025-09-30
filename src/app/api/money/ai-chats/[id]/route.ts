import { NextRequest } from "next/server";
import { aiChatsService } from "@/server/services/money";
import { authMiddleware } from "@/lib/auth";
import { handleServiceResult, withErrorHandling, handleAuthError } from "@/utils/response-helpers";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/money/ai-chats/[id] - Get chat by ID
export const GET = withErrorHandling(async (request: NextRequest, context: RouteContext) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }
  const { id } = await context.params;
  
  const result = await aiChatsService.getChatById(id, authResult.userId);
  return handleServiceResult(result, "Chat fetched successfully");
});

// PATCH /api/money/ai-chats/[id] - Update chat
export const PATCH = withErrorHandling(async (request: NextRequest, context: RouteContext) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }
  const { id } = await context.params;
  
  const data = await request.json();
  const result = await aiChatsService.updateChat(id, data, authResult.userId);
  return handleServiceResult(result, "Chat updated successfully");
});

// DELETE /api/money/ai-chats/[id] - Delete chat
export const DELETE = withErrorHandling(async (request: NextRequest, context: RouteContext) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }
  const { id } = await context.params;
  
  const result = await aiChatsService.deleteChat(id, authResult.userId);
  return handleServiceResult(result, "Chat deleted successfully");
});
