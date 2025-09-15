import { NextRequest } from "next/server";
import { politicalViewService } from "@/server/services";
import { requireAdmin } from "@/lib/auth-middleware";

export const GET = requireAdmin(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const result = await politicalViewService.getPoliticalViewById(params.id);
      return Response.json(result);
    } catch (error) {
      console.error("Error fetching political view:", error);
      return Response.json(
        { success: false, error: "Failed to fetch political view" },
        { status: 500 }
      );
    }
  }
);

export const PUT = requireAdmin(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const data = await request.json();
      const result = await politicalViewService.updatePoliticalView(
        params.id,
        data
      );
      return Response.json(result);
    } catch (error) {
      console.error("Error updating political view:", error);
      return Response.json(
        { success: false, error: "Failed to update political view" },
        { status: 500 }
      );
    }
  }
);

export const DELETE = requireAdmin(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const result = await politicalViewService.deletePoliticalView(params.id);
      return Response.json(result);
    } catch (error) {
      console.error("Error deleting political view:", error);
      return Response.json(
        { success: false, error: "Failed to delete political view" },
        { status: 500 }
      );
    }
  }
);
