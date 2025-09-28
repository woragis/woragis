/**
 * Usage Examples for Upload Service
 * 
 * This file demonstrates how to integrate the upload service
 * into other services in the application.
 */

import { uploadService } from "../index";
import type { FileInfo } from "@/types/upload";

/**
 * Example: Project Service with Image Upload
 */
export class ExampleProjectService {
  /**
   * Upload project image with specific validation
   */
  async uploadProjectImage(file: File, projectId: string): Promise<FileInfo> {
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadService.uploadFromFormData(formData, "file", {
      maxSize: 5 * 1024 * 1024, // 5MB max
      allowedTypes: ["jpg", "jpeg", "png", "webp"],
      allowedMimeTypes: [
        "image/jpeg",
        "image/png", 
        "image/webp"
      ],
      generateUniqueName: true,
      filenamePrefix: `project_${projectId}_`,
      path: "projects/images",
      metadata: {
        projectId,
        uploadedAt: new Date().toISOString(),
        category: "project-image",
        uploadedBy: "project-service",
      },
    });

    if (!result.success || !result.data) {
      throw new Error(result.error || "Failed to upload project image");
    }

    return result.data;
  }

  /**
   * Upload project documentation
   */
  async uploadProjectDocument(file: File, projectId: string): Promise<FileInfo> {
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadService.uploadFromFormData(formData, "file", {
      maxSize: 20 * 1024 * 1024, // 20MB max for documents
      allowedTypes: ["pdf", "doc", "docx", "txt", "md"],
      allowedMimeTypes: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "text/markdown",
      ],
      generateUniqueName: true,
      filenamePrefix: `project_${projectId}_doc_`,
      path: "projects/documents",
      metadata: {
        projectId,
        uploadedAt: new Date().toISOString(),
        category: "project-document",
        uploadedBy: "project-service",
      },
    });

    if (!result.success || !result.data) {
      throw new Error(result.error || "Failed to upload project document");
    }

    return result.data;
  }

  /**
   * Delete project-related files
   */
  async deleteProjectFiles(filePaths: string[]): Promise<void> {
    const deletePromises = filePaths.map(async (filePath) => {
      const result = await uploadService.deleteFile(filePath);
      if (!result.success) {
        console.warn(`Failed to delete file: ${filePath}`, result.error);
      }
    });

    await Promise.all(deletePromises);
  }
}

/**
 * Example: Blog Service with Asset Upload
 */
export class ExampleBlogService {
  /**
   * Upload blog post featured image
   */
  async uploadBlogImage(file: File, postSlug: string): Promise<FileInfo> {
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadService.uploadFromFormData(formData, "file", {
      maxSize: 3 * 1024 * 1024, // 3MB max
      allowedTypes: ["jpg", "jpeg", "png", "webp"],
      generateUniqueName: true,
      filenamePrefix: `blog_${postSlug}_`,
      path: "blog/images",
      metadata: {
        postSlug,
        uploadedAt: new Date().toISOString(),
        category: "blog-image",
        uploadedBy: "blog-service",
      },
    });

    if (!result.success || !result.data) {
      throw new Error(result.error || "Failed to upload blog image");
    }

    return result.data;
  }

  /**
   * Upload blog post attachment
   */
  async uploadBlogAttachment(file: File, postSlug: string): Promise<FileInfo> {
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadService.uploadFromFormData(formData, "file", {
      maxSize: 10 * 1024 * 1024, // 10MB max
      allowedTypes: ["pdf", "zip", "rar", "txt", "md"],
      generateUniqueName: true,
      filenamePrefix: `blog_${postSlug}_attachment_`,
      path: "blog/attachments",
      metadata: {
        postSlug,
        uploadedAt: new Date().toISOString(),
        category: "blog-attachment",
        uploadedBy: "blog-service",
      },
    });

    if (!result.success || !result.data) {
      throw new Error(result.error || "Failed to upload blog attachment");
    }

    return result.data;
  }
}

/**
 * Example: User Service with Profile Upload
 */
export class ExampleUserService {
  /**
   * Upload user profile picture
   */
  async uploadProfilePicture(file: File, userId: string): Promise<FileInfo> {
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadService.uploadFromFormData(formData, "file", {
      maxSize: 2 * 1024 * 1024, // 2MB max for profile pictures
      allowedTypes: ["jpg", "jpeg", "png", "webp"],
      allowedMimeTypes: [
        "image/jpeg",
        "image/png",
        "image/webp",
      ],
      generateUniqueName: true,
      filenamePrefix: `profile_${userId}_`,
      path: "users/profiles",
      metadata: {
        userId,
        uploadedAt: new Date().toISOString(),
        category: "profile-picture",
        uploadedBy: "user-service",
      },
    });

    if (!result.success || !result.data) {
      throw new Error(result.error || "Failed to upload profile picture");
    }

    return result.data;
  }

  /**
   * Upload user resume/CV
   */
  async uploadUserResume(file: File, userId: string): Promise<FileInfo> {
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadService.uploadFromFormData(formData, "file", {
      maxSize: 5 * 1024 * 1024, // 5MB max
      allowedTypes: ["pdf", "doc", "docx"],
      allowedMimeTypes: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      generateUniqueName: true,
      filenamePrefix: `resume_${userId}_`,
      path: "users/resumes",
      metadata: {
        userId,
        uploadedAt: new Date().toISOString(),
        category: "user-resume",
        uploadedBy: "user-service",
      },
    });

    if (!result.success || !result.data) {
      throw new Error(result.error || "Failed to upload resume");
    }

    return result.data;
  }
}

/**
 * Example: Generic File Management Utilities
 */
export class FileManagementService {
  /**
   * Batch upload multiple files
   */
  async uploadMultipleFiles(
    files: File[],
    options: {
      maxSize?: number;
      allowedTypes?: string[];
      path?: string;
      category: string;
      metadata?: Record<string, any>;
    }
  ): Promise<FileInfo[]> {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadService.uploadFromFormData(formData, "file", {
        maxSize: options.maxSize || 5 * 1024 * 1024,
        allowedTypes: options.allowedTypes,
        generateUniqueName: true,
        path: options.path || "general",
        metadata: {
          ...options.metadata,
          category: options.category,
          uploadedAt: new Date().toISOString(),
        },
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to upload file");
      }

      return result.data;
    });

    return Promise.all(uploadPromises);
  }

  /**
   * Clean up old files
   */
  async cleanupOldFiles(
    filePaths: string[],
    olderThanDays: number = 30
  ): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const cleanupPromises = filePaths.map(async (filePath) => {
      try {
        // Check if file exists and get its metadata
        const existsResult = await uploadService.fileExists(filePath);
        if (!existsResult.success || !existsResult.data) {
          return;
        }

        // In a real implementation, you might want to check file creation date
        // For now, we'll just delete the files
        const deleteResult = await uploadService.deleteFile(filePath);
        if (!deleteResult.success) {
          console.warn(`Failed to delete old file: ${filePath}`, deleteResult.error);
        }
      } catch (error) {
        console.warn(`Error cleaning up file: ${filePath}`, error);
      }
    });

    await Promise.all(cleanupPromises);
  }

  /**
   * Get file URL for public access
   */
  async getPublicFileUrl(filePath: string): Promise<string> {
    const result = await uploadService.getFileUrl(filePath);
    if (!result.success || !result.data) {
      throw new Error(result.error || "Failed to get file URL");
    }
    return result.data;
  }
}
