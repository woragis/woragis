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
  Instrument,
  NewInstrument,
  KnowledgeLevel,
} from "@/types/about/instruments";

interface InstrumentsFormProps {
  instrument?: Instrument;
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

export const InstrumentsForm: React.FC<InstrumentsFormProps> = ({
  instrument,
  userId,
  onSubmit,
  onCancel,
  isLoading = false,
  onFormDataChange,
}) => {
  const [formData, setFormData] = useState<Partial<NewInstrument>>({
    name: "",
    knowledgeLevel: "beginner",
    learningStatus: "want_to_learn",
    description: "",
    visible: true,
  });
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  useEffect(() => {
    if (instrument) {
      setFormData({
        name: instrument.name || "",
        knowledgeLevel: instrument.knowledgeLevel || "beginner",
        learningStatus: instrument.learningStatus || "want_to_learn",
        description: instrument.description || "",
        visible: instrument.visible || true,
      });
    }
  }, [instrument]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  const handleAIContentGenerated = (content: string, type: 'text' | 'image') => {
    if (type === 'text') {
      setFormData(prev => ({
        ...prev,
        description: content,
      }));
    }
  };

  return (
    <AdminForm
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitLabel={instrument ? "Update Instrument" : "Create Instrument"}
      isLoading={isLoading}
    >
      <FormField label="Instrument Name" required>
        <FormInput
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          placeholder="e.g., Guitar, Piano, Violin"
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
                category="instruments"
                onContentGenerated={handleAIContentGenerated}
                currentInfo={formData.name || ''}
                itemId={instrument?.id}
              />
            </div>
          )}
          
          <FormTextarea
            name="description"
            value={formData.description || ""}
            onChange={handleInputChange}
            placeholder="Describe your experience with this instrument, what you've learned, or your goals..."
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
