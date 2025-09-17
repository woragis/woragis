"use client";

import React from "react";
import { ItemList } from "@/components/common";
import type { PoliticalView } from "@/types";

// Import ListItem type from ItemList component
type ListItem = Parameters<typeof ItemList>[0]["items"][0];

interface PoliticsListProps {
  politicalViews: PoliticalView[];
  onEdit: (politicalView: PoliticalView) => void;
  onDelete: (politicalView: PoliticalView) => void;
  onToggleVisibility?: (politicalView: PoliticalView) => void;
  isLoading?: boolean;
}

export const PoliticsList: React.FC<PoliticsListProps> = ({
  politicalViews,
  onEdit,
  onDelete,
  onToggleVisibility,
  isLoading = false,
}) => {
  const items = politicalViews.map((item) => ({
    id: item.id,
    title: item.personName,
    description: `${item.politicalParty}${
      item.position ? ` - ${item.position}` : ""
    }${item.description ? ` - ${item.description}` : ""}`,
    image: item.picture ?? undefined,
    status: item.politicalParty ?? undefined,
    statusVariant: "info" as const,
    visible: item.visible ?? undefined,
    featured: false, // Politics doesn't have featured field
    metadata: {
      position: item.position ?? undefined,
      website: item.website ?? undefined,
      socialMedia: item.socialMedia ?? undefined,
    },
  }));

  // Create a mapping from item ID back to political view object
  const politicalViewsMap = new Map(politicalViews.map((item) => [item.id, item]));

  const handleEdit = (listItem: ListItem) => {
    const politicalView = politicalViewsMap.get(listItem.id);
    if (politicalView) {
      onEdit(politicalView);
    }
  };

  const handleDelete = (listItem: ListItem) => {
    const politicalView = politicalViewsMap.get(listItem.id);
    if (politicalView) {
      onDelete(politicalView);
    }
  };

  const handleToggleVisibility = (listItem: ListItem) => {
    if (onToggleVisibility) {
      const politicalView = politicalViewsMap.get(listItem.id);
      if (politicalView) {
        onToggleVisibility(politicalView);
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
      emptyMessage="No political views found"
    />
  );
};
