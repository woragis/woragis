import { NextRequest } from "next/server";
import { experienceService } from "@/server/services";
import { authMiddleware } from "@/lib/auth-middleware";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
  notFoundResponse,
  deletedResponse,
} from "@/utils/response-helpers";
import { UpdateExperience } from "@/types";

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
    const experience = await experienceService.getExperienceById(id);

    if (!experience) {
      return notFoundResponse("Experience not found");
    }

    return handleServiceResult(
      { success: true, data: experience },
      "Experience fetched successfully"
    );
  }
);

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
    const updateData: UpdateExperience = {
      title: body.title,
      company: body.company,
      period: body.period,
      location: body.location,
      description: body.description,
      achievements: body.achievements,
      technologies: body.technologies,
      icon: body.icon,
      order: body.order,
      isActive: body.isActive ? "true" : "false",
    };

    const experience = await experienceService.updateExperience(id, updateData);

    if (!experience) {
      return notFoundResponse("Experience not found");
    }

    return handleServiceResult(
      { success: true, data: experience },
      "Experience updated successfully"
    );
  }
);

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
    const success = await experienceService.deleteExperience(id);

    if (!success) {
      return notFoundResponse("Experience not found");
    }

    return deletedResponse("Experience deleted successfully");
  }
);
