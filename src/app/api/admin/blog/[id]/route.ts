import { NextRequest } from "next/server";
import { blogService } from "@/server/services";
import { authMiddleware } from "@/lib/auth";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
  notFoundResponse,
  badRequestResponse,
  deletedResponse,
} from "@/utils/response-helpers";

// GET /api/admin/blog/[id] - Get blog post by ID for admin
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
    const result = await blogService.getBlogPostById(id, authResult.userId);

    if (!result.success) {
      return notFoundResponse(result.error || "Blog post not found");
    }

    return handleServiceResult(result, "Blog post fetched successfully");
  }
);

// PUT /api/admin/blog/[id] - Update blog post
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

    // Handle date conversion for publishedAt
    const blogPostData = {
      ...body,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
    };

    const result = await blogService.updateBlogPost(
      id,
      blogPostData,
      authResult.userId
    );

    return handleServiceResult(result, "Blog post updated successfully");
  }
);

// DELETE /api/admin/blog/[id] - Delete blog post
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
    const result = await blogService.deleteBlogPost(id, authResult.userId);

    if (!result.success) {
      return notFoundResponse(result.error || "Blog post not found");
    }

    return deletedResponse("Blog post deleted successfully");
  }
);
