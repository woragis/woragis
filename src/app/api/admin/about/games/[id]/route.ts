import { NextRequest, NextResponse } from "next/server";
import { gameService } from "@/server/services";
import { requireAdmin } from "@/lib/auth-middleware";

export const GET = requireAdmin(async (request: NextRequest, user) => {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Game ID is required" },
        { status: 400 }
      );
    }
    const result = await gameService.getGameById(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching game:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch game" },
      { status: 500 }
    );
  }
});

export const PUT = requireAdmin(async (request: NextRequest, user) => {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Game ID is required" },
        { status: 400 }
      );
    }
    const data = await request.json();
    const result = await gameService.updateGame(id, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating game:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update game" },
      { status: 500 }
    );
  }
});

export const DELETE = requireAdmin(async (request: NextRequest, user) => {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Game ID is required" },
        { status: 400 }
      );
    }
    const result = await gameService.deleteGame(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting game:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete game" },
      { status: 500 }
    );
  }
});
