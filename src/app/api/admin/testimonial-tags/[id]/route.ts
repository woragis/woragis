import { NextRequest } from "next/server";
import { testimonialTagService } from "@/server/services";
import { authMiddleware } from "@/lib/auth-middleware";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
} from "@/utils/response-helpers";

// GET /api/admin/testimonial-tags/[id] - Get testimonial tag by ID
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
    const result = await testimonialTagService.getTestimonialTagById(id);

    return handleServiceResult(result, "Testimonial tag fetched successfully");
  }
);

// PUT /api/admin/testimonial-tags/[id] - Update testimonial tag
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
    const body = await request.json();

    const result = await testimonialTagService.updateTestimonialTag(id, body);

    return handleServiceResult(result, "Testimonial tag updated successfully");
  }
);

// DELETE /api/admin/testimonial-tags/[id] - Delete testimonial tag
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
    const result = await testimonialTagService.deleteTestimonialTag(id);

    return handleServiceResult(result, "Testimonial tag deleted successfully");
  }
);
