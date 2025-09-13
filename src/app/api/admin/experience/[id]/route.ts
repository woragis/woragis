import { NextRequest, NextResponse } from "next/server";
import { experienceService } from "@/server/services";
import { authMiddleware } from "@/lib/auth-middleware";
import { UpdateExperience } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const experience = await experienceService.getExperienceById(params.id);

    if (!experience) {
      return NextResponse.json(
        { success: false, error: "Experience not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: experience,
    });
  } catch (error) {
    console.error("Error fetching experience:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch experience",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const updateData: UpdateExperience = {
      title: body.title,
      company: body.company,
      period: body.period,
      location: body.location,
      description: body.description,
      achievements: body.achievements,
      technologies: body.technologies,
      icon: body.icon,
      order: body.order,
      isActive: body.isActive ? "true" : "false",
    };

    const experience = await experienceService.updateExperience(
      params.id,
      updateData
    );

    if (!experience) {
      return NextResponse.json(
        { success: false, error: "Experience not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: experience,
    });
  } catch (error) {
    console.error("Error updating experience:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update experience",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authMiddleware(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const success = await experienceService.deleteExperience(params.id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Experience not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting experience:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete experience",
      },
      { status: 500 }
    );
  }
}
