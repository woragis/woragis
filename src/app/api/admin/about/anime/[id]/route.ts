import { NextRequest, NextResponse } from "next/server";
import { animeService } from "@/server/services";
import { requireAdmin } from "@/lib/auth-middleware";

export const GET = requireAdmin(async (request: NextRequest, user) => {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Anime ID is required" },
        { status: 400 }
      );
    }
    const result = await animeService.getAnimeById(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching anime:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch anime" },
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
        { success: false, error: "Anime ID is required" },
        { status: 400 }
      );
    }
    const data = await request.json();
    const result = await animeService.updateAnime(id, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating anime:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update anime" },
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
        { success: false, error: "Anime ID is required" },
        { status: 400 }
      );
    }
    const result = await animeService.deleteAnime(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting anime:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete anime" },
      { status: 500 }
    );
  }
});
