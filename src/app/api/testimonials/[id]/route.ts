import { NextRequest } from "next/server";
import { testimonialService } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
  notFoundResponse,
} from "@/utils/response-helpers";

// GET /api/testimonials/[id] - Get public testimonial by ID
export const GET = withErrorHandling(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = params;

    const result = await testimonialService.getPublicTestimonialById(id);

    if (!result.success) {
      return notFoundResponse(result.error || "Testimonial not found");
    }

    return handleServiceResult(result, "Testimonial fetched successfully");
  }
);
