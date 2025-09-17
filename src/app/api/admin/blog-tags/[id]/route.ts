import { NextRequest } from "next/server";
import { blogTagService } from "@/server/services";
import { authMiddleware } from "@/lib/auth-middleware";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
  badRequestResponse,
} from "@/utils/response-helpers";

// GET /api/admin/blog-tags/[id] - Get blog tag by ID
export const GET = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return handleAuthError(authResult.error);
    }

    const { id } = await params;
    const result = await blogTagService.getBlogTagById(id);

    return handleServiceResult(result, "Blog tag fetched successfully");
  }
);

// PUT /api/admin/blog-tags/[id] - Update blog tag
export const PUT = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return handleAuthError(authResult.error);
    }

    const { id } = await params;
    const body = await request.json();

    const result = await blogTagService.updateBlogTag(id, body);

    return handleServiceResult(result, "Blog tag updated successfully");
  }
);

// DELETE /api/admin/blog-tags/[id] - Delete blog tag
export const DELETE = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return handleAuthError(authResult.error);
    }

    const { id } = await params;
    const result = await blogTagService.deleteBlogTag(id);

    return handleServiceResult(result, "Blog tag deleted successfully");
  }
);
