import { NextRequest, NextResponse } from "next/server";
import { experienceService } from "@/server/services";

export async function GET() {
  try {
    const experiences = await experienceService.getAllExperiences();

    return NextResponse.json({
      success: true,
      data: experiences,
    });
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch experiences",
      },
      { status: 500 }
    );
  }
}
