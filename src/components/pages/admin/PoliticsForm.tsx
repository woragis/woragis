"use client";

import React, { useState, useEffect } from "react";
import {
  AdminForm,
  FormField,
  FormInput,
  FormTextarea,
  FormCheckbox,
} from "@/components/pages/admin";
import type { PoliticalView, NewPoliticalView } from "@/types";

interface PoliticsFormProps {
  politicalView?: PoliticalView;
  userId: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading?: boolean;
  onFormDataChange?: (data: any) => void;
}

export const PoliticsForm: React.FC<PoliticsFormProps> = ({
  politicalView,
  userId,
  onSubmit,
  onCancel,
  isLoading = false,
  onFormDataChange,
}) => {
  const [formData, setFormData] = useState<Partial<NewPoliticalView>>({
    personName: "",
    description: "",
    website: "",
    socialMedia: "",
    picture: "",
    politicalParty: "",
    position: "",
    notes: "",
    order: 0,
    visible: true,
  });

  useEffect(() => {
    if (politicalView) {
      setFormData({
        personName: politicalView.personName || "",
        description: politicalView.description || "",
        website: politicalView.website || "",
        socialMedia: politicalView.socialMedia || "",
        picture: politicalView.picture || "",
        politicalParty: politicalView.politicalParty || "",
        position: politicalView.position || "",
        notes: politicalView.notes || "",
        order: politicalView.order || 0,
        visible: politicalView.visible || true,
      });
    }
  }, [politicalView]);

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
      submitLabel={
        politicalView ? "Update Political View" : "Create Political View"
      }
      isLoading={isLoading}
    >
      <FormField label="Person Name" required>
        <FormInput
          name="personName"
          value={formData.personName || ""}
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

      <FormField label="Political Party">
        <FormInput
          name="politicalParty"
          value={formData.politicalParty || ""}
          onChange={handleInputChange}
          placeholder="Democratic, Republican, Independent..."
        />
      </FormField>

      <FormField label="Position">
        <FormInput
          name="position"
          value={formData.position || ""}
          onChange={handleInputChange}
          placeholder="President, Senator, Governor..."
        />
      </FormField>

      <FormField label="Website URL">
        <FormInput
          type="url"
          name="website"
          value={formData.website || ""}
          onChange={handleInputChange}
        />
      </FormField>

      <FormField label="Social Media">
        <FormInput
          name="socialMedia"
          value={formData.socialMedia || ""}
          onChange={handleInputChange}
          placeholder="Twitter, Instagram, Facebook handles..."
        />
      </FormField>

      <FormField label="Picture URL">
        <FormInput
          type="url"
          name="picture"
          value={formData.picture || ""}
          onChange={handleInputChange}
        />
      </FormField>

      <FormField label="Notes">
        <FormTextarea
          name="notes"
          value={formData.notes || ""}
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
