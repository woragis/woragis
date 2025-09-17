import { NextRequest, NextResponse } from "next/server";
import { youtuberService } from "@/server/services";
import { requireAdmin } from "@/lib/auth-middleware";

export const GET = requireAdmin(async (request: NextRequest, user) => {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Youtuber ID is required" },
        { status: 400 }
      );
    }
    const result = await youtuberService.getYoutuberById(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching youtuber:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch youtuber" },
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
        { success: false, error: "Youtuber ID is required" },
        { status: 400 }
      );
    }
    const data = await request.json();
    const result = await youtuberService.updateYoutuber(id, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating youtuber:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update youtuber" },
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
        { success: false, error: "Youtuber ID is required" },
        { status: 400 }
      );
    }
    const result = await youtuberService.deleteYoutuber(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting youtuber:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete youtuber" },
      { status: 500 }
    );
  }
});
