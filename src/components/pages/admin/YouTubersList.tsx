"use client";

import React from "react";
import { ItemList } from "@/components/common";
import type { Youtuber } from "@/types";

interface YouTubersListProps {
  youTubers: Youtuber[];
  onEdit: (youTuber: Youtuber) => void;
  onDelete: (youTuber: Youtuber) => void;
  onToggleVisibility?: (youTuber: Youtuber) => void;
  isLoading?: boolean;
}

const getCategoryVariant = (category: string) => {
  switch (category) {
    case "current":
      return "info";
    case "childhood":
      return "warning";
    default:
      return "default";
  }
};

export const YouTubersList: React.FC<YouTubersListProps> = ({
  youTubers,
  onEdit,
  onDelete,
  onToggleVisibility,
  isLoading = false,
}) => {
  const items = youTubers.map((item) => ({
    id: item.id,
    title: item.channelName,
    description: `${item.contentType}${
      item.description ? ` - ${item.description}` : ""
    }${
      item.subscriberCount
        ? ` - ${item.subscriberCount.toLocaleString()} subscribers`
        : ""
    }`,
    image: item.profilePicture,
    status: item.category
      ?.replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    statusVariant: getCategoryVariant(item.category || ""),
    visible: item.visible,
    featured: false, // YouTubers doesn't have featured field
    metadata: {
      contentType: item.contentType,
      subscriberCount: item.subscriberCount,
      youtubeUrl: item.youtubeUrl,
    },
  }));

  return (
    <ItemList
      items={items}
      onEdit={onEdit}
      onDelete={onDelete}
      onToggleVisibility={onToggleVisibility}
      isLoading={isLoading}
      emptyMessage="No YouTubers found"
    />
  );
};
