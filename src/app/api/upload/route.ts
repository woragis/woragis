import { NextRequest, NextResponse } from "next/server";
import { uploadService } from "@/server/services";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const path = formData.get("path") as string;
    const generateUniqueName = formData.get("generateUniqueName") === "true";
    const filenamePrefix = formData.get("filenamePrefix") as string;
    const allowedTypes = formData.get("allowedTypes") as string;
    const metadata = formData.get("metadata") as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Parse metadata if provided
    let parsedMetadata = {};
    if (metadata) {
      try {
        parsedMetadata = JSON.parse(metadata);
      } catch (e) {
        console.warn("Invalid metadata format:", e);
      }
    }

    // Parse allowed types if provided
    let parsedAllowedTypes: string[] | undefined;
    if (allowedTypes) {
      try {
        parsedAllowedTypes = JSON.parse(allowedTypes);
      } catch (e) {
        console.warn("Invalid allowedTypes format:", e);
      }
    }

    // Configure upload options based on file type and path
    const uploadOptions = {
      maxSize: getMaxSizeForPath(path),
      allowedTypes: parsedAllowedTypes || getAllowedTypesForPath(path),
      allowedMimeTypes: getAllowedMimeTypesForPath(path),
      generateUniqueName: generateUniqueName !== false, // Default to true
      path: path || "general",
      filenamePrefix: filenamePrefix || "",
      metadata: {
        uploadedAt: new Date().toISOString(),
        uploadedBy: "api",
        ...parsedMetadata,
      },
    };

    const result = await uploadService.uploadFromFormData(formData, "file", uploadOptions);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getMaxSizeForPath(path?: string): number {
  switch (path) {
    case "projects/images":
      return 5 * 1024 * 1024; // 5MB for project images
    case "projects/videos":
      return 50 * 1024 * 1024; // 50MB for project videos
    case "projects/documents":
      return 20 * 1024 * 1024; // 20MB for documents
    case "blog/images":
      return 3 * 1024 * 1024; // 3MB for blog images
    case "blog/attachments":
      return 10 * 1024 * 1024; // 10MB for blog attachments
    default:
      return 10 * 1024 * 1024; // 10MB default
  }
}

function getAllowedTypesForPath(path?: string): string[] {
  switch (path) {
    case "projects/images":
      return ["jpg", "jpeg", "png", "webp"];
    case "projects/videos":
      return ["mp4", "webm", "mov", "avi"];
    case "projects/documents":
      return ["pdf", "doc", "docx", "txt", "md"];
    case "blog/images":
      return ["jpg", "jpeg", "png", "gif", "webp"];
    case "blog/attachments":
      return ["pdf", "zip", "rar", "txt", "md"];
    default:
      return ["jpg", "jpeg", "png", "gif", "webp", "pdf", "txt", "md"];
  }
}

function getAllowedMimeTypesForPath(path?: string): string[] {
  switch (path) {
    case "projects/images":
      return ["image/jpeg", "image/png", "image/webp"];
    case "projects/videos":
      return ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
    case "projects/documents":
      return [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "text/markdown",
      ];
    case "blog/images":
      return ["image/jpeg", "image/png", "image/gif", "image/webp"];
    case "blog/attachments":
      return [
        "application/pdf",
        "application/zip",
        "application/x-rar-compressed",
        "text/plain",
        "text/markdown",
      ];
    default:
      return [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
        "text/plain",
        "text/markdown",
      ];
  }
}

// Example of how to use the upload service in other services
export async function GET() {
  return NextResponse.json({
    message: "Upload service is available",
    endpoints: {
      POST: "Upload a file",
    },
    usage: {
      example: `
// In any service or API route:
import { uploadService } from "@/server/services";

// Upload from FormData
const result = await uploadService.uploadFromFormData(formData, "file", {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ["jpg", "png"],
  generateUniqueName: true,
  path: "projects",
});

// Upload from buffer
const buffer = Buffer.from(fileData);
const result = await uploadService.uploadFile(buffer, "filename.jpg", {
  allowedMimeTypes: ["image/jpeg", "image/png"],
  filenamePrefix: "project_",
});
      `,
    },
  });
}
