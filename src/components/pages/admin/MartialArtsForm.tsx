"use client";

import React, { useState, useEffect } from "react";
import {
  AdminForm,
  FormField,
  FormInput,
  FormSelect,
  FormCheckbox,
} from "@/components/pages/admin";
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
    visible: true,
  });

  useEffect(() => {
    if (martialArt) {
      setFormData({
        name: martialArt.name || "",
        knowledgeLevel: martialArt.knowledgeLevel || "beginner",
        learningStatus: martialArt.learningStatus || "want_to_learn",
        grade: martialArt.grade || "",
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

      <FormCheckbox
        name="visible"
        checked={formData.visible || true}
        onChange={handleInputChange}
        label="Visible to public"
      />
    </AdminForm>
  );
};
