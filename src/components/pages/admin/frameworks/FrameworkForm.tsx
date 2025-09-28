"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import { Code, Palette, Globe, Hash, Eye } from "lucide-react";
import type { Framework, NewFramework } from "@/types";

interface FrameworkFormProps {
  framework?: Framework;
  userId: string;
  onSubmit: (framework: NewFramework) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const FrameworkForm: React.FC<FrameworkFormProps> = ({
  framework,
  userId,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    color: "#3B82F6",
    website: "",
    version: "",
    type: "framework" as "framework" | "language",
    order: 0,
    visible: true,
  });

  useEffect(() => {
    if (framework) {
      setFormData({
        name: framework.name || "",
        slug: framework.slug || "",
        description: framework.description || "",
        icon: framework.icon || "",
        color: framework.color || "#3B82F6",
        website: framework.website || "",
        version: framework.version || "",
        type: framework.type || "framework",
        order: framework.order || 0,
        visible: framework.visible || true,
      });
    }
  }, [framework]);

  const generateSlug = (name: string) => {
    return name
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

      // Auto-generate slug when name changes (only if slug is empty or matches the previous name)
      if (
        name === "name" &&
        (!prev.slug || prev.slug === generateSlug(prev.name))
      ) {
        newData.slug = generateSlug(value);
      }

      return newData;
    });
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
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <Code className="w-4 h-4 mr-2" />
          Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          placeholder="e.g., React, JavaScript, Python"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <Hash className="w-4 h-4 mr-2" />
          Slug *
        </label>
        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleInputChange}
          required
          placeholder="framework-url-slug"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          URL-friendly version of the name (lowercase, hyphens instead of spaces)
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Type *
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="framework">Framework/Library</option>
          <option value="language">Programming Language</option>
        </select>
      </div>

      {/* Icon and Website */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Icon
          </label>
          <input
            type="text"
            name="icon"
            value={formData.icon}
            onChange={handleInputChange}
            placeholder="e.g., ⚛️ or icon URL"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            Website
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Version, Color, and Order */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Version
          </label>
          <input
            type="text"
            name="version"
            value={formData.version}
            onChange={handleInputChange}
            placeholder="1.0.0"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <Palette className="w-4 h-4 mr-2" />
            Color
          </label>
          <input
            type="color"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md"
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

      {/* Visible checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="visible"
          checked={formData.visible}
          onChange={handleInputChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300 flex items-center">
          <Eye className="w-4 h-4 mr-1" />
          Visible
        </label>
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
            : framework
            ? "Update Framework"
            : "Create Framework"}
        </Button>
      </div>
    </form>
  );
};
