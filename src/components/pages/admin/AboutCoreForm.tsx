"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import { useExperience } from "@/hooks/useExperience";
import type { AboutCore, NewAboutCore } from "@/types";

interface AboutCoreFormProps {
  aboutCore?: AboutCore;
  onSubmit: (aboutCore: NewAboutCore) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AboutCoreForm: React.FC<AboutCoreFormProps> = ({
  aboutCore,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    currentProfessionId: "",
    biography: "",
    featuredBiography: "",
    visible: true,
  });

  const { data: experiences = [] } = useExperience({ visible: true });

  useEffect(() => {
    if (aboutCore) {
      setFormData({
        name: aboutCore.name || "",
        currentProfessionId: aboutCore.currentProfessionId || "",
        biography: aboutCore.biography || "",
        featuredBiography: aboutCore.featuredBiography || "",
        visible: aboutCore.visible || true,
      });
    }
  }, [aboutCore]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Current Profession */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Current Profession
        </label>
        <select
          name="currentProfessionId"
          value={formData.currentProfessionId}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Select a profession</option>
          {experiences.map((experience) => (
            <option key={experience.id} value={experience.id}>
              {experience.title} at {experience.company}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Select your current profession from your experience entries
        </p>
      </div>

      {/* Biography */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Biography
        </label>
        <textarea
          name="biography"
          value={formData.biography}
          onChange={handleInputChange}
          rows={5}
          placeholder="Tell us about yourself..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          A brief description about yourself
        </p>
      </div>

      {/* Featured Biography */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Featured Biography
        </label>
        <textarea
          name="featuredBiography"
          value={formData.featuredBiography}
          onChange={handleInputChange}
          rows={3}
          placeholder="A highlighted version of your biography for featured sections..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          A shorter, highlighted version of your biography for featured sections
        </p>
      </div>

      {/* Visibility */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="visible"
          checked={formData.visible}
          onChange={handleInputChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          Visible to public
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
            : aboutCore
            ? "Update About"
            : "Create About"}
        </Button>
      </div>
    </form>
  );
};
