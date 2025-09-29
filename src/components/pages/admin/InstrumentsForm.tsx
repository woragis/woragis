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
    visible: true,
  });

  useEffect(() => {
    if (instrument) {
      setFormData({
        name: instrument.name || "",
        knowledgeLevel: instrument.knowledgeLevel || "beginner",
        learningStatus: instrument.learningStatus || "want_to_learn",
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

      <FormCheckbox
        name="visible"
        checked={formData.visible || true}
        onChange={handleInputChange}
        label="Visible to public"
      />
    </AdminForm>
  );
};
