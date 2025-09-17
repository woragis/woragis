import { NextRequest } from "next/server";
import { withErrorHandling } from "@/utils/response-helpers";
import { hobbiesService } from "@/server/services";
import { handleServiceResult } from "@/utils/response-helpers";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const result = await hobbiesService.getVisibleHobbies();
  return handleServiceResult(result, "Hobbies fetched successfully");
});
