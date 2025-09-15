"use client";

import React from "react";
import { ItemList } from "@/components/common";
import type { Game } from "@/types";

interface GamesListProps {
  games: Game[];
  onEdit: (game: Game) => void;
  onDelete: (game: Game) => void;
  onToggleVisibility?: (game: Game) => void;
  isLoading?: boolean;
}

const getCategoryVariant = (category: string) => {
  switch (category) {
    case "current":
      return "info";
    case "childhood":
      return "warning";
    case "planned":
      return "default";
    default:
      return "default";
  }
};

export const GamesList: React.FC<GamesListProps> = ({
  games,
  onEdit,
  onDelete,
  onToggleVisibility,
  isLoading = false,
}) => {
  const items = games.map((item) => ({
    id: item.id,
    title: item.title,
    description: `${item.platform}${item.genre ? ` - ${item.genre}` : ""}${
      item.description ? ` - ${item.description}` : ""
    }`,
    image: item.coverImage,
    status: item.category
      ?.replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    statusVariant: getCategoryVariant(item.category || ""),
    visible: item.visible,
    featured: false, // Games doesn't have featured field
    metadata: {
      platform: item.platform,
      genre: item.genre,
      playtime: item.playtime,
      rating: item.rating,
      steamUrl: item.steamUrl,
    },
  }));

  return (
    <ItemList
      items={items}
      onEdit={onEdit}
      onDelete={onDelete}
      onToggleVisibility={onToggleVisibility}
      isLoading={isLoading}
      emptyMessage="No games found"
    />
  );
};
