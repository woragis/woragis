import { NextRequest } from "next/server";
import { testimonialService } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
} from "@/utils/response-helpers";

// GET /api/testimonials - Get public testimonials for frontend
export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");
  const limit = searchParams.get("limit");

  if (featured === "true") {
    // Use default limit of 3 for featured testimonials if not specified
    const limitValue = parseInt(limit || "3");
    const result = await testimonialService.getPublicFeaturedTestimonials(
      limitValue
    );
    return handleServiceResult(
      result,
      "Featured testimonials fetched successfully"
    );
  }

  const result = await testimonialService.getPublicTestimonials();
  return handleServiceResult(result, "Testimonials fetched successfully");
});
