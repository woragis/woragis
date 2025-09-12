import { NextRequest, NextResponse } from "next/server";
import { testimonialService } from "@/server/services";

// GET /api/testimonials - Get public testimonials for frontend
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");
  const limit = searchParams.get("limit");

  if (featured === "true") {
    // Use default limit of 3 for featured testimonials if not specified
    const limitValue = parseInt(limit || "3");
    const result = await testimonialService.getPublicFeaturedTestimonials(
      limitValue
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  }

  const result = await testimonialService.getPublicTestimonials();

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result.data);
}
