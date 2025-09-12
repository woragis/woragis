import { NextRequest, NextResponse } from "next/server";
import { blogService } from "@/server/services";

// GET /api/blog - Get public blog posts for frontend
export async function GET(request: NextRequest) {
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

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  }

  if (recent === "true") {
    // Get recent published blog posts
    const limitValue = parseInt(limit || "6");
    const result = await blogService.getPublicRecentBlogPosts(limitValue);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
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

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result.data);
}
