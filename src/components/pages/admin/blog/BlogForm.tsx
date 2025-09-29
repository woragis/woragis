"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, FileUpload } from "@/components/ui";
import { MarkdownEditor } from "@/components/ui";
import { useBlogTags } from "@/hooks/useBlogTags";
import { Tag, X, FileText, Plus, Upload, Calendar, Eye, Star } from "lucide-react";
import type { BlogPost, NewBlogPost, BlogPostWithTags } from "@/types";
import type { BlogTag } from "@/types/blog-tags";

interface BlogFormProps {
  blogPost?: BlogPostWithTags;
  userId: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading?: boolean;
  onFormDataChange?: (data: any) => void;
}

export const BlogForm: React.FC<BlogFormProps> = ({
  blogPost,
  userId,
  onSubmit,
  onCancel,
  isLoading = false,
  onFormDataChange,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    readingTime: 0,
    featured: false,
    published: false,
    publishedAt: "",
    order: 0,
    visible: true,
    public: true,
  });

  const [selectedTags, setSelectedTags] = useState<BlogTag[]>([]);
  const [showTagSection, setShowTagSection] = useState(false);

  const { data: availableTags = [] } = useBlogTags({ visible: true }, { enabled: showTagSection });

  useEffect(() => {
    if (blogPost) {
      setFormData({
        title: blogPost.title || "",
        slug: blogPost.slug || "",
        excerpt: blogPost.excerpt || "",
        content: blogPost.content || "",
        featuredImage: blogPost.featuredImage || "",
        readingTime: blogPost.readingTime || 0,
        featured: blogPost.featured || false,
        published: blogPost.published || false,
        publishedAt: blogPost.publishedAt ? new Date(blogPost.publishedAt).toISOString().slice(0, 16) : "",
        order: blogPost.order || 0,
        visible: blogPost.visible || true,
        public: blogPost.public || true,
      });
      
      // Set selected tags if blog post has tags relation
      if (blogPost.tags) {
        setSelectedTags(blogPost.tags);
      }
    }
  }, [blogPost]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .trim();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      };

      // Auto-generate slug when title changes (only if slug is empty or matches the previous title)
      if (
        name === "title" &&
        (!prev.slug || prev.slug === generateSlug(prev.title))
      ) {
        newData.slug = generateSlug(value);
      }

      return newData;
    });
  };

  const handleAddTag = (tag: BlogTag) => {
    if (!selectedTags.find((t) => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
  };

  const handleImageUpload = (fileUrl: string) => {
    setFormData(prev => ({
      ...prev,
      featuredImage: fileUrl,
    }));
  };

  // Update refs when values change
  // Notify parent of form data changes
  useEffect(() => {
    if (onFormDataChange) {
      onFormDataChange({
        ...formData,
        publishedAt: formData.publishedAt ? new Date(formData.publishedAt) : null,
        userId,
        selectedTags,
      });
    }
  }, [formData, selectedTags, userId, onFormDataChange]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  }, [onSubmit]);

  return (
    <>
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Slug *
        </label>
        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleInputChange}
          required
          placeholder="blog-post-url-slug"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          URL-friendly version of the title (lowercase, hyphens instead of spaces)
        </p>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Excerpt *
        </label>
        <textarea
          name="excerpt"
          value={formData.excerpt}
          onChange={handleInputChange}
          required
          rows={3}
          placeholder="Brief description of the blog post..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Featured Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <Upload className="w-4 h-4 mr-2" />
          Featured Image
        </label>
        <div className="space-y-3">
          <FileUpload
            accept="image/*,.jpg,.jpeg,.png,.webp"
            maxSize={5 * 1024 * 1024} // 5MB
            onUpload={(fileUrl) => handleImageUpload(fileUrl)}
            currentUrl={formData.featuredImage}
            uploadOptions={{
              path: "blog/images",
              generateUniqueName: true,
              filenamePrefix: `blog_${formData.slug || 'image'}_`,
              metadata: {
                blogPostId: blogPost?.id,
                category: "blog-featured-image",
              },
            }}
            placeholder="Upload featured image or drag and drop"
            showPreview={true}
          />
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Or enter URL manually:</span>
          </div>
          <input
            type="url"
            name="featuredImage"
            value={formData.featuredImage}
            onChange={handleInputChange}
            placeholder="https://example.com/featured-image.jpg"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Rich Content - Markdown Editor */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Blog Content (Markdown)
          </h3>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Markdown Guide
            </h4>
            <div className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
              <p><strong>Images with positioning:</strong> <code>![Alt text [left]](image-url.jpg)</code></p>
              <p><strong>Code blocks:</strong> <code>```javascript</code> ... <code>```</code></p>
              <p><strong>Links:</strong> <code>[Link text](https://example.com)</code></p>
              <p><strong>Lists:</strong> Use <code>-</code> for bullet points or <code>1.</code> for numbered lists</p>
              <p><strong>Bold:</strong> <code>**bold text**</code> | <strong>Italic:</strong> <code>*italic text*</code></p>
            </div>
          </div>
        </div>
        <MarkdownEditor
          value={formData.content}
          onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
          placeholder="Write your blog post content using Markdown...

## Introduction
Start with an engaging introduction to your topic.

## Main Content
Develop your main points with examples and explanations.

## Conclusion
Summarize your key points and provide actionable takeaways."
          label="Blog Content"
          description="Use Markdown to create rich, formatted content for your blog post. This will be displayed on the public blog page."
          uploadPath="blog/content"
          uploadMetadata={{
            blogPostId: blogPost?.id,
            blogPostSlug: formData.slug,
            category: "blog-content",
          }}
        />
      </div>

      {/* Blog Tags */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Blog Tags
          </label>
          {!showTagSection && (
            <button
              type="button"
              onClick={() => setShowTagSection(true)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Manage Tags
            </button>
          )}
        </div>

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedTags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: tag.color || "#10B981" }}
              >
                {tag.name}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag.id)}
                  className="ml-1 hover:bg-black hover:bg-opacity-20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Available Tags - Only show when section is expanded */}
        {showTagSection && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Available tags:
              </p>
              <button
                type="button"
                onClick={() => setShowTagSection(false)}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Hide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableTags
                .filter(
                  (tag: BlogTag) => !selectedTags.find((t) => t.id === tag.id)
                )
                .map((tag: BlogTag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: tag.color || "#10B981" }}
                    />
                    {tag.name}
                    <Plus className="w-3 h-3" />
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Reading Time and Order */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Reading Time (minutes)
          </label>
          <input
            type="number"
            name="readingTime"
            value={formData.readingTime}
            onChange={handleInputChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Display Order
          </label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleInputChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Published Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          Published Date
        </label>
        <input
          type="datetime-local"
          name="publishedAt"
          value={formData.publishedAt}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Checkboxes */}
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300 flex items-center">
            <Star className="w-4 h-4 mr-1" />
            Featured Post
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="published"
            checked={formData.published}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300 flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            Published
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="visible"
            checked={formData.visible}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Visible
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="public"
            checked={formData.public}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Public
          </label>
        </div>
      </div>
    </>
  );
};
