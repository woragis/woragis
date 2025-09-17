"use client";

import React from "react";
import { ItemList } from "@/components/common";
import type { PoliticalView } from "@/types";

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

  return (
    <ItemList
      items={items}
      onEdit={onEdit}
      onDelete={onDelete}
      onToggleVisibility={onToggleVisibility}
      isLoading={isLoading}
      emptyMessage="No political views found"
    />
  );
};
