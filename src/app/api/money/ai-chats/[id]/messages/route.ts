import { NextRequest } from "next/server";
import { aiChatsService } from "@/server/services/money";
import { authMiddleware } from "@/lib/auth";
import { handleServiceResult, withErrorHandling, handleAuthError } from "@/utils/response-helpers";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// DELETE /api/money/ai-chats/[id]/messages - Clear all messages
export const DELETE = withErrorHandling(async (request: NextRequest, context: RouteContext) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }
  const { id } = await context.params;
  
  const result = await aiChatsService.clearMessages(id, authResult.userId);
  return handleServiceResult(result, "Messages cleared successfully");
});
