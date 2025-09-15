"use client";

import React from "react";
import { ItemList } from "@/components/common";
import type { Anime } from "@/types";

interface AnimeListProps {
  anime: Anime[];
  onEdit: (anime: Anime) => void;
  onDelete: (anime: Anime) => void;
  onToggleVisibility?: (anime: Anime) => void;
  isLoading?: boolean;
}

const getStatusVariant = (status: string) => {
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
    description: item.description,
    image: item.coverImage,
    status: item.status
      ?.replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    statusVariant: getStatusVariant(item.status || ""),
    visible: item.visible,
    featured: false, // Anime doesn't have featured field
    metadata: {
      episodes: item.episodes,
      currentEpisode: item.currentEpisode,
      rating: item.rating,
      genres: item.genres,
    },
  }));

  return (
    <ItemList
      items={items}
      onEdit={onEdit}
      onDelete={onDelete}
      onToggleVisibility={onToggleVisibility}
      isLoading={isLoading}
      emptyMessage="No anime found"
    />
  );
};
