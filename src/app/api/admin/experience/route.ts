import { NextRequest, NextResponse } from "next/server";
import { experienceService } from "@/server/services";
import { authMiddleware } from "@/lib/auth-middleware";
import { NewExperience } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const experiences = await experienceService.getAllExperiencesForAdmin();

    return NextResponse.json({
      success: true,
      data: experiences,
    });
  } catch (error) {
    console.error("Error fetching experiences for admin:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch experiences",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const experienceData: NewExperience = {
      title: body.title,
      company: body.company,
      period: body.period,
      location: body.location,
      description: body.description,
      achievements: body.achievements || [],
      technologies: body.technologies || [],
      icon: body.icon || "💼",
      order: body.order || 0,
      isActive: body.isActive ? "true" : "false",
    };

    const experience = await experienceService.createExperience(experienceData);

    return NextResponse.json({
      success: true,
      data: experience,
    });
  } catch (error) {
    console.error("Error creating experience:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create experience",
      },
      { status: 500 }
    );
  }
}
