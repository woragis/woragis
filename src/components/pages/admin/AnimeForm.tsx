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
import type { Anime, NewAnime, AnimeStatus } from "@/types";

interface AnimeFormProps {
  anime?: Anime;
  userId: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading?: boolean;
  onFormDataChange?: (data: any) => void;
}

const statusOptions: { value: AnimeStatus; label: string }[] = [
  { value: "want_to_watch", label: "Want to Watch" },
  { value: "watching", label: "Watching" },
  { value: "completed", label: "Completed" },
  { value: "dropped", label: "Dropped" },
  { value: "on_hold", label: "On Hold" },
];

export const AnimeForm: React.FC<AnimeFormProps> = ({
  anime,
  userId,
  onSubmit,
  onCancel,
  isLoading = false,
  onFormDataChange,
}) => {
  const [formData, setFormData] = useState<Partial<NewAnime>>({
    title: "",
    description: "",
    status: "want_to_watch",
    myAnimeListId: "",
    coverImage: "",
    genres: "",
    episodes: 0,
    currentEpisode: 0,
    rating: 0,
    notes: "",
    order: 0,
    visible: true,
  });

  useEffect(() => {
    if (anime) {
      setFormData({
        title: anime.title || "",
        description: anime.description || "",
        status: anime.status || "want_to_watch",
        myAnimeListId: anime.myAnimeListId || "",
        coverImage: anime.coverImage || "",
        genres: anime.genres || "",
        episodes: anime.episodes || 0,
        currentEpisode: anime.currentEpisode || 0,
        rating: anime.rating || 0,
        notes: anime.notes || "",
        order: anime.order || 0,
        visible: anime.visible || true,
      });
    }
  }, [anime]);

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
      submitLabel={anime ? "Update Anime" : "Create Anime"}
      isLoading={isLoading}
    >
      <FormField label="Title" required>
        <FormInput
          name="title"
          value={formData.title || ""}
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

      <FormField label="Status" required>
        <FormSelect
          name="status"
          value={formData.status || "want_to_watch"}
          onChange={handleInputChange}
          options={statusOptions}
          required
        />
      </FormField>

      <FormField label="MyAnimeList ID">
        <FormInput
          name="myAnimeListId"
          value={formData.myAnimeListId || ""}
          onChange={handleInputChange}
        />
      </FormField>

      <FormField label="Cover Image URL">
        <FormInput
          type="url"
          name="coverImage"
          value={formData.coverImage || ""}
          onChange={handleInputChange}
        />
      </FormField>

      <FormField label="Genres">
        <FormInput
          name="genres"
          value={formData.genres || ""}
          onChange={handleInputChange}
          placeholder="Action, Adventure, Comedy..."
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Total Episodes">
          <FormInput
            type="number"
            name="episodes"
            value={formData.episodes || 0}
            onChange={handleInputChange}
            min={0}
          />
        </FormField>

        <FormField label="Current Episode">
          <FormInput
            type="number"
            name="currentEpisode"
            value={formData.currentEpisode || 0}
            onChange={handleInputChange}
            min={0}
          />
        </FormField>
      </div>

      <FormField label="Rating (1-10)">
        <FormInput
          type="number"
          name="rating"
          value={formData.rating || 0}
          onChange={handleInputChange}
          min={0}
          max={10}
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
