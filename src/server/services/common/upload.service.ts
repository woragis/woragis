import { BaseService } from "../base.service";
import { ApiResponse } from "@/types";
import type {
  UploadOptions,
  UploadResult,
  FileInfo,
  StorageBackend,
  StorageConfig,
} from "@/types/upload";
import { StorageType } from "@/types/upload";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";
import path from "path";

/**
 * Local file system storage backend
 */
class LocalStorageBackend implements StorageBackend {
  constructor(private config: StorageConfig["local"]) {}

  async upload(
    buffer: Buffer,
    filename: string,
    options: UploadOptions
  ): Promise<UploadResult> {
    try {
      const uploadDir = this.config?.uploadDir || "uploads";
      const targetPath = options.path ? path.join(uploadDir, options.path) : uploadDir;

      // Ensure directory exists
      await fs.mkdir(targetPath, { recursive: true });

      const fullPath = path.join(targetPath, filename);
      await fs.writeFile(fullPath, buffer);

      const publicUrl = options.path
        ? `${this.config?.publicUrl}/${options.path}/${filename}`
        : `${this.config?.publicUrl}/${filename}`;

      return {
        success: true,
        data: {
          filename,
          originalName: filename,
          size: buffer.length,
          mimeType: this.getMimeType(filename),
          path: fullPath,
          url: publicUrl,
          metadata: options.metadata,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      };
    }
  }

  async delete(filePath: string): Promise<boolean> {
    try {
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async getUrl(filePath: string): Promise<string | null> {
    try {
      const relativePath = path.relative(this.config?.uploadDir || "uploads", filePath);
      return `${this.config?.publicUrl}/${relativePath}`;
    } catch {
      return null;
    }
  }

  async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".pdf": "application/pdf",
      ".txt": "text/plain",
      ".md": "text/markdown",
      ".json": "application/json",
      ".csv": "text/csv",
    };
    return mimeTypes[ext] || "application/octet-stream";
  }
}

/**
 * Upload Service - Handles file uploads with multiple storage backends
 */
export class UploadService extends BaseService {
  private storage: StorageBackend;
  private config: StorageConfig;

  constructor(config: StorageConfig) {
    super();
    this.config = config;
    this.storage = this.createStorageBackend(config);
  }

  /**
   * Upload a file from buffer
   */
  async uploadFile(
    buffer: Buffer,
    originalName: string,
    options: UploadOptions = {}
  ): Promise<ApiResponse<FileInfo>> {
    try {
      // Validate file size
      if (options.maxSize && buffer.length > options.maxSize) {
        return this.handleError(
          new Error(`File size exceeds maximum allowed size of ${options.maxSize} bytes`),
          "uploadFile"
        );
      }

      // Validate file type
      const validationError = this.validateFileType(originalName, options);
      if (validationError) {
        return this.handleError(new Error(validationError), "uploadFile");
      }

      // Generate filename
      const filename = this.generateFilename(originalName, options);

      // Upload file
      const result = await this.storage.upload(buffer, filename, options);

      if (!result.success || !result.data) {
        return this.handleError(
          new Error(result.error || "Upload failed"),
          "uploadFile"
        );
      }

      return this.success(result.data, "File uploaded successfully");
    } catch (error) {
      return this.handleError(error, "uploadFile");
    }
  }

  /**
   * Upload a file from FormData
   */
  async uploadFromFormData(
    formData: FormData,
    fieldName: string = "file",
    options: UploadOptions = {}
  ): Promise<ApiResponse<FileInfo>> {
    try {
      const file = formData.get(fieldName) as File;
      if (!file) {
        return this.handleError(
          new Error(`No file found in field: ${fieldName}`),
          "uploadFromFormData"
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      return this.uploadFile(buffer, file.name, options);
    } catch (error) {
      return this.handleError(error, "uploadFromFormData");
    }
  }

  /**
   * Delete a file
   */
  async deleteFile(filePath: string): Promise<ApiResponse<boolean>> {
    try {
      const success = await this.storage.delete(filePath);
      if (!success) {
        return this.handleError(
          new Error("Failed to delete file"),
          "deleteFile"
        );
      }
      return this.success(true, "File deleted successfully");
    } catch (error) {
      return this.handleError(error, "deleteFile");
    }
  }

  /**
   * Get file URL
   */
  async getFileUrl(filePath: string): Promise<ApiResponse<string>> {
    try {
      const url = await this.storage.getUrl(filePath);
      if (!url) {
        return this.handleError(
          new Error("Failed to generate file URL"),
          "getFileUrl"
        );
      }
      return this.success(url, "File URL generated successfully");
    } catch (error) {
      return this.handleError(error, "getFileUrl");
    }
  }

  /**
   * Check if file exists
   */
  async fileExists(filePath: string): Promise<ApiResponse<boolean>> {
    try {
      const exists = await this.storage.exists(filePath);
      return this.success(exists, "File existence checked");
    } catch (error) {
      return this.handleError(error, "fileExists");
    }
  }

  /**
   * Create storage backend based on config
   */
  private createStorageBackend(config: StorageConfig): StorageBackend {
    switch (config.type) {
      case StorageType.LOCAL:
        return new LocalStorageBackend(config.local);
      case StorageType.S3:
        // TODO: Implement S3 backend when needed
        throw new Error("S3 backend not implemented yet");
      case StorageType.CLOUDINARY:
        // TODO: Implement Cloudinary backend when needed
        throw new Error("Cloudinary backend not implemented yet");
      case StorageType.AZURE:
        // TODO: Implement Azure backend when needed
        throw new Error("Azure backend not implemented yet");
      case StorageType.GCS:
        // TODO: Implement Google Cloud Storage backend when needed
        throw new Error("Google Cloud Storage backend not implemented yet");
      default:
        throw new Error(`Unsupported storage type: ${config.type}`);
    }
  }

  /**
   * Validate file type
   */
  private validateFileType(filename: string, options: UploadOptions): string | null {
    const ext = path.extname(filename).toLowerCase().slice(1);
    const mimeType = this.getMimeType(filename);

    if (options.allowedTypes && !options.allowedTypes.includes(ext)) {
      return `File type .${ext} is not allowed. Allowed types: ${options.allowedTypes.join(", ")}`;
    }

    if (options.allowedMimeTypes && !options.allowedMimeTypes.includes(mimeType)) {
      return `MIME type ${mimeType} is not allowed`;
    }

    return null;
  }

  /**
   * Generate unique filename
   */
  private generateFilename(originalName: string, options: UploadOptions): string {
    const ext = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, ext);

    if (options.generateUniqueName) {
      const uuid = uuidv4();
      const prefix = options.filenamePrefix || "";
      return `${prefix}${uuid}${ext}`;
    }

    const prefix = options.filenamePrefix || "";
    return `${prefix}${nameWithoutExt}${ext}`;
  }

  /**
   * Get MIME type from filename
   */
  private getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".pdf": "application/pdf",
      ".txt": "text/plain",
      ".md": "text/markdown",
      ".json": "application/json",
      ".csv": "text/csv",
      ".mp4": "video/mp4",
      ".mov": "video/quicktime",
      ".avi": "video/x-msvideo",
      ".zip": "application/zip",
      ".rar": "application/x-rar-compressed",
    };
    return mimeTypes[ext] || "application/octet-stream";
  }

  /**
   * Get storage configuration
   */
  getConfig(): StorageConfig {
    return this.config;
  }

  /**
   * Update storage configuration
   */
  updateConfig(config: StorageConfig): void {
    this.config = config;
    this.storage = this.createStorageBackend(config);
  }
}
