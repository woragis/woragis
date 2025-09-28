import { StorageConfig, StorageType } from "@/types/upload";
import { env } from "@/lib/env";

/**
 * Default upload configuration
 */
export const defaultUploadConfig: StorageConfig = {
  type: StorageType.LOCAL,
  local: {
    uploadDir: env.UPLOAD_DIR,
    publicUrl: env.UPLOAD_PUBLIC_URL,
  },
};

/**
 * Get upload configuration from environment variables
 */
export function getUploadConfig(): StorageConfig {
  const storageType = env.STORAGE_TYPE as StorageType;

  switch (storageType) {
    case StorageType.LOCAL:
      return {
        type: StorageType.LOCAL,
        local: {
          uploadDir: env.UPLOAD_DIR,
          publicUrl: env.UPLOAD_PUBLIC_URL,
        },
      };

    case StorageType.S3:
      // In production, S3 configuration is mandatory and validated in env.ts
      if (env.NODE_ENV === "production") {
        return {
          type: StorageType.S3,
          s3: {
            bucket: env.AWS_S3_BUCKET!,
            region: env.AWS_REGION,
            accessKeyId: env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
            endpoint: env.AWS_S3_ENDPOINT,
          },
        };
      } else {
        // In development, check if S3 config is available
        if (!env.AWS_S3_BUCKET || !env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) {
          console.warn("S3 configuration incomplete in development, falling back to local storage");
          return defaultUploadConfig;
        }
        return {
          type: StorageType.S3,
          s3: {
            bucket: env.AWS_S3_BUCKET,
            region: env.AWS_REGION,
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
            endpoint: env.AWS_S3_ENDPOINT,
          },
        };
      }

    case StorageType.CLOUDINARY:
      // TODO: Implement Cloudinary validation when needed
      console.warn("Cloudinary storage type not implemented yet, falling back to local storage");
      return defaultUploadConfig;

    default:
      console.warn(`Unknown storage type: ${storageType}, falling back to local storage`);
      return defaultUploadConfig;
  }
}
