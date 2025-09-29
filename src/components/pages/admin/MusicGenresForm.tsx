"use client";

import React, { useState, useEffect } from "react";
import {
  AdminForm,
  FormField,
  FormInput,
  FormTextarea,
  FormCheckbox,
} from "@/components/pages/admin";
import type { MusicGenre, NewMusicGenre } from "@/types";

interface MusicGenresFormProps {
  genre?: MusicGenre;
  userId: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading?: boolean;
  onFormDataChange?: (data: any) => void;
}

export const MusicGenresForm: React.FC<MusicGenresFormProps> = ({
  genre,
  userId,
  onSubmit,
  onCancel,
  isLoading = false,
  onFormDataChange,
}) => {
  const [formData, setFormData] = useState<Partial<NewMusicGenre>>({
    name: "",
    description: "",
    order: 0,
    visible: true,
  });

  useEffect(() => {
    if (genre) {
      setFormData({
        name: genre.name || "",
        description: genre.description || "",
        order: genre.order || 0,
        visible: genre.visible || true,
      });
    }
  }, [genre]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? Number(value)
          : value,
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
      submitLabel={genre ? "Update Genre" : "Create Genre"}
      isLoading={isLoading}
    >
      <FormField label="Name" required>
        <FormInput
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          required
        />
      </FormField>

      <FormField label="Description">
        <FormTextarea
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          rows={3}
        />
      </FormField>

      <FormField label="Display Order">
        <FormInput
          type="number"
          name="order"
          value={formData.order || 0}
          onChange={handleInputChange}
          min={0}
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
