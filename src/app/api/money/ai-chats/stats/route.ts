import { NextRequest } from "next/server";
import { aiChatsService } from "@/server/services/money";
import { authMiddleware } from "@/lib/auth";
import { handleServiceResult, withErrorHandling, handleAuthError } from "@/utils/response-helpers";

// GET /api/money/ai-chats/stats - Get chat statistics
export const GET = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }
  
  const { searchParams } = new URL(request.url);
  const ideaNodeId = searchParams.get("ideaNodeId");

  if (ideaNodeId) {
    const result = await aiChatsService.getChatStatsByNode(ideaNodeId, authResult.userId);
    return handleServiceResult(result, "Chat stats fetched successfully");
  }

  const result = await aiChatsService.getChatStats(authResult.userId);
  return handleServiceResult(result, "Chat stats fetched successfully");
});
