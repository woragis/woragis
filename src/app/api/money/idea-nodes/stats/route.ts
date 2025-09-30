import { NextRequest } from "next/server";
import { ideaNodesService } from "@/server/services/money";
import { authMiddleware } from "@/lib/auth";
import { handleServiceResult, withErrorHandling, handleAuthError } from "@/utils/response-helpers";

// GET /api/money/idea-nodes/stats - Get node statistics
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

  const result = await ideaNodesService.getNodeStats(ideaId);
  return handleServiceResult(result, "Node stats fetched successfully");
});
