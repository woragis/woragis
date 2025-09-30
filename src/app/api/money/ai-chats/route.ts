import { NextRequest } from "next/server";
import { aiChatsService } from "@/server/services/money";
import { authMiddleware } from "@/lib/auth";
import { handleServiceResult, withErrorHandling, handleAuthError } from "@/utils/response-helpers";

// GET /api/money/ai-chats - Get all chats
export const GET = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }
  
  const { searchParams } = new URL(request.url);
  const ideaNodeId = searchParams.get("ideaNodeId");
  const agent = searchParams.get("agent");
  const archived = searchParams.get("archived");
  const visible = searchParams.get("visible");
  const search = searchParams.get("search");
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");

  if (ideaNodeId) {
    const result = await aiChatsService.getChatsByIdeaNode(ideaNodeId, authResult.userId);
    return handleServiceResult(result, "Chats fetched successfully");
  }

  const filters = {
    agent: agent || undefined,
    archived: archived === "true" ? true : undefined,
    visible: visible === "true" ? true : undefined,
    search: search || undefined,
    limit: limit ? parseInt(limit) : undefined,
    offset: offset ? parseInt(offset) : undefined,
  };

  const result = await aiChatsService.searchChats(filters, authResult.userId);
  return handleServiceResult(result, "Chats fetched successfully");
});

// POST /api/money/ai-chats - Create new chat
export const POST = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }
  
  const data = await request.json();
  const result = await aiChatsService.createChat(data, authResult.userId!);
  return handleServiceResult(result, "Chat created successfully");
});
