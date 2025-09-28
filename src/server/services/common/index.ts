// Common services exports
export { UploadService } from "./upload.service";
export { getUploadConfig, defaultUploadConfig } from "./upload-config";

// Re-export types for convenience
export type {
  UploadOptions,
  UploadResult,
  FileInfo,
  StorageBackend,
  StorageType,
  StorageConfig,
} from "@/types/upload";
