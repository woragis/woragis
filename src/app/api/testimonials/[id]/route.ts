import { NextRequest, NextResponse } from "next/server";
import { testimonialService } from "@/server/services";

// GET /api/testimonials/[id] - Get public testimonial by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const result = await testimonialService.getPublicTestimonialById(id);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  if (!result.data) {
    return NextResponse.json(
      { error: "Testimonial not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(result.data);
}
