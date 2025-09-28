import { NextRequest } from "next/server";
import { testimonialService } from "@/server/services";
import { authMiddleware } from "@/lib/auth";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
  notFoundResponse,
  badRequestResponse,
  deletedResponse,
} from "@/utils/response-helpers";

// GET /api/admin/testimonials/[id] - Get testimonial by ID for admin
export const GET = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return handleAuthError(authResult.error);
    }

    const { id } = await params;
    const result = await testimonialService.getTestimonialById(
      id,
      authResult.userId
    );

    if (!result.success) {
      return notFoundResponse(result.error || "Testimonial not found");
    }

    return handleServiceResult(result, "Testimonial fetched successfully");
  }
);

// PUT /api/admin/testimonials/[id] - Update testimonial
export const PUT = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return handleAuthError(authResult.error);
    }

    const { id } = await params;
    const testimonialData = await request.json();
    const result = await testimonialService.updateTestimonial(
      id,
      testimonialData,
      authResult.userId
    );

    return handleServiceResult(result, "Testimonial updated successfully");
  }
);

// DELETE /api/admin/testimonials/[id] - Delete testimonial
export const DELETE = withErrorHandling(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return handleAuthError(authResult.error);
    }

    const { id } = await params;
    const result = await testimonialService.deleteTestimonial(
      id,
      authResult.userId
    );

    if (!result.success) {
      return notFoundResponse(result.error || "Testimonial not found");
    }

    return deletedResponse("Testimonial deleted successfully");
  }
);
