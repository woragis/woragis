import { NextRequest, NextResponse } from "next/server";
import { politicalViewService } from "@/server/services";
import { requireAdmin } from "@/lib/auth-middleware";

export const GET = requireAdmin(async (request: NextRequest, user) => {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Political view ID is required" },
        { status: 400 }
      );
    }
    const result = await politicalViewService.getPoliticalViewById(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching political view:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch political view" },
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
        { success: false, error: "Political view ID is required" },
        { status: 400 }
      );
    }
    const data = await request.json();
    const result = await politicalViewService.updatePoliticalView(id, data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating political view:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update political view" },
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
        { success: false, error: "Political view ID is required" },
        { status: 400 }
      );
    }
    const result = await politicalViewService.deletePoliticalView(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting political view:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete political view" },
      { status: 500 }
    );
  }
});
