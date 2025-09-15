"use client";

import React, { useState, useEffect } from "react";
import {
  AdminForm,
  FormField,
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckbox,
} from "@/components/pages/admin";
import type { Youtuber, NewYoutuber, YoutuberCategory } from "@/types";

interface YouTubersFormProps {
  youTuber?: Youtuber;
  onSubmit: (youTuber: NewYoutuber) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const categoryOptions: { value: YoutuberCategory; label: string }[] = [
  { value: "current", label: "Current" },
  { value: "childhood", label: "Childhood" },
];

export const YouTubersForm: React.FC<YouTubersFormProps> = ({
  youTuber,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<NewYoutuber>>({
    channelName: "",
    description: "",
    category: "current",
    youtubeUrl: "",
    profilePicture: "",
    subscriberCount: 0,
    contentType: "",
    notes: "",
    order: 0,
    visible: true,
  });

  useEffect(() => {
    if (youTuber) {
      setFormData({
        channelName: youTuber.channelName || "",
        description: youTuber.description || "",
        category: youTuber.category || "current",
        youtubeUrl: youTuber.youtubeUrl || "",
        profilePicture: youTuber.profilePicture || "",
        subscriberCount: youTuber.subscriberCount || 0,
        contentType: youTuber.contentType || "",
        notes: youTuber.notes || "",
        order: youTuber.order || 0,
        visible: youTuber.visible || true,
      });
    }
  }, [youTuber]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as NewYoutuber);
  };

  return (
    <AdminForm
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitLabel={youTuber ? "Update YouTuber" : "Create YouTuber"}
      isLoading={isLoading}
    >
      <FormField label="Channel Name" required>
        <FormInput
          name="channelName"
          value={formData.channelName || ""}
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

      <FormField label="Category" required>
        <FormSelect
          name="category"
          value={formData.category || "current"}
          onChange={handleInputChange}
          options={categoryOptions}
          required
        />
      </FormField>

      <FormField label="YouTube URL">
        <FormInput
          type="url"
          name="youtubeUrl"
          value={formData.youtubeUrl || ""}
          onChange={handleInputChange}
        />
      </FormField>

      <FormField label="Profile Picture URL">
        <FormInput
          type="url"
          name="profilePicture"
          value={formData.profilePicture || ""}
          onChange={handleInputChange}
        />
      </FormField>

      <FormField label="Subscriber Count">
        <FormInput
          type="number"
          name="subscriberCount"
          value={formData.subscriberCount || 0}
          onChange={handleInputChange}
          min="0"
        />
      </FormField>

      <FormField label="Content Type">
        <FormInput
          name="contentType"
          value={formData.contentType || ""}
          onChange={handleInputChange}
          placeholder="Gaming, Tech, Comedy, Education..."
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
          min="0"
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
