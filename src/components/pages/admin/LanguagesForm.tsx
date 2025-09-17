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
  Language,
  NewLanguage,
  Proficiency,
} from "@/types/about/languages";

interface LanguagesFormProps {
  language?: Language;
  onSubmit: (language: NewLanguage) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const proficiencyOptions: { value: Proficiency; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "native", label: "Native" },
];

export const LanguagesForm: React.FC<LanguagesFormProps> = ({
  language,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<NewLanguage>>({
    name: "",
    proficiencyLevel: "beginner",
    learningStatus: "want_to_learn",
    visible: true,
  });

  useEffect(() => {
    if (language) {
      setFormData({
        name: language.name || "",
        proficiencyLevel: language.proficiencyLevel || "beginner",
        learningStatus: language.learningStatus || "want_to_learn",
        visible: language.visible || true,
      });
    }
  }, [language]);

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
    onSubmit(formData as NewLanguage);
  };

  return (
    <AdminForm
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitLabel={language ? "Update Language" : "Create Language"}
      isLoading={isLoading}
    >
      <FormField label="Language Name" required>
        <FormInput
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          placeholder="e.g., French, Spanish, Japanese"
          required
        />
      </FormField>

      <FormField label="Proficiency Level" required>
        <FormSelect
          name="proficiencyLevel"
          value={formData.proficiencyLevel || "beginner"}
          onChange={handleInputChange}
          options={proficiencyOptions}
          required
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
