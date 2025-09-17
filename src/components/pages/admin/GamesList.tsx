"use client";

import React from "react";
import { ItemList } from "@/components/common";
import type { Game } from "@/types";

// Import ListItem type from ItemList component
type ListItem = Parameters<typeof ItemList>[0]["items"][0];

interface GamesListProps {
  games: Game[];
  onEdit: (game: Game) => void;
  onDelete: (game: Game) => void;
  onToggleVisibility?: (game: Game) => void;
  isLoading?: boolean;
}

const getCategoryVariant = (
  category: string
): "default" | "success" | "warning" | "error" | "info" => {
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
    image: item.coverImage || undefined,
    status: item.category
      ?.replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    statusVariant: getCategoryVariant(item.category || ""),
    visible: item.visible ?? undefined,
    featured: false, // Games doesn't have featured field
    metadata: {
      platform: item.platform,
      genre: item.genre,
      playtime: item.playtime,
      rating: item.rating,
      steamUrl: item.steamUrl,
    },
  }));

  // Create a mapping from item ID back to game object
  const gamesMap = new Map(games.map((item) => [item.id, item]));

  const handleEdit = (listItem: ListItem) => {
    const gameItem = gamesMap.get(listItem.id);
    if (gameItem) {
      onEdit(gameItem);
    }
  };

  const handleDelete = (listItem: ListItem) => {
    const gameItem = gamesMap.get(listItem.id);
    if (gameItem) {
      onDelete(gameItem);
    }
  };

  const handleToggleVisibility = (listItem: ListItem) => {
    if (onToggleVisibility) {
      const gameItem = gamesMap.get(listItem.id);
      if (gameItem) {
        onToggleVisibility(gameItem);
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
      emptyMessage="No games found"
    />
  );
};
