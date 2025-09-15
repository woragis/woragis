"use client";

import React from "react";
import { ItemList } from "@/components/common";
import type { MusicGenre } from "@/types";

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
    description: item.description,
    image: undefined, // Genres don't have images
    status: undefined, // No status for genres
    visible: item.visible,
    featured: false, // Genres don't have featured field
    metadata: {
      order: item.order,
    },
  }));

  return (
    <ItemList
      items={items}
      onEdit={onEdit}
      onDelete={onDelete}
      onToggleVisibility={onToggleVisibility}
      isLoading={isLoading}
      emptyMessage="No music genres found"
    />
  );
};
