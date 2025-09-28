"use client";

import React, { useState } from "react";
import { FileUpload } from "@/components/ui";
import { Button } from "@/components/ui";
import { Card } from "@/components/ui";
import { MarkdownEditor } from "@/components/ui/MarkdownEditor";

/**
 * Demo component showing the upload functionality
 * This can be used to test the upload features
 */
export const UploadDemo: React.FC = () => {
  const [markdownContent, setMarkdownContent] = useState(`# Upload Demo

This is a demonstration of the upload functionality.

## Features Demonstrated

- **Image Upload**: Upload images for project thumbnails
- **Video Upload**: Upload video files for project demos  
- **Markdown Image Upload**: Upload images directly into markdown content
- **File Validation**: Automatic file type and size validation
- **Preview**: Real-time preview of uploaded files
- **Drag & Drop**: Support for drag and drop file uploads

## Example Markdown with Image

You can upload images and they will be inserted here automatically when you use the &quot;Insert Image&quot; button in the markdown editor.

![Example Image](https://via.placeholder.com/400x200?text=Uploaded+Image)

## Usage

1. **Project Image Upload**: Use the image upload field to set the main project image
2. **Video Upload**: Use the video upload field for project demo videos
3. **Markdown Images**: Click &quot;Insert Image&quot; in the markdown editor to upload and insert images
4. **Manual URLs**: You can still enter URLs manually if you prefer

## File Types Supported

- **Images**: JPG, JPEG, PNG, WebP, GIF
- **Videos**: MP4, WebM, MOV, AVI
- **Documents**: PDF, DOC, DOCX, TXT, MD

## File Size Limits

- **Project Images**: 5MB max
- **Project Videos**: 50MB max
- **Markdown Images**: 5MB max
- **Documents**: 20MB max
`);

  const [uploadedFiles, setUploadedFiles] = useState<{
    image?: string;
    video?: string;
  }>({});

  const handleImageUpload = (fileUrl: string) => {
    setUploadedFiles(prev => ({ ...prev, image: fileUrl }));
  };

  const handleVideoUpload = (fileUrl: string) => {
    setUploadedFiles(prev => ({ ...prev, video: fileUrl }));
  };

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Upload Functionality Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          This demo shows how the file upload functionality works in the project forms.
        </p>
      </div>

      {/* Project Image Upload Demo */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Project Image Upload
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Upload a project thumbnail image. This will be used as the main image for the project.
        </p>
        <FileUpload
          accept="image/*,.jpg,.jpeg,.png,.webp"
          maxSize={5 * 1024 * 1024} // 5MB
          onUpload={handleImageUpload}
          currentUrl={uploadedFiles.image}
          uploadOptions={{
            path: "projects/images",
            generateUniqueName: true,
            filenamePrefix: "demo_project_",
            metadata: {
              category: "demo-image",
            },
          }}
          placeholder="Upload project image or drag and drop"
          showPreview={true}
        />
        {uploadedFiles.image && (
          <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              ✅ Image uploaded successfully!
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              URL: {uploadedFiles.image}
            </p>
          </div>
        )}
      </Card>

      {/* Project Video Upload Demo */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Project Video Upload
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Upload a project demo video. This will be used to showcase the project.
        </p>
        <FileUpload
          accept="video/*,.mp4,.webm,.mov,.avi"
          maxSize={50 * 1024 * 1024} // 50MB
          onUpload={handleVideoUpload}
          currentUrl={uploadedFiles.video}
          uploadOptions={{
            path: "projects/videos",
            generateUniqueName: true,
            filenamePrefix: "demo_video_",
            metadata: {
              category: "demo-video",
            },
          }}
          placeholder="Upload video file or drag and drop"
          showPreview={true}
        />
        {uploadedFiles.video && (
          <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              ✅ Video uploaded successfully!
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              URL: {uploadedFiles.video}
            </p>
          </div>
        )}
      </Card>

      {/* Markdown Editor with Image Upload Demo */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Markdown Editor with Image Upload
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          This markdown editor includes image upload functionality. Click &quot;Edit&quot; then &quot;Insert Image&quot; to upload images directly into your markdown content.
        </p>
        <MarkdownEditor
          value={markdownContent}
          onChange={setMarkdownContent}
          placeholder="Write your markdown content here..."
          label="Demo Content"
          description="Use the &apos;Insert Image&apos; button to upload images directly into your markdown content"
          uploadPath="projects/content"
          uploadMetadata={{
            category: "demo-content",
          }}
        />
      </Card>

      {/* Summary */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
          🎉 Upload Features Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
          <div>
            <h3 className="font-semibold mb-2">✅ Implemented Features:</h3>
            <ul className="space-y-1">
              <li>• File upload with drag & drop</li>
              <li>• File type validation</li>
              <li>• File size limits</li>
              <li>• Real-time preview</li>
              <li>• Progress indicators</li>
              <li>• Error handling</li>
              <li>• Unique filename generation</li>
              <li>• Metadata support</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">🎯 Integration Points:</h3>
            <ul className="space-y-1">
              <li>• Project form image upload</li>
              <li>• Project form video upload</li>
              <li>• Markdown editor image upload</li>
              <li>• Automatic URL population</li>
              <li>• Organized file storage</li>
              <li>• API endpoint ready</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
