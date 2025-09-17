"use client";

import React from "react";
import { ItemList } from "@/components/common";
import type { MusicGenre } from "@/types";

// Import ListItem type from ItemList component
type ListItem = Parameters<typeof ItemList>[0]["items"][0];

interface MusicGenresListProps {
  genres: MusicGenre[];
  onEdit: (genre: MusicGenre) => void;
  onDelete: (genre: MusicGenre) => void;
  onToggleVisibility?: (genre: MusicGenre) => void;
  isLoading?: boolean;
}

export const MusicGenresList: React.FC<MusicGenresListProps> = ({
  genres,
  onEdit,
  onDelete,
  onToggleVisibility,
  isLoading = false,
}) => {
  const items = genres.map((item) => ({
    id: item.id,
    title: item.name,
    description: item.description || undefined,
    image: undefined, // Genres don't have images
    status: undefined, // No status for genres
    visible: item.visible ?? undefined,
    featured: false, // Genres don't have featured field
    metadata: {
      order: item.order,
    },
  }));

  // Create a mapping from item ID back to genre object
  const genresMap = new Map(genres.map((item) => [item.id, item]));

  const handleEdit = (listItem: ListItem) => {
    const genreItem = genresMap.get(listItem.id);
    if (genreItem) {
      onEdit(genreItem);
    }
  };

  const handleDelete = (listItem: ListItem) => {
    const genreItem = genresMap.get(listItem.id);
    if (genreItem) {
      onDelete(genreItem);
    }
  };

  const handleToggleVisibility = (listItem: ListItem) => {
    if (onToggleVisibility) {
      const genreItem = genresMap.get(listItem.id);
      if (genreItem) {
        onToggleVisibility(genreItem);
      }
    }
  };

  return (
    <ItemList
      items={items}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onToggleVisibility={handleToggleVisibility}
      isLoading={isLoading}
      emptyMessage="No music genres found"
    />
  );
};
