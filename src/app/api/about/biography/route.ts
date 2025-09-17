import { NextRequest } from "next/server";
import { withErrorHandling } from "@/utils/response-helpers";
import { biographyService } from "@/server/services";
import { handleServiceResult } from "@/utils/response-helpers";

export const GET = withErrorHandling(async (request: NextRequest) => {
  // Get the first visible biography for the public
  const result = await biographyService.getFirstVisibleBiography();
  return handleServiceResult(result, "Biography fetched successfully");
});
