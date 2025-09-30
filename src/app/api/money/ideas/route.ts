import { NextRequest } from "next/server";
import { ideasService } from "@/server/services/money";
import { authMiddleware } from "@/lib/auth";
import { handleServiceResult, withErrorHandling, handleAuthError } from "@/utils/response-helpers";

// GET /api/money/ideas - Get all ideas for authenticated user
export const GET = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }
  
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");
  const visible = searchParams.get("visible");
  const publicOnly = searchParams.get("public");
  const search = searchParams.get("search");
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");

  const filters = {
    featured: featured === "true" ? true : undefined,
    visible: visible === "true" ? true : undefined,
    public: publicOnly === "true" ? true : undefined,
    search: search || undefined,
    limit: limit ? parseInt(limit) : undefined,
    offset: offset ? parseInt(offset) : undefined,
  };

  const result = await ideasService.searchIdeas(filters, authResult.userId);
  return handleServiceResult(result, "Ideas fetched successfully");
});

// POST /api/money/ideas - Create new idea
export const POST = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }
  
  const data = await request.json();
  const result = await ideasService.createIdea(data, authResult.userId!);
  return handleServiceResult(result, "Idea created successfully");
});
