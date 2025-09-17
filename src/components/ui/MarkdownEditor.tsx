"use client";

import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "./Button";
import { Card } from "./Card";
import { Eye, Edit3, Save, X } from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  description?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your content in Markdown...",
  className = "",
  label = "Content",
  description,
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    className="flex items-center space-x-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="flex items-center space-x-1"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </Button>
                </div>
              </div>
            </div>
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
