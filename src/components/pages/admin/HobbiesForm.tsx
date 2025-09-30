"use client";

import React, { useState, useEffect } from "react";
import {
  AdminForm,
  FormField,
  FormInput,
  FormTextarea,
  FormCheckbox,
} from "@/components/pages/admin";
import { AIAboutGenerator } from "@/components/ui/ai/AIAboutGenerator";
import { Button } from "@/components/ui/layout/Button";
import { Sparkles } from "lucide-react";
import type { Hobby, NewHobby } from "@/types/about/hobbies";

interface HobbiesFormProps {
  hobby?: Hobby;
  userId: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading?: boolean;
  onFormDataChange?: (data: any) => void;
}

export const HobbiesForm: React.FC<HobbiesFormProps> = ({
  hobby,
  userId,
  onSubmit,
  onCancel,
  isLoading = false,
  onFormDataChange,
}) => {
  const [formData, setFormData] = useState<Partial<NewHobby>>({
    name: "",
    description: "",
    visible: true,
  });
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  useEffect(() => {
    if (hobby) {
      setFormData({
        name: hobby.name || "",
        description: hobby.description || "",
        visible: hobby.visible || true,
      });
    }
  }, [hobby]);

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

  // Notify parent of form data changes
  useEffect(() => {
    if (onFormDataChange) {
      onFormDataChange({
        ...formData,
        userId,
      });
    }
  }, [formData, userId, onFormDataChange]);

  const handleAIContentGenerated = (content: string, type: 'text' | 'image') => {
    if (type === 'text') {
      setFormData(prev => ({
        ...prev,
        description: content,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <AdminForm
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitLabel={hobby ? "Update Hobby" : "Create Hobby"}
      isLoading={isLoading}
    >
      <FormField label="Hobby Name" required>
        <FormInput
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          placeholder="e.g., Photography, Cooking, Gardening"
          required
        />
      </FormField>

      <FormField label="Description">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </span>
            <Button
              type="button"
              onClick={() => setShowAIGenerator(!showAIGenerator)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {showAIGenerator ? 'Hide AI' : 'AI Generator'}
            </Button>
          </div>
          
          {showAIGenerator && (
            <div className="mb-4">
              <AIAboutGenerator
                category="hobbies"
                onContentGenerated={handleAIContentGenerated}
                currentInfo={formData.name || ''}
                itemId={hobby?.id}
              />
            </div>
          )}
          
          <FormTextarea
            name="description"
            value={formData.description || ""}
            onChange={handleInputChange}
            placeholder="Tell us more about this hobby..."
            rows={3}
          />
        </div>
      </FormField>

      <FormCheckbox
        name="visible"
        checked={formData.visible || true}
        onChange={handleInputChange}
        label="Visible to public"
      />
    </AdminForm>
  );
};
