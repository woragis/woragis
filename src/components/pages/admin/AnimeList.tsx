"use client";

import React from "react";
import { ItemList } from "@/components/common";
import type { Anime } from "@/types";

// Import ListItem type from ItemList component
type ListItem = Parameters<typeof ItemList>[0]["items"][0];

interface AnimeListProps {
  anime: Anime[];
  onEdit: (anime: Anime) => void;
  onDelete: (anime: Anime) => void;
  onToggleVisibility?: (anime: Anime) => void;
  isLoading?: boolean;
}

const getStatusVariant = (
  status: string
): "default" | "success" | "warning" | "error" | "info" => {
  switch (status) {
    case "completed":
      return "success";
    case "watching":
      return "info";
    case "want_to_watch":
      return "default";
    case "dropped":
      return "error";
    case "on_hold":
      return "warning";
    default:
      return "default";
  }
};

export const AnimeList: React.FC<AnimeListProps> = ({
  anime,
  onEdit,
  onDelete,
  onToggleVisibility,
  isLoading = false,
}) => {
  const items = anime.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description || undefined,
    image: item.coverImage || undefined,
    status: item.status
      ?.replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    statusVariant: getStatusVariant(item.status || ""),
    visible: item.visible ?? undefined,
    featured: false, // Anime doesn't have featured field
    metadata: {
      episodes: item.episodes,
      currentEpisode: item.currentEpisode,
      rating: item.rating,
      genres: item.genres,
    },
  }));

  // Create a mapping from item ID back to anime object
  const animeMap = new Map(anime.map((item) => [item.id, item]));

  const handleEdit = (listItem: ListItem) => {
    const animeItem = animeMap.get(listItem.id);
    if (animeItem) {
      onEdit(animeItem);
    }
  };

  const handleDelete = (listItem: ListItem) => {
    const animeItem = animeMap.get(listItem.id);
    if (animeItem) {
      onDelete(animeItem);
    }
  };

  const handleToggleVisibility = (listItem: ListItem) => {
    if (onToggleVisibility) {
      const animeItem = animeMap.get(listItem.id);
      if (animeItem) {
        onToggleVisibility(animeItem);
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
      emptyMessage="No anime found"
    />
  );
};
