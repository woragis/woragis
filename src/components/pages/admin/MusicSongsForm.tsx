"use client";

import React, { useState, useEffect } from "react";
import {
  AdminForm,
  FormField,
  FormInput,
  FormCheckbox,
} from "@/components/pages/admin";
import type { LastListenedSong, NewLastListenedSong } from "@/types";

interface MusicSongsFormProps {
  song?: LastListenedSong;
  onSubmit: (song: NewLastListenedSong) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const MusicSongsForm: React.FC<MusicSongsFormProps> = ({
  song,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<NewLastListenedSong>>({
    title: "",
    artist: "",
    album: "",
    spotifyUrl: "",
    youtubeUrl: "",
    order: 0,
    visible: true,
  });

  useEffect(() => {
    if (song) {
      setFormData({
        title: song.title || "",
        artist: song.artist || "",
        album: song.album || "",
        spotifyUrl: song.spotifyUrl || "",
        youtubeUrl: song.youtubeUrl || "",
        order: song.order || 0,
        visible: song.visible || true,
      });
    }
  }, [song]);

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
    onSubmit(formData as NewLastListenedSong);
  };

  return (
    <AdminForm
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitLabel={song ? "Update Song" : "Create Song"}
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

      <FormField label="Artist" required>
        <FormInput
          name="artist"
          value={formData.artist || ""}
          onChange={handleInputChange}
          required
        />
      </FormField>

      <FormField label="Album">
        <FormInput
          name="album"
          value={formData.album || ""}
          onChange={handleInputChange}
        />
      </FormField>

      <FormField label="Spotify URL">
        <FormInput
          type="url"
          name="spotifyUrl"
          value={formData.spotifyUrl || ""}
          onChange={handleInputChange}
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
