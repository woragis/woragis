"use client";

import React, { useState, useEffect } from "react";
import { Button, FileUpload } from "@/components/ui";
import { MarkdownEditor } from "@/components/ui/MarkdownEditor";
import { useProjectTags } from "@/hooks/useProjectTags";
import { useFrameworks } from "@/hooks/useFrameworks";
import { Tag, X, Video, FileText, Code, Plus, Minus, Upload } from "lucide-react";
import type { Project, NewProject, ProjectWithFrameworks } from "@/types";
import type { ProjectTag } from "@/types/project-tags";
import type { Framework } from "@/types/frameworks";

interface ProjectFormProps {
  project?: ProjectWithFrameworks;
  userId: string;
  onSubmit: (project: NewProject) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  userId,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    longDescription: "",
    content: "",
    videoUrl: "",
    frameworks: [] as string[],
    image: "",
    githubUrl: "",
    liveUrl: "",
    featured: false,
    order: 0,
    visible: true,
    public: true,
  });

  const [selectedTags, setSelectedTags] = useState<ProjectTag[]>([]);
  const [selectedFrameworks, setSelectedFrameworks] = useState<Framework[]>([]);

  const { data: availableTags = [] } = useProjectTags({ visible: true });
  const { data: availableFrameworks = [] } = useFrameworks({ visible: true });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        slug: project.slug || "",
        description: project.description || "",
        longDescription: project.longDescription || "",
        content: project.content || "",
        videoUrl: project.videoUrl || "",
        frameworks: [], // Will be populated from project.frameworks relation
        image: project.image || "",
        githubUrl: project.githubUrl || "",
        liveUrl: project.liveUrl || "",
        featured: project.featured || false,
        order: project.order || 0,
        visible: project.visible || true,
        public: project.public || true,
      });
      
      // Set selected frameworks if project has frameworks relation
      if (project.frameworks) {
        setSelectedFrameworks(project.frameworks);
        setFormData(prev => ({
          ...prev,
          frameworks: project.frameworks?.map(f => f.id) || []
        }));
      }
    }
  }, [project]);

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

  const handleAddFramework = (framework: Framework) => {
    if (!selectedFrameworks.find((f) => f.id === framework.id)) {
      const newSelectedFrameworks = [...selectedFrameworks, framework];
      setSelectedFrameworks(newSelectedFrameworks);
      setFormData((prev) => ({
        ...prev,
        frameworks: newSelectedFrameworks.map((f) => f.id),
      }));
    }
  };

  const handleRemoveFramework = (frameworkId: string) => {
    const newSelectedFrameworks = selectedFrameworks.filter((f) => f.id !== frameworkId);
    setSelectedFrameworks(newSelectedFrameworks);
    setFormData((prev) => ({
      ...prev,
      frameworks: newSelectedFrameworks.map((f) => f.id),
    }));
  };

  const handleAddTag = (tag: ProjectTag) => {
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
      image: fileUrl,
    }));
  };

  const handleVideoUpload = (fileUrl: string) => {
    setFormData(prev => ({
      ...prev,
      videoUrl: fileUrl,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      userId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          placeholder="project-url-slug"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          URL-friendly version of the title (lowercase, hyphens instead of
          spaces)
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Long Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Long Description
        </label>
        <textarea
          name="longDescription"
          value={formData.longDescription}
          onChange={handleInputChange}
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Video Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <Video className="w-4 h-4 mr-2" />
          Project Demo Video
        </label>
        <div className="space-y-3">
          <FileUpload
            accept="video/*,.mp4,.webm,.mov,.avi"
            maxSize={50 * 1024 * 1024} // 50MB
            onUpload={(fileUrl) => handleVideoUpload(fileUrl)}
            currentUrl={formData.videoUrl}
            uploadOptions={{
              path: "projects/videos",
              generateUniqueName: true,
              filenamePrefix: `project_${formData.slug || 'video'}_`,
              metadata: {
                projectId: project?.id,
                category: "project-video",
              },
            }}
            placeholder="Upload video file or drag and drop"
            showPreview={true}
          />
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Or enter URL manually:</span>
          </div>
          <input
            type="url"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleInputChange}
            placeholder="https://example.com/demo-video.mp4"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Rich Content - Markdown Editor */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Project Details (Markdown)
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
          placeholder="Write detailed project information using Markdown...

## Project Overview
Describe what this project does and why it's important.

## Features
- Feature 1
- Feature 2
- Feature 3

## Technical Details
Explain the technical implementation, architecture, or key technologies used.

## Challenges & Solutions
Describe any interesting challenges you faced and how you solved them.

## Future Improvements
What would you like to add or improve in the future?"
          label="Rich Content"
          description="Use Markdown to create rich, formatted content for your project details page. This will be displayed on the public project page."
          uploadPath="projects/content"
          uploadMetadata={{
            projectId: project?.id,
            projectSlug: formData.slug,
            category: "project-content",
          }}
        />
      </div>

      {/* Frameworks & Languages */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <Code className="w-4 h-4 mr-2" />
          Frameworks & Languages
        </label>

        {/* Selected Frameworks */}
        {selectedFrameworks.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Selected frameworks & languages:
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedFrameworks.map((framework) => (
                <span
                  key={framework.id}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: framework.color || "#10B981" }}
                >
                  {framework.icon && (
                    <span className="text-xs">{framework.icon}</span>
                  )}
                  {framework.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveFramework(framework.id)}
                    className="ml-1 hover:bg-black hover:bg-opacity-20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Available Frameworks */}
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Available frameworks & languages:
          </p>
          
          {/* Languages */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Programming Languages
            </h4>
            <div className="flex flex-wrap gap-2">
              {availableFrameworks
                .filter((framework) => framework.type === "language")
                .filter((framework) => !selectedFrameworks.find((f) => f.id === framework.id))
                .map((framework) => (
                  <button
                    key={framework.id}
                    type="button"
                    onClick={() => handleAddFramework(framework)}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {framework.icon && (
                      <span className="text-xs">{framework.icon}</span>
                    )}
                    {framework.name}
                    <Plus className="w-3 h-3" />
                  </button>
                ))}
            </div>
          </div>

          {/* Frameworks */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Frameworks & Libraries
            </h4>
            <div className="flex flex-wrap gap-2">
              {availableFrameworks
                .filter((framework) => framework.type === "framework")
                .filter((framework) => !selectedFrameworks.find((f) => f.id === framework.id))
                .map((framework) => (
                  <button
                    key={framework.id}
                    type="button"
                    onClick={() => handleAddFramework(framework)}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {framework.icon && (
                      <span className="text-xs">{framework.icon}</span>
                    )}
                    {framework.name}
                    <Plus className="w-3 h-3" />
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Project Tags
        </label>

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

        {/* Available Tags */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Available tags:
          </p>
          <div className="flex flex-wrap gap-2">
            {availableTags
              .filter(
                (tag: ProjectTag) => !selectedTags.find((t) => t.id === tag.id)
              )
              .map((tag: ProjectTag) => (
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
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <Upload className="w-4 h-4 mr-2" />
          Project Image *
        </label>
        <div className="space-y-3">
          <FileUpload
            accept="image/*,.jpg,.jpeg,.png,.webp"
            maxSize={5 * 1024 * 1024} // 5MB
            onUpload={(fileUrl) => handleImageUpload(fileUrl)}
            currentUrl={formData.image}
            uploadOptions={{
              path: "projects/images",
              generateUniqueName: true,
              filenamePrefix: `project_${formData.slug || 'image'}_`,
              metadata: {
                projectId: project?.id,
                category: "project-image",
              },
            }}
            placeholder="Upload project image or drag and drop"
            showPreview={true}
          />
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Or enter URL manually:</span>
          </div>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            required
            placeholder="https://example.com/project-image.jpg"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* GitHub URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          GitHub URL
        </label>
        <input
          type="url"
          name="githubUrl"
          value={formData.githubUrl}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Live URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Live URL
        </label>
        <input
          type="url"
          name="liveUrl"
          value={formData.liveUrl}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Order */}
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
          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Featured Project
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

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading
            ? "Saving..."
            : project
            ? "Update Project"
            : "Create Project"}
        </Button>
      </div>
    </form>
  );
};
