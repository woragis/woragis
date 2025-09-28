import { NextRequest } from "next/server";
import { experienceService } from "@/server/services";
import { authMiddleware } from "@/lib/auth";
import { NewExperience } from "@/types";
import {
  handleServiceResult,
  withErrorHandling,
  handleAuthError,
} from "@/utils/response-helpers";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  const result = await experienceService.getAllExperiences();
  return handleServiceResult(result, "Admin experiences fetched successfully");
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const authResult = await authMiddleware(request);
  if (!authResult.success) {
    return handleAuthError("Unauthorized");
  }

  if (!authResult.userId) {
    return handleAuthError("User ID not found");
  }

  const body = await request.json();
  const experienceData: NewExperience = {
    title: body.title,
    company: body.company,
    period: body.period,
    location: body.location,
    description: body.description,
    achievements: body.achievements || [],
    technologies: body.technologies || [],
    icon: body.icon || "💼",
    order: body.order || 0,
    visible: body.visible !== undefined ? body.visible : true,
  };

  const result = await experienceService.createExperience(
    experienceData,
    authResult.userId
  );
  return handleServiceResult(result, "Experience created successfully", 201);
});
