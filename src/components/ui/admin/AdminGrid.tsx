"use client";

import React from "react";
// Updated AdminGrid component with icon support
import Image from "next/image";
import { Card, Button } from "../layout";

export interface AdminGridItem {
  id: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  badges?: Array<{
    label: string;
    variant: "default" | "success" | "warning" | "error" | "info";
  }>;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant: "default" | "success" | "warning" | "error" | "info" | "link";
  }>;
  toggleActions?: Array<{
    label: string;
    isActive: boolean;
    onClick: () => void;
    activeVariant: "success" | "warning" | "error" | "info";
    inactiveVariant: "default" | "success" | "warning" | "error" | "info";
  }>;
  metadata?: Array<{
    label: string;
    value: string;
  }>;
}

interface AdminGridProps {
  items: AdminGridItem[];
  emptyMessage?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
  columns?: 2 | 3 | 4;
}

const getBadgeClasses = (variant: string) => {
  const variants = {
    default: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
    success: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
    warning: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
    error: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
    info: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
  };
  return variants[variant as keyof typeof variants] || variants.default;
};

const getActionClasses = (variant: string) => {
  const variants = {
    default: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
    success: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
    warning: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
    error: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
    info: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
    link: "text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300",
  };
  return variants[variant as keyof typeof variants] || variants.default;
};

export const AdminGrid: React.FC<AdminGridProps> = ({
  items,
  emptyMessage = "No items found",
  emptyAction,
  columns = 3,
}) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 mb-4">{emptyMessage}</p>
        {emptyAction && (
          <button
            onClick={emptyAction.onClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
          >
            {emptyAction.label}
          </button>
        )}
      </div>
    );
  }

  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className={`grid gap-6 ${gridCols[columns]}`}>
      {items.map((item) => (
        <Card key={item.id} className="p-6">
          {/* Image/Icon and Title */}
          <div className="flex items-center mb-4">
            {item.image ? (
              <Image
                className="w-12 h-12 rounded-lg object-cover mr-4"
                src={item.image}
                alt={item.imageAlt || item.title}
                width={48}
                height={48}
              />
            ) : item.icon ? (
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${item.iconBg || 'bg-gray-200 dark:bg-gray-700'}`}>
                {item.icon}
              </div>
            ) : (
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-4">
                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  {item.title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {item.title}
              </h3>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
              {item.description}
            </p>
          )}

          {/* Metadata */}
          {item.metadata && item.metadata.length > 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {item.metadata
                .map((meta) => `${meta.label}: ${meta.value}`)
                .join(" • ")}
            </div>
          )}

          {/* Badges and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {item.badges?.map((badge, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 text-xs rounded-full ${getBadgeClasses(badge.variant)}`}
                >
                  {badge.label}
                </span>
              ))}
              {item.toggleActions?.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`px-2 py-1 text-xs rounded-full ${getActionClasses(
                    action.isActive ? action.activeVariant : action.inactiveVariant
                  )}`}
                >
                  {action.label}
                </button>
              ))}
            </div>
            <div className="flex space-x-2">
              {item.actions?.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`text-sm ${
                    action.variant === "link"
                      ? getActionClasses(action.variant)
                      : `px-3 py-1 text-xs rounded-full ${getActionClasses(action.variant)}`
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
