"use client";

import React, { useState, useEffect } from "react";
import {
  AdminForm,
  FormField,
  FormInput,
  FormSelect,
  FormCheckbox,
  FormTextarea,
} from "@/components/pages/admin";
import { AIAboutGenerator } from "@/components/ui/ai/AIAboutGenerator";
import { Button } from "@/components/ui/layout/Button";
import { Sparkles } from "lucide-react";
import type {
  MartialArt,
  NewMartialArt,
  KnowledgeLevel,
} from "@/types/about/martial-arts";

interface MartialArtsFormProps {
  martialArt?: MartialArt;
  userId: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading?: boolean;
  onFormDataChange?: (data: any) => void;
}

const knowledgeLevelOptions: { value: KnowledgeLevel; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
];

export const MartialArtsForm: React.FC<MartialArtsFormProps> = ({
  martialArt,
  userId,
  onSubmit,
  onCancel,
  isLoading = false,
  onFormDataChange,
}) => {
  const [formData, setFormData] = useState<Partial<NewMartialArt>>({
    name: "",
    knowledgeLevel: "beginner",
    learningStatus: "want_to_learn",
    grade: "",
    description: "",
    visible: true,
  });
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  useEffect(() => {
    if (martialArt) {
      setFormData({
        name: martialArt.name || "",
        knowledgeLevel: martialArt.knowledgeLevel || "beginner",
        learningStatus: martialArt.learningStatus || "want_to_learn",
        grade: martialArt.grade || "",
        description: martialArt.description || "",
        visible: martialArt.visible || true,
      });
    }
  }, [martialArt]);

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
      submitLabel={martialArt ? "Update Martial Art" : "Create Martial Art"}
      isLoading={isLoading}
    >
      <FormField label="Martial Art Name" required>
        <FormInput
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          placeholder="e.g., Karate, Taekwondo, Judo"
          required
        />
      </FormField>

      <FormField label="Knowledge Level" required>
        <FormSelect
          name="knowledgeLevel"
          value={formData.knowledgeLevel || "beginner"}
          onChange={handleInputChange}
          options={knowledgeLevelOptions}
          required
        />
      </FormField>

      <FormField label="Grade/Belt (Optional)">
        <FormInput
          name="grade"
          value={formData.grade || ""}
          onChange={handleInputChange}
          placeholder="e.g., Black Belt, 1st Dan, Blue Belt"
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
                category="martial-arts"
                onContentGenerated={handleAIContentGenerated}
                currentInfo={formData.name || ''}
                itemId={martialArt?.id}
              />
            </div>
          )}
          
          <FormTextarea
            name="description"
            value={formData.description || ""}
            onChange={handleInputChange}
            placeholder="Describe your experience with this martial art, what you've learned, or your goals..."
            rows={4}
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
