import { NextRequest, NextResponse } from "next/server";
import { blogService } from "@/server/services";

// GET /api/blog/[slug] - Get public blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const { searchParams } = new URL(request.url);
  const incrementViews = searchParams.get("increment_views") === "true";

  const result = await blogService.getPublicBlogPostBySlug(slug);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  if (!result.data) {
    return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
  }

  // Increment view count if requested
  if (incrementViews) {
    await blogService.incrementBlogPostViewCount(result.data.id);
  }

  return NextResponse.json(result.data);
}
