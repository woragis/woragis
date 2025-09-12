import { NextRequest, NextResponse } from "next/server";
import { testimonialService } from "@/server/services";
import { authMiddleware } from "@/lib/auth-middleware";

// GET /api/admin/testimonials - Get all testimonials for admin
export async function GET(request: NextRequest) {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");
  const visible = searchParams.get("visible");
  const publicOnly = searchParams.get("public");
  const rating = searchParams.get("rating");
  const search = searchParams.get("search");
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");

  const filters = {
    featured: featured ? featured === "true" : undefined,
    visible: visible ? visible === "true" : undefined,
    public: publicOnly ? publicOnly === "true" : undefined,
    rating: rating ? parseInt(rating) : undefined,
    search: search || undefined,
    limit: limit ? parseInt(limit) : undefined,
    offset: offset ? parseInt(offset) : undefined,
  };

  const result = await testimonialService.searchTestimonials(
    filters,
    authResult.userId
  );

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    data: result.data,
  });
}

// POST /api/admin/testimonials - Create new testimonial
export async function POST(request: NextRequest) {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return NextResponse.json({ error: authResult.error }, { status: 401 });
  }

  try {
    const testimonialData = await request.json();
    const result = await testimonialService.createTestimonial(
      testimonialData,
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
