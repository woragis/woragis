"use client";

import React, { useState, useEffect } from "react";
import { useExperience } from "@/hooks/useExperience";
import {
  AdminForm,
  FormField,
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckbox,
} from "@/components/pages/admin";
import type { AboutCore, NewAboutCore } from "@/types";

interface AboutCoreFormProps {
  aboutCore?: AboutCore;
  onSubmit: (aboutCore: NewAboutCore) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AboutCoreForm: React.FC<AboutCoreFormProps> = ({
  aboutCore,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    currentProfessionId: "",
    biography: "",
    featuredBiography: "",
    visible: true,
  });

  const { data: experiences = [] } = useExperience();

  useEffect(() => {
    if (aboutCore) {
      setFormData({
        name: aboutCore.name || "",
        currentProfessionId: aboutCore.currentProfessionId || "",
        biography: aboutCore.biography || "",
        featuredBiography: aboutCore.featuredBiography || "",
        visible: aboutCore.visible || true,
      });
    }
  }, [aboutCore]);

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
    onSubmit(formData);
  };

  const experienceOptions = experiences.map((experience) => ({
    value: experience.id,
    label: `${experience.title} at ${experience.company}`,
  }));

  return (
    <AdminForm
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitLabel={aboutCore ? "Update About" : "Create About"}
      isLoading={isLoading}
    >
      <FormField label="Name" required>
        <FormInput
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </FormField>

      <FormField
        label="Current Profession"
        description="Select your current profession from your experience entries"
      >
        <FormSelect
          name="currentProfessionId"
          value={formData.currentProfessionId}
          onChange={handleInputChange}
          options={experienceOptions}
          placeholder="Select a profession"
        />
      </FormField>

      <FormField
        label="Biography"
        description="A brief description about yourself"
      >
        <FormTextarea
          name="biography"
          value={formData.biography}
          onChange={handleInputChange}
          placeholder="Tell us about yourself..."
          rows={5}
        />
      </FormField>

      <FormField
        label="Featured Biography"
        description="A shorter, highlighted version of your biography for featured sections"
      >
        <FormTextarea
          name="featuredBiography"
          value={formData.featuredBiography}
          onChange={handleInputChange}
          placeholder="A highlighted version of your biography for featured sections..."
          rows={3}
        />
      </FormField>

      <FormCheckbox
        name="visible"
        checked={formData.visible}
        onChange={handleInputChange}
        label="Visible to public"
      />
    </AdminForm>
  );
};
