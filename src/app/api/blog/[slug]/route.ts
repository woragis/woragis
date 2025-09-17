import { NextRequest } from "next/server";
import { blogService } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
  notFoundResponse,
} from "@/utils/response-helpers";

// GET /api/blog/[slug] - Get public blog post by slug
export const GET = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
  ) => {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const incrementViews = searchParams.get("increment_views") === "true";

    const result = await blogService.getPublicBlogPostBySlug(slug);

    if (!result.success) {
      return notFoundResponse(result.error || "Blog post not found");
    }

    // Increment view count if requested
    if (incrementViews && result.data) {
      await blogService.incrementBlogPostViewCount(result.data.id);
    }

    return handleServiceResult(result, "Blog post fetched successfully");
  }
);
