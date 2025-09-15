import { NextRequest } from "next/server";
import { gameService } from "@/server/services";
import { requireAdmin } from "@/lib/auth-middleware";

export const GET = requireAdmin(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const result = await gameService.getGameById(params.id);
      return Response.json(result);
    } catch (error) {
      console.error("Error fetching game:", error);
      return Response.json(
        { success: false, error: "Failed to fetch game" },
        { status: 500 }
      );
    }
  }
);

export const PUT = requireAdmin(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const data = await request.json();
      const result = await gameService.updateGame(params.id, data);
      return Response.json(result);
    } catch (error) {
      console.error("Error updating game:", error);
      return Response.json(
        { success: false, error: "Failed to update game" },
        { status: 500 }
      );
    }
  }
);

export const DELETE = requireAdmin(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const result = await gameService.deleteGame(params.id);
      return Response.json(result);
    } catch (error) {
      console.error("Error deleting game:", error);
      return Response.json(
        { success: false, error: "Failed to delete game" },
        { status: 500 }
      );
    }
  }
);
