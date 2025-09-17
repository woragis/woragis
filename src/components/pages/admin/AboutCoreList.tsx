"use client";

import React from "react";
import { UserCircle } from "lucide-react";
import { ItemList } from "@/components/common";
import type { AboutCore } from "@/types";

interface AboutCoreListProps {
  aboutCore: AboutCore | null;
  onEdit: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
  isLoading?: boolean;
}

export const AboutCoreList: React.FC<AboutCoreListProps> = ({
  aboutCore,
  onEdit,
  onDelete,
  onToggleVisibility,
  isLoading = false,
}) => {
  if (!aboutCore && !isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <div className="px-6 py-12 text-center">
          <UserCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No About Information
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You haven&apos;t set up your about information yet. Create your profile
            to get started.
          </p>
        </div>
      </div>
    );
  }

  const items = aboutCore
    ? [
        {
          id: aboutCore.id,
          title: aboutCore.name,
          description: aboutCore.biography || "No biography set",
          image: undefined, // No image for about core
          status: aboutCore.currentProfessionId
            ? `Profession: ${aboutCore.currentProfessionId}`
            : undefined,
          visible: aboutCore.visible,
          featured: !!aboutCore.featuredBiography,
        },
      ]
    : [];

  return (
    <ItemList
      items={items}
      onEdit={() => onEdit()}
      onDelete={() => onDelete()}
      onToggleVisibility={() => onToggleVisibility()}
      isLoading={isLoading}
      emptyMessage="No about information found"
    />
  );
};
