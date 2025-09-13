import { NextRequest } from "next/server";
import { blogService } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
} from "@/utils/response-helpers";

// GET /api/blog - Get public blog posts for frontend
export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");
  const recent = searchParams.get("recent");
  const limit = searchParams.get("limit");
  const category = searchParams.get("category");
  const tags = searchParams.get("tags");

  if (featured === "true") {
    // Use default limit of 3 for featured blog posts if not specified
    const limitValue = parseInt(limit || "3");
    const result = await blogService.getPublicFeaturedBlogPosts(limitValue);
    return handleServiceResult(
      result,
      "Featured blog posts fetched successfully"
    );
  }

  if (recent === "true") {
    // Get recent published blog posts
    const limitValue = parseInt(limit || "6");
    const result = await blogService.getPublicRecentBlogPosts(limitValue);
    return handleServiceResult(
      result,
      "Recent blog posts fetched successfully"
    );
  }

  // Get all published blog posts with optional filters
  const filters = {
    published: true,
    visible: true,
    public: true,
    category: category || undefined,
    tags: tags ? tags.split(",") : undefined,
    limit: limit ? parseInt(limit) : undefined,
  };

  const result = await blogService.searchBlogPosts(filters);
  return handleServiceResult(result, "Blog posts fetched successfully");
});
