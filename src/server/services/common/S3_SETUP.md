# S3 Storage Setup Guide

This guide explains how to configure Amazon S3 for file uploads in production.

## Overview

The upload service supports both local file storage (development) and Amazon S3 (production). S3 configuration is **mandatory** when `NODE_ENV=production` and `STORAGE_TYPE=s3`.

## Environment Variables

### Required for Production (when STORAGE_TYPE=s3)

```bash
# Storage Configuration
STORAGE_TYPE=s3
NODE_ENV=production

# S3 Configuration (MANDATORY in production)
AWS_S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=us-east-1  # Default: us-east-1
```

### Optional S3 Configuration

```bash
# Custom S3 endpoint (for non-AWS S3-compatible services)
AWS_S3_ENDPOINT=https://s3.amazonaws.com
```

## AWS S3 Setup

### 1. Create S3 Bucket

1. Log into AWS Console
2. Navigate to S3 service
3. Click "Create bucket"
4. Choose a unique bucket name
5. Select region (note this for `AWS_REGION`)
6. Configure bucket settings:
   - **Block Public Access**: Configure based on your needs
   - **Versioning**: Recommended for file safety
   - **Encryption**: Enable for security

### 2. Create IAM User

1. Navigate to IAM service
2. Click "Users" → "Create user"
3. Choose username (e.g., `portfolio-upload-user`)
4. Attach policies:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:DeleteObject",
           "s3:HeadObject"
         ],
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```

### 3. Generate Access Keys

1. Go to your IAM user
2. Click "Security credentials" tab
3. Click "Create access key"
4. Choose "Application running outside AWS"
5. Copy the Access Key ID and Secret Access Key

## Bucket Policy (Optional)

For public read access to uploaded files:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

## CORS Configuration (Optional)

If uploading directly from browser:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://yourdomain.com"],
    "ExposeHeaders": []
  }
]
```

## File Organization

Files are organized in S3 with the following structure:

```
your-bucket/
├── projects/
│   ├── images/
│   │   └── project_slug_image_uuid.jpg
│   ├── videos/
│   │   └── project_slug_video_uuid.mp4
│   ├── documents/
│   │   └── project_slug_doc_uuid.pdf
│   └── content/
│       └── markdown_image_uuid.png
├── blog/
│   ├── images/
│   └── attachments/
└── users/
    ├── profiles/
    └── resumes/
```

## URL Generation

Files uploaded to S3 are accessible via URLs like:
```
https://your-bucket-name.s3.us-east-1.amazonaws.com/projects/images/project_slug_image_uuid.jpg
```

## Production Deployment

### Environment Variables

Set these in your production environment:

```bash
NODE_ENV=production
STORAGE_TYPE=s3
AWS_S3_BUCKET=your-production-bucket
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-production-access-key
AWS_SECRET_ACCESS_KEY=your-production-secret-key
```

### Validation

The application will validate S3 configuration on startup in production:

- ✅ All required environment variables are present
- ✅ S3 credentials are valid
- ✅ Bucket exists and is accessible

If validation fails, the application will not start.

## Development vs Production

### Development
- Defaults to local storage (`uploads/` directory)
- S3 is optional, falls back to local if not configured
- Files served via Next.js API routes

### Production
- S3 configuration is **mandatory** when `STORAGE_TYPE=s3`
- Environment validation on startup
- Direct S3 URLs for file access
- Better scalability and performance

## Security Considerations

1. **IAM Permissions**: Use minimal required permissions
2. **Access Keys**: Rotate regularly
3. **Bucket Policies**: Configure appropriate public access
4. **HTTPS**: Ensure all S3 URLs use HTTPS
5. **CORS**: Configure for your domain only

## Troubleshooting

### Common Issues

1. **"Access Denied"**
   - Check IAM permissions
   - Verify bucket name and region
   - Ensure access keys are correct

2. **"Bucket not found"**
   - Verify bucket name
   - Check region configuration
   - Ensure bucket exists in the specified region

3. **"Invalid credentials"**
   - Verify access key ID and secret
   - Check if keys are active
   - Ensure proper IAM permissions

### Debug Mode

Set `NODE_ENV=development` temporarily to see detailed error messages.

## Cost Optimization

1. **Lifecycle Policies**: Set up automatic deletion of old files
2. **Storage Classes**: Use appropriate storage classes for different file types
3. **CloudFront**: Use CloudFront for better performance and cost
4. **Monitoring**: Set up CloudWatch alarms for unusual activity
