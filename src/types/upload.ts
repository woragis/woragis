export interface UploadOptions {
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Allowed file types/extensions */
  allowedTypes?: string[];
  /** Allowed MIME types */
  allowedMimeTypes?: string[];
  /** Generate unique filename */
  generateUniqueName?: boolean;
  /** Custom filename prefix */
  filenamePrefix?: string;
  /** Storage path/directory */
  path?: string;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

export interface UploadResult {
  success: boolean;
  data?: {
    filename: string;
    originalName: string;
    size: number;
    mimeType: string;
    path: string;
    url?: string;
    metadata?: Record<string, any>;
  };
  error?: string;
}

export interface FileInfo {
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  path: string;
  url?: string;
  metadata?: Record<string, any>;
}

export interface StorageBackend {
  upload(
    buffer: Buffer,
    filename: string,
    options: UploadOptions
  ): Promise<UploadResult>;
  delete(path: string): Promise<boolean>;
  getUrl(path: string): Promise<string | null>;
  exists(path: string): Promise<boolean>;
}

export enum StorageType {
  LOCAL = 'local',
  S3 = 's3',
  CLOUDINARY = 'cloudinary',
  AZURE = 'azure',
  GCS = 'gcs',
}

export interface StorageConfig {
  type: StorageType;
  local?: {
    uploadDir: string;
    publicUrl: string;
  };
  s3?: {
    bucket: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    endpoint?: string;
  };
  cloudinary?: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
  azure?: {
    accountName: string;
    accountKey: string;
    containerName: string;
  };
  gcs?: {
    projectId: string;
    bucketName: string;
    keyFilename?: string;
  };
}
