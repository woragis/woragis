"use client";

import React from "react";
import Image from "next/image";
import {
  DataTable,
  DataTableRow,
  DataTableCell,
} from "@/components/ui";
import { ActionButton } from "@/components/ui/ActionButton";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface ListItem {
  id: string;
  title: string;
  description?: string;
  image?: string;
  status?: string;
  statusVariant?: "default" | "success" | "warning" | "error" | "info";
  visible?: boolean;
  featured?: boolean;
  metadata?: Record<string, any>;
}

interface ItemListProps {
  items: ListItem[];
  onEdit: (item: ListItem) => void;
  onDelete: (item: ListItem) => void;
  onToggleVisibility?: (item: ListItem) => void;
  onToggleFeatured?: (item: ListItem) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export const ItemList: React.FC<ItemListProps> = ({
  items,
  onEdit,
  onDelete,
  onToggleVisibility,
  onToggleFeatured,
  isLoading = false,
  emptyMessage = "No items found",
  className,
}) => {
  if (isLoading) {
    return (
      <DataTable className={className}>
        <DataTableRow>
          <DataTableCell>
            <div className="text-center py-12 animate-fade-in">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">
                Loading...
              </p>
            </div>
          </DataTableCell>
        </DataTableRow>
      </DataTable>
    );
  }

  if (items.length === 0) {
    return (
      <DataTable className={className}>
        <DataTableRow>
          <DataTableCell>
            <div className="text-center py-12 animate-fade-in">
              <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
            </div>
          </DataTableCell>
        </DataTableRow>
      </DataTable>
    );
  }

  return (
    <DataTable className={className}>
      {items.map((item, index) => (
        <DataTableRow key={item.id} className="animate-fade-in-up">
          <DataTableCell>
            <div className="flex items-center justify-between group">
              <div className="flex items-center">
                {item.image && (
                  <div className="flex-shrink-0">
                    <Image
                      className="h-10 w-10 rounded-lg object-cover transition-transform duration-200 group-hover:scale-105"
                      src={item.image}
                      alt={item.title}
                      width={40}
                      height={40}
                    />
                  </div>
                )}
                <div className={cn("ml-4", !item.image && "ml-0")}>
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200">
                      {item.title}
                    </h3>
                    {item.featured && (
                      <StatusBadge
                        status="Featured"
                        variant="warning"
                        className="ml-2 animate-pulse"
                      />
                    )}
                    {item.visible === false && (
                      <StatusBadge
                        status="Hidden"
                        variant="error"
                        className="ml-2"
                      />
                    )}
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">
                      {item.description}
                    </p>
                  )}
                  {item.status && (
                    <div className="mt-1">
                      <StatusBadge
                        status={item.status}
                        variant={item.statusVariant}
                        size="sm"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {onToggleVisibility && (
                  <ActionButton
                    variant="secondary"
                    size="sm"
                    onClick={() => onToggleVisibility(item)}
                    className={cn(
                      "transition-all duration-200 hover:scale-105",
                      item.visible
                        ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
                        : "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                    )}
                  >
                    {item.visible ? (
                      <Eye className="w-3 h-3" />
                    ) : (
                      <EyeOff className="w-3 h-3" />
                    )}
                  </ActionButton>
                )}
                {onToggleFeatured && (
                  <ActionButton
                    variant="secondary"
                    size="sm"
                    onClick={() => onToggleFeatured(item)}
                    className={cn(
                      "transition-all duration-200 hover:scale-105",
                      item.featured
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-800"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    )}
                  >
                    {item.featured ? "Featured" : "Not Featured"}
                  </ActionButton>
                )}
                <ActionButton
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit(item)}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-200 hover:scale-105"
                >
                  <Edit className="w-3 h-3" />
                </ActionButton>
                <ActionButton
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(item)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-all duration-200 hover:scale-105"
                >
                  <Trash2 className="w-3 h-3" />
                </ActionButton>
              </div>
            </div>
          </DataTableCell>
        </DataTableRow>
      ))}
    </DataTable>
  );
};
