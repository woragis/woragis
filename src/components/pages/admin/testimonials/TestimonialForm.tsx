"use client";

import React, { useState, useEffect } from "react";
import { Button, FileUpload } from "@/components/ui";
import { useTestimonialTags } from "@/hooks/useTestimonialTags";
import { Tag, X, Plus, Upload, Star, User, Building2, Quote } from "lucide-react";
import type { Testimonial, NewTestimonial, TestimonialWithTags } from "@/types";
import type { TestimonialTag } from "@/types/testimonial-tags";

interface TestimonialFormProps {
  testimonial?: TestimonialWithTags;
  userId: string;
  onSubmit: (testimonial: NewTestimonial) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TestimonialForm: React.FC<TestimonialFormProps> = ({
  testimonial,
  userId,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    company: "",
    content: "",
    avatar: "",
    rating: 5,
    featured: false,
    order: 0,
    visible: true,
    public: true,
  });

  const [selectedTags, setSelectedTags] = useState<TestimonialTag[]>([]);

  const { data: availableTags = [] } = useTestimonialTags({ visible: true });

  useEffect(() => {
    if (testimonial) {
      setFormData({
        name: testimonial.name || "",
        position: testimonial.position || "",
        company: testimonial.company || "",
        content: testimonial.content || "",
        avatar: testimonial.avatar || "",
        rating: testimonial.rating || 5,
        featured: testimonial.featured || false,
        order: testimonial.order || 0,
        visible: testimonial.visible || true,
        public: testimonial.public || true,
      });
      
      // Set selected tags if testimonial has tags relation
      if (testimonial.tags) {
        setSelectedTags(testimonial.tags);
      }
    }
  }, [testimonial]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddTag = (tag: TestimonialTag) => {
    if (!selectedTags.find((t) => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
  };

  const handleAvatarUpload = (fileUrl: string) => {
    setFormData(prev => ({
      ...prev,
      avatar: fileUrl,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      userId,
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "text-yellow-400 fill-current"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name and Position */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <User className="w-4 h-4 mr-2" />
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="e.g., John Doe"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Position *
          </label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            required
            placeholder="e.g., Senior Developer"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Company */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <Building2 className="w-4 h-4 mr-2" />
          Company *
        </label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleInputChange}
          required
          placeholder="e.g., Tech Corp Inc."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <Quote className="w-4 h-4 mr-2" />
          Testimonial Content *
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          required
          rows={5}
          placeholder="Write the testimonial content here..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Avatar Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <Upload className="w-4 h-4 mr-2" />
          Avatar
        </label>
        <div className="space-y-3">
          <FileUpload
            accept="image/*,.jpg,.jpeg,.png,.webp"
            maxSize={2 * 1024 * 1024} // 2MB
            onUpload={(fileUrl) => handleAvatarUpload(fileUrl)}
            currentUrl={formData.avatar}
            uploadOptions={{
              path: "testimonials/avatars",
              generateUniqueName: true,
              filenamePrefix: `testimonial_${formData.name.replace(/\s+/g, '_').toLowerCase()}_`,
              metadata: {
                testimonialId: testimonial?.id,
                category: "testimonial-avatar",
              },
            }}
            placeholder="Upload avatar image or drag and drop"
            showPreview={true}
          />
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Or enter URL manually:</span>
          </div>
          <input
            type="url"
            name="avatar"
            value={formData.avatar}
            onChange={handleInputChange}
            placeholder="https://example.com/avatar.jpg"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <Star className="w-4 h-4 mr-2" />
          Rating *
        </label>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            {renderStars(formData.rating)}
          </div>
          <input
            type="range"
            name="rating"
            value={formData.rating}
            onChange={handleInputChange}
            min="1"
            max="5"
            step="1"
            className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[2rem]">
            {formData.rating}/5
          </span>
        </div>
      </div>

      {/* Testimonial Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Testimonial Tags
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
                (tag: TestimonialTag) => !selectedTags.find((t) => t.id === tag.id)
              )
              .map((tag: TestimonialTag) => (
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
          <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300 flex items-center">
            <Star className="w-4 h-4 mr-1" />
            Featured Testimonial
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
            : testimonial
            ? "Update Testimonial"
            : "Create Testimonial"}
        </Button>
      </div>
    </form>
  );
};
