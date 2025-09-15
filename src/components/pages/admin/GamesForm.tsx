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
import type { Game, NewGame, GameCategory } from "@/types";

interface GamesFormProps {
  game?: Game;
  onSubmit: (game: NewGame) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const categoryOptions: { value: GameCategory; label: string }[] = [
  { value: "childhood", label: "Childhood" },
  { value: "current", label: "Current" },
  { value: "planned", label: "Planned" },
];

export const GamesForm: React.FC<GamesFormProps> = ({
  game,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<NewGame>>({
    title: "",
    description: "",
    category: "current",
    platform: "",
    genre: "",
    coverImage: "",
    steamUrl: "",
    playtime: 0,
    rating: 0,
    notes: "",
    order: 0,
    visible: true,
  });

  useEffect(() => {
    if (game) {
      setFormData({
        title: game.title || "",
        description: game.description || "",
        category: game.category || "current",
        platform: game.platform || "",
        genre: game.genre || "",
        coverImage: game.coverImage || "",
        steamUrl: game.steamUrl || "",
        playtime: game.playtime || 0,
        rating: game.rating || 0,
        notes: game.notes || "",
        order: game.order || 0,
        visible: game.visible || true,
      });
    }
  }, [game]);

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
    onSubmit(formData as NewGame);
  };

  return (
    <AdminForm
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitLabel={game ? "Update Game" : "Create Game"}
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

      <FormField label="Category" required>
        <FormSelect
          name="category"
          value={formData.category || "current"}
          onChange={handleInputChange}
          options={categoryOptions}
          required
        />
      </FormField>

      <FormField label="Platform">
        <FormInput
          name="platform"
          value={formData.platform || ""}
          onChange={handleInputChange}
          placeholder="PC, PlayStation, Xbox, Nintendo Switch..."
        />
      </FormField>

      <FormField label="Genre">
        <FormInput
          name="genre"
          value={formData.genre || ""}
          onChange={handleInputChange}
          placeholder="RPG, FPS, Strategy, Adventure..."
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

      <FormField label="Steam URL">
        <FormInput
          type="url"
          name="steamUrl"
          value={formData.steamUrl || ""}
          onChange={handleInputChange}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Playtime (hours)">
          <FormInput
            type="number"
            name="playtime"
            value={formData.playtime || 0}
            onChange={handleInputChange}
            min="0"
          />
        </FormField>

        <FormField label="Rating (1-10)">
          <FormInput
            type="number"
            name="rating"
            value={formData.rating || 0}
            onChange={handleInputChange}
            min="0"
            max="10"
          />
        </FormField>
      </div>

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
