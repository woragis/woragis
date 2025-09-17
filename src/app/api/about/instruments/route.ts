import { NextRequest } from "next/server";
import { withErrorHandling } from "@/utils/response-helpers";
import { instrumentsService } from "@/server/services";
import { handleServiceResult } from "@/utils/response-helpers";

export const GET = withErrorHandling(async (request: NextRequest) => {
  const result = await instrumentsService.getVisibleInstruments();
  return handleServiceResult(result, "Instruments fetched successfully");
});
