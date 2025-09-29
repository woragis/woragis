"use client";

import React, { useState, useEffect } from "react";
import {
  AdminForm,
  FormField,
  FormInput,
  FormTextarea,
  FormCheckbox,
} from "@/components/pages/admin";
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
        <FormTextarea
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          placeholder="Tell us more about this hobby..."
          rows={3}
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
