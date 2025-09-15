import { NextRequest } from "next/server";
import { youtuberService } from "@/server/services";
import { requireAdmin } from "@/lib/auth-middleware";

export const GET = requireAdmin(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const result = await youtuberService.getYoutuberById(params.id);
      return Response.json(result);
    } catch (error) {
      console.error("Error fetching youtuber:", error);
      return Response.json(
        { success: false, error: "Failed to fetch youtuber" },
        { status: 500 }
      );
    }
  }
);

export const PUT = requireAdmin(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const data = await request.json();
      const result = await youtuberService.updateYoutuber(params.id, data);
      return Response.json(result);
    } catch (error) {
      console.error("Error updating youtuber:", error);
      return Response.json(
        { success: false, error: "Failed to update youtuber" },
        { status: 500 }
      );
    }
  }
);

export const DELETE = requireAdmin(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const result = await youtuberService.deleteYoutuber(params.id);
      return Response.json(result);
    } catch (error) {
      console.error("Error deleting youtuber:", error);
      return Response.json(
        { success: false, error: "Failed to delete youtuber" },
        { status: 500 }
      );
    }
  }
);
