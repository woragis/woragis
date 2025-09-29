"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui";
import { useFrameworks } from "@/hooks/useFrameworks";
import { Building2, MapPin, Calendar, Code, Plus, X, Briefcase, Award } from "lucide-react";
import type { Experience, NewExperience } from "@/types";
import type { Framework } from "@/types/frameworks";

interface ExperienceFormProps {
  experience?: Experience;
  userId: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading?: boolean;
  onFormDataChange?: (data: any) => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({
  experience,
  userId,
  onSubmit,
  onCancel,
  isLoading = false,
  onFormDataChange,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    period: "",
    location: "",
    description: "",
    achievements: [] as string[],
    technologies: [] as string[],
    icon: "",
    order: 0,
    visible: true,
  });

  const [selectedFrameworks, setSelectedFrameworks] = useState<Framework[]>([]);
  const [newAchievement, setNewAchievement] = useState("");
  const [newTechnology, setNewTechnology] = useState("");
  const [showFrameworkSection, setShowFrameworkSection] = useState(false);

  const { data: availableFrameworks = [] } = useFrameworks({ visible: true });

  useEffect(() => {
    if (experience) {
      setFormData({
        title: experience.title || "",
        company: experience.company || "",
        period: experience.period || "",
        location: experience.location || "",
        description: experience.description || "",
        achievements: experience.achievements || [],
        technologies: experience.technologies || [],
        icon: experience.icon || "",
        order: experience.order || 0,
        visible: experience.visible || true,
      });
    }
  }, [experience]);

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

  const handleAddFramework = (framework: Framework) => {
    if (!selectedFrameworks.find((f) => f.id === framework.id)) {
      const newSelectedFrameworks = [...selectedFrameworks, framework];
      setSelectedFrameworks(newSelectedFrameworks);
      setFormData((prev) => ({
        ...prev,
        technologies: newSelectedFrameworks.map((f) => f.name),
      }));
    }
  };

  const handleRemoveFramework = (frameworkId: string) => {
    const newSelectedFrameworks = selectedFrameworks.filter((f) => f.id !== frameworkId);
    setSelectedFrameworks(newSelectedFrameworks);
    setFormData((prev) => ({
      ...prev,
      technologies: newSelectedFrameworks.map((f) => f.name),
    }));
  };

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      setFormData((prev) => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()],
      }));
      setNewAchievement("");
    }
  };

  const handleRemoveAchievement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  const handleAddCustomTechnology = () => {
    if (newTechnology.trim()) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()],
      }));
      setNewTechnology("");
    }
  };

  const handleRemoveCustomTechnology = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }));
  };

  // Update refs when values change
  // Notify parent of form data changes
  useEffect(() => {
    if (onFormDataChange) {
      onFormDataChange({
        ...formData,
        userId,
        selectedFrameworks,
      });
    }
  }, [formData, selectedFrameworks, userId, onFormDataChange]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  }, [onSubmit]);

  return (
    <>
      {/* Title and Company */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Job Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="e.g., Senior Software Engineer"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
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
      </div>

      {/* Period and Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Period *
          </label>
          <input
            type="text"
            name="period"
            value={formData.period}
            onChange={handleInputChange}
            required
            placeholder="e.g., Jan 2020 - Present"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., San Francisco, CA"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
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
          rows={4}
          placeholder="Describe your role and responsibilities..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {/* Achievements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <Award className="w-4 h-4 mr-2" />
          Key Achievements
        </label>

        {/* Current Achievements */}
        {formData.achievements.length > 0 && (
          <div className="mb-3">
            <div className="space-y-2">
              {formData.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {achievement}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAchievement(index)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Achievement */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newAchievement}
            onChange={(e) => setNewAchievement(e.target.value)}
            placeholder="Add a key achievement..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <Button
            type="button"
            onClick={handleAddAchievement}
            disabled={!newAchievement.trim()}
            className="px-4 py-2"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Technologies & Frameworks */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <Code className="w-4 h-4 mr-2" />
            Technologies & Frameworks
          </label>
          {!showFrameworkSection && (
            <button
              type="button"
              onClick={() => setShowFrameworkSection(true)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Manage Frameworks
            </button>
          )}
        </div>

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

        {/* Available Frameworks - Only show when section is expanded */}
        {showFrameworkSection && (
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Available frameworks & languages:
              </p>
              <button
                type="button"
                onClick={() => setShowFrameworkSection(false)}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Hide
              </button>
            </div>
            
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
        )}

        {/* Custom Technologies */}
        {formData.technologies.filter(tech => !selectedFrameworks.some(f => f.name === tech)).length > 0 && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Custom technologies:
            </p>
            <div className="flex flex-wrap gap-2">
              {formData.technologies
                .filter(tech => !selectedFrameworks.some(f => f.name === tech))
                .map((technology, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {technology}
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomTechnology(
                        formData.technologies.findIndex(t => t === technology)
                      )}
                      className="ml-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Add Custom Technology */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newTechnology}
            onChange={(e) => setNewTechnology(e.target.value)}
            placeholder="Add custom technology..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <Button
            type="button"
            onClick={handleAddCustomTechnology}
            disabled={!newTechnology.trim()}
            className="px-4 py-2"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Icon and Order */}
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
            placeholder="e.g., 💼 or company logo URL"
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

      {/* Visible checkbox */}
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
    </>
  );
};
