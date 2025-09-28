import { NextRequest } from "next/server";
import { blogService } from "@/server/services";
import { authMiddleware } from "@/lib/auth";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
  badRequestResponse,
} from "@/utils/response-helpers";

// GET /api/admin/blog - Get all blog posts for admin
export const GET = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }

  const { searchParams } = new URL(request.url);
  const published = searchParams.get("published");
  const featured = searchParams.get("featured");
  const visible = searchParams.get("visible");
  const publicOnly = searchParams.get("public");
  const search = searchParams.get("search");
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");
  const sortBy = searchParams.get("sortBy");
  const sortOrder = searchParams.get("sortOrder");

  const filters = {
    published: published ? published === "true" : undefined,
    featured: featured ? featured === "true" : undefined,
    visible: visible ? visible === "true" : undefined,
    public: publicOnly ? publicOnly === "true" : undefined,
    search: search || undefined,
    limit: limit ? parseInt(limit) : undefined,
    offset: offset ? parseInt(offset) : undefined,
    sortBy:
      (sortBy as
        | "title"
        | "createdAt"
        | "updatedAt"
        | "publishedAt"
        | "viewCount") || "createdAt",
    sortOrder: (sortOrder as "asc" | "desc") || "desc",
  };

  const result = await blogService.searchBlogPosts(
    filters,
    authResult.userId || undefined
  );
  return handleServiceResult(result, "Blog posts fetched successfully");
});

// POST /api/admin/blog - Create new blog post
export const POST = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const body = await request.json();

  // Handle date conversion for publishedAt
  const blogPostData = {
    ...body,
    publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
  };

  const result = await blogService.createBlogPost(
    blogPostData,
    authResult.userId
  );

  return handleServiceResult(result, "Blog post created successfully", 201);
});
