"use client";

import React, { useState, useRef, useCallback } from "react";
import { Upload, X, Check, AlertCircle, Loader2, FileText } from "lucide-react";
import { Button } from "../layout/Button";

export interface FileUploadProps {
  /** Accepted file types (MIME types or extensions) */
  accept?: string;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Callback when file is successfully uploaded */
  onUpload: (fileUrl: string, fileInfo: { name: string; size: number; type: string }) => void;
  /** Callback when upload fails */
  onError?: (error: string) => void;
  /** Current file URL (for editing existing files) */
  currentUrl?: string;
  /** Upload endpoint */
  endpoint?: string;
  /** Additional upload options */
  uploadOptions?: {
    path?: string;
    generateUniqueName?: boolean;
    filenamePrefix?: string;
    allowedTypes?: string[];
    metadata?: Record<string, any>;
  };
  /** UI customization */
  className?: string;
  placeholder?: string;
  showPreview?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept = "*/*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  onUpload,
  onError,
  currentUrl,
  endpoint = "/api/upload",
  uploadOptions = {},
  className = "",
  placeholder = "Click to upload or drag and drop",
  showPreview = true,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: number;
    type: string;
    url: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File size exceeds maximum allowed size of ${Math.round(maxSize / 1024 / 1024)}MB`;
    }

    // Check file type if accept is specified and not "*/*"
    if (accept !== "*/*") {
      const acceptedTypes = accept.split(",").map(type => type.trim());
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      const fileMimeType = file.type;

      const isAccepted = acceptedTypes.some(acceptedType => {
        if (acceptedType.startsWith(".")) {
          return acceptedType === fileExtension;
        } else if (acceptedType.includes("/")) {
          return fileMimeType === acceptedType || fileMimeType.startsWith(acceptedType.replace("*", ""));
        }
        return false;
      });

      if (!isAccepted) {
        return `File type not allowed. Accepted types: ${acceptedTypes.join(", ")}`;
      }
    }

    return null;
  }, [accept, maxSize]);

  const handleUpload = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      onError?.(validationError);
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Add upload options as form data
      Object.entries(uploadOptions).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
        }
      });

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }

      const fileInfo = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: result.data.url || result.data.path,
      };

      setUploadedFile(fileInfo);
      setPreviewUrl(fileInfo.url);
      onUpload(fileInfo.url, fileInfo);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [validateFile, onUpload, onError, endpoint, uploadOptions]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  }, [handleUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  }, [handleUpload]);

  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  const isVideo = (url: string) => {
    return /\.(mp4|webm|ogg|mov|avi)$/i.test(url);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-colors
          ${dragActive 
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
          }
          ${isUploading ? "pointer-events-none opacity-50" : ""}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        <div className="text-center">
          {isUploading ? (
            <div className="space-y-2">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Uploading... {uploadProgress > 0 && `${uploadProgress}%`}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium">{placeholder}</p>
                <p className="text-xs mt-1">
                  Max size: {Math.round(maxSize / 1024 / 1024)}MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Upload Success */}
      {uploadedFile && (
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm text-green-800 dark:text-green-200">
              {uploadedFile.name} uploaded successfully
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemoveFile}
            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Preview */}
      {showPreview && previewUrl && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Preview:
          </label>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            {isImage(previewUrl) && (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
            )}
            {isVideo(previewUrl) && (
              <video
                src={previewUrl}
                controls
                className="w-full h-48"
              >
                Your browser does not support the video tag.
              </video>
            )}
            {!isImage(previewUrl) && !isVideo(previewUrl) && (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <FileText className="mx-auto h-8 w-8 mb-2" />
                <p className="text-sm">File: {uploadedFile?.name}</p>
                <p className="text-xs">Size: {uploadedFile ? Math.round(uploadedFile.size / 1024) : 0}KB</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Current URL Display (for editing) */}
      {currentUrl && !uploadedFile && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Current File:
          </label>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
              {currentUrl}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
