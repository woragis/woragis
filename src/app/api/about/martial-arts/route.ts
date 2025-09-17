import { NextRequest } from "next/server";
import { withErrorHandling } from "@/utils/response-helpers";
import { martialArtsService } from "@/server/services";
import { handleServiceResult } from "@/utils/response-helpers";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const result = await martialArtsService.getVisibleMartialArts();
  return handleServiceResult(result, "Martial arts fetched successfully");
});
