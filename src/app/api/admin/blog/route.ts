import { NextRequest } from "next/server";
import { blogService } from "@/server/services";
import { authMiddleware } from "@/lib/auth-middleware";
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
  const category = searchParams.get("category");
  const tags = searchParams.get("tags");
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
    category: category || undefined,
    tags: tags ? tags.split(",") : undefined,
    search: search || undefined,
    limit: limit ? parseInt(limit) : undefined,
    offset: offset ? parseInt(offset) : undefined,
    sortBy: (sortBy as any) || "createdAt",
    sortOrder: (sortOrder as any) || "desc",
  };

  const result = await blogService.searchBlogPosts(filters, authResult.userId);
  return handleServiceResult(result, "Blog posts fetched successfully");
});

// POST /api/admin/blog - Create new blog post
export const POST = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError(authResult.error);
  }

  const blogPostData = await request.json();
  const result = await blogService.createBlogPost(
    blogPostData,
    authResult.userId
  );

  return handleServiceResult(result, "Blog post created successfully", 201);
});
