"use client";

import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "../layout/Button";
import { Card } from "../layout/Card";
import { FileUpload } from "./FileUpload";
import { Eye, Edit3, Save, X, Image, Upload } from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  description?: string;
  uploadPath?: string;
  uploadMetadata?: Record<string, any>;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your content in Markdown...",
  className = "",
  label = "Content",
  description,
  uploadPath = "general",
  uploadMetadata = {},
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancel();
    }
    if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  const insertImageAtCursor = (imageUrl: string, altText: string = "") => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    // Create markdown image syntax
    const imageMarkdown = `![${altText}](${imageUrl})`;
    
    // Insert the image markdown at cursor position
    const newText = text.substring(0, start) + imageMarkdown + text.substring(end);
    
    // Update the content
    onChange(newText);
    
    // Set cursor position after the inserted image
    const newCursorPos = start + imageMarkdown.length;
    
    // Use setTimeout to ensure the textarea has updated
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleImageUpload = (imageUrl: string, fileInfo: { name: string; size: number; type: string }) => {
    // Extract filename without extension for alt text
    const altText = fileInfo.name.replace(/\.[^/.]+$/, "");
    insertImageAtCursor(imageUrl, altText);
    setShowImageUpload(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-1"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit</span>
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center space-x-1"
          >
            <Eye className="w-4 h-4" />
            <span>{isPreview ? "Edit" : "Preview"}</span>
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        {isEditing ? (
          <div className="space-y-4">
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Markdown Editor
                </h3>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    className="flex items-center space-x-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSave}
                    className="flex items-center space-x-1"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </Button>
                </div>
              </div>
              {/* Toolbar */}
              <div className="mt-3 flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImageUpload(!showImageUpload)}
                  className="flex items-center space-x-1"
                >
                  <Image className="w-4 h-4" alt="Insert Image" />
                  <span>Insert Image</span>
                </Button>
              </div>
            </div>
            
            {/* Image Upload Section */}
            {showImageUpload && (
              <div className="px-4 pb-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </h4>
                  <FileUpload
                    accept="image/*,.jpg,.jpeg,.png,.webp,.gif"
                    maxSize={5 * 1024 * 1024} // 5MB
                    onUpload={handleImageUpload}
                    uploadOptions={{
                      path: uploadPath,
                      generateUniqueName: true,
                      filenamePrefix: "markdown_",
                      metadata: {
                        ...uploadMetadata,
                        category: "markdown-image",
                      },
                    }}
                    placeholder="Upload image for markdown content"
                    showPreview={false}
                    className="mb-3"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    The image will be inserted at your cursor position in the editor.
                  </p>
                </div>
              </div>
            )}
            
            <div className="p-4">
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                <p>Tip: Use Ctrl+S (or Cmd+S) to save, Esc to cancel</p>
                <p>
                  Supports Markdown syntax including **bold**, *italic*,
                  [links](url), and more
                </p>
                <p>
                  Use the &quot;Insert Image&quot; button above to upload and insert images directly into your content.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {isPreview ? (
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {value ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {value}
                  </ReactMarkdown>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    No content to preview. Click &quot;Edit&quot; to add content.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Current Content
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-1"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </Button>
                </div>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {value ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {value}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      No content available. Click &quot;Edit&quot; to add content.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
