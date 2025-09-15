import { NextRequest } from "next/server";
import { animeService } from "@/server/services";
import { requireAdmin } from "@/lib/auth-middleware";

export const GET = requireAdmin(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const result = await animeService.getAnimeById(params.id);
      return Response.json(result);
    } catch (error) {
      console.error("Error fetching anime:", error);
      return Response.json(
        { success: false, error: "Failed to fetch anime" },
        { status: 500 }
      );
    }
  }
);

export const PUT = requireAdmin(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const data = await request.json();
      const result = await animeService.updateAnime(params.id, data);
      return Response.json(result);
    } catch (error) {
      console.error("Error updating anime:", error);
      return Response.json(
        { success: false, error: "Failed to update anime" },
        { status: 500 }
      );
    }
  }
);

export const DELETE = requireAdmin(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const result = await animeService.deleteAnime(params.id);
      return Response.json(result);
    } catch (error) {
      console.error("Error deleting anime:", error);
      return Response.json(
        { success: false, error: "Failed to delete anime" },
        { status: 500 }
      );
    }
  }
);
