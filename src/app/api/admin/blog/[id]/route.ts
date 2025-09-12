import { NextRequest, NextResponse } from "next/server";
import { blogService } from "@/server/services";
import { authMiddleware } from "@/lib/auth-middleware";

// GET /api/admin/blog/[id] - Get blog post by ID for admin
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  const { id } = params;
  const result = await blogService.getBlogPostById(id, authResult.userId);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  if (!result.data) {
    return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: result.data,
  });
}

// PUT /api/admin/blog/[id] - Update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const { id } = params;
    const blogPostData = await request.json();
    const result = await blogService.updateBlogPost(
      id,
      blogPostData,
      authResult.userId
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: result.message,
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON data" }, { status: 400 });
  }
}

// DELETE /api/admin/blog/[id] - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  const { id } = params;
  const result = await blogService.deleteBlogPost(id, authResult.userId);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: result.message,
  });
}
