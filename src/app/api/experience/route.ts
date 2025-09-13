import { NextRequest } from "next/server";
import { experienceService } from "@/server/services";
import {
  handleServiceResult,
  withErrorHandling,
} from "@/utils/response-helpers";

export const GET = withErrorHandling(async () => {
  console.log("Fetching experiences...");
  const result = await experienceService.getVisibleExperiences();
  console.log("Service result:", result);

  return handleServiceResult(result, "Experiences fetched successfully");
});
