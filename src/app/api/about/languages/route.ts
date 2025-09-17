import { NextRequest } from "next/server";
import { withErrorHandling } from "@/utils/response-helpers";
import { languagesService } from "@/server/services";
import { handleServiceResult } from "@/utils/response-helpers";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const result = await languagesService.getVisibleLanguages();
  return handleServiceResult(result, "Languages fetched successfully");
});
