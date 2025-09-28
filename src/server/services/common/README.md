# Upload Service

A flexible file upload service that supports multiple storage backends and can be used by other services in the application.

## Features

- **Multiple Storage Backends**: Support for local filesystem, S3, Cloudinary, Azure, and Google Cloud Storage
- **File Validation**: Size limits, type restrictions, and MIME type validation
- **Unique Naming**: Automatic generation of unique filenames to prevent conflicts
- **Metadata Support**: Attach custom metadata to uploaded files
- **Error Handling**: Comprehensive error handling with detailed error messages
- **Type Safety**: Full TypeScript support with comprehensive type definitions

## Usage

### Basic Usage

```typescript
import { uploadService } from "@/server/services";

// Upload from FormData
const result = await uploadService.uploadFromFormData(formData, "file", {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ["jpg", "png", "pdf"],
  generateUniqueName: true,
  path: "documents",
});

// Upload from buffer
const buffer = Buffer.from(fileData);
const result = await uploadService.uploadFile(buffer, "filename.jpg", {
  allowedMimeTypes: ["image/jpeg", "image/png"],
  filenamePrefix: "user_",
  metadata: { userId: "123", category: "profile" },
});
```

### In API Routes

```typescript
// app/api/upload/route.ts
import { NextRequest } from "next/server";
import { uploadService } from "@/server/services";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  
  const result = await uploadService.uploadFromFormData(formData, "file", {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["jpg", "jpeg", "png", "pdf"],
    generateUniqueName: true,
    path: "uploads",
  });

  if (!result.success) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  return Response.json(result.data);
}
```

### In Other Services

```typescript
// In any service
import { uploadService } from "@/server/services";

class ProjectService {
  async uploadProjectImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadService.uploadFromFormData(formData, "file", {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ["jpg", "jpeg", "png", "webp"],
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
      generateUniqueName: true,
      filenamePrefix: "project_",
      path: "projects/images",
      metadata: {
        uploadedAt: new Date().toISOString(),
        category: "project-image",
      },
    });

    if (!result.success) {
      throw new Error(result.error);
    }

    return result.data;
  }
}
```

## Configuration

### Environment Variables

```bash
# Storage type (local, s3, cloudinary, azure, gcs)
STORAGE_TYPE=local

# Local storage configuration
UPLOAD_DIR=uploads
UPLOAD_PUBLIC_URL=http://localhost:3000/uploads

# S3 configuration
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_ENDPOINT=https://s3.amazonaws.com # Optional

# Cloudinary configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Custom Configuration

```typescript
import { UploadService, StorageType } from "@/server/services";

const customUploadService = new UploadService({
  type: StorageType.LOCAL,
  local: {
    uploadDir: "custom-uploads",
    publicUrl: "https://example.com/custom-uploads",
  },
});
```

## Upload Options

| Option | Type | Description |
|--------|------|-------------|
| `maxSize` | `number` | Maximum file size in bytes |
| `allowedTypes` | `string[]` | Allowed file extensions (without dot) |
| `allowedMimeTypes` | `string[]` | Allowed MIME types |
| `generateUniqueName` | `boolean` | Generate unique filename to prevent conflicts |
| `filenamePrefix` | `string` | Prefix to add to filename |
| `path` | `string` | Storage path/directory |
| `metadata` | `Record<string, any>` | Additional metadata to attach |

## Response Format

```typescript
interface UploadResult {
  success: boolean;
  data?: {
    filename: string;        // Generated filename
    originalName: string;    // Original filename
    size: number;           // File size in bytes
    mimeType: string;       // MIME type
    path: string;           // Full file path
    url?: string;           // Public URL (if applicable)
    metadata?: Record<string, any>; // Custom metadata
  };
  error?: string;
}
```

## File Management

```typescript
// Check if file exists
const existsResult = await uploadService.fileExists("/path/to/file.jpg");

// Get file URL
const urlResult = await uploadService.getFileUrl("/path/to/file.jpg");

// Delete file
const deleteResult = await uploadService.deleteFile("/path/to/file.jpg");
```

## Storage Backends

### Local Storage (Default)
- Files stored in local filesystem
- Configurable upload directory
- Public URL generation

### S3 (Planned)
- Amazon S3 integration
- Configurable bucket and region
- Automatic URL generation

### Cloudinary (Planned)
- Cloud-based image management
- Automatic optimization
- Transform capabilities

### Azure Blob Storage (Planned)
- Microsoft Azure integration
- Container-based storage

### Google Cloud Storage (Planned)
- Google Cloud integration
- Bucket-based storage

## Error Handling

The service provides comprehensive error handling:

```typescript
const result = await uploadService.uploadFile(buffer, "file.jpg", options);

if (!result.success) {
  console.error("Upload failed:", result.error);
  // Handle error appropriately
} else {
  console.log("Upload successful:", result.data);
}
```

Common error scenarios:
- File size exceeds limit
- File type not allowed
- Storage backend unavailable
- Invalid configuration
- Permission denied

## Best Practices

1. **Always validate file types** to prevent security issues
2. **Set reasonable file size limits** to prevent abuse
3. **Use unique filenames** to prevent conflicts
4. **Store metadata** for better file management
5. **Handle errors gracefully** in your application
6. **Use appropriate storage paths** for organization
7. **Consider file cleanup** for temporary uploads
