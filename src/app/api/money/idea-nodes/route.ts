import { NextRequest } from "next/server";
import { ideaNodesService } from "@/server/services/money";
import { authMiddleware } from "@/lib/auth";
import { handleServiceResult, withErrorHandling, handleAuthError } from "@/utils/response-helpers";

// GET /api/money/idea-nodes - Get all nodes for an idea
export const GET = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }
  
  const { searchParams } = new URL(request.url);
  const ideaId = searchParams.get("ideaId");
  
  if (!ideaId) {
    return new Response(JSON.stringify({ error: "ideaId is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = await ideaNodesService.getAllNodes(ideaId);
  return handleServiceResult(result, "Nodes fetched successfully");
});

// POST /api/money/idea-nodes - Create new node
export const POST = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }
  
  const data = await request.json();
  const result = await ideaNodesService.createNode(data);
  return handleServiceResult(result, "Node created successfully");
});
