"use client";

import React from "react";
import Image from "next/image";

export interface AdminListItem {
  id: string;
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
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

interface AdminListProps {
  items: AdminListItem[];
  emptyMessage?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
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

export const AdminList: React.FC<AdminListProps> = ({
  items,
  emptyMessage = "No items found",
  emptyAction,
}) => {
  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <div className="px-6 py-12 text-center">
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
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {items.map((item) => (
          <li key={item.id} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {item.image ? (
                    <Image
                      className="h-10 w-10 rounded-lg object-cover"
                      src={item.image}
                      alt={item.imageAlt || item.title}
                      width={40}
                      height={40}
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                        {item.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    {item.badges?.map((badge, index) => (
                      <span
                        key={index}
                        className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeClasses(
                          badge.variant
                        )}`}
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.description}
                    </p>
                  )}
                  {item.metadata && item.metadata.length > 0 && (
                    <div className="mt-1">
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {item.metadata
                          .map((meta) => `${meta.label}: ${meta.value}`)
                          .join(" • ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {item.toggleActions?.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`px-3 py-1 text-xs rounded-full ${getActionClasses(
                      action.isActive ? action.activeVariant : action.inactiveVariant
                    )}`}
                  >
                    {action.label}
                  </button>
                ))}
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
          </li>
        ))}
      </ul>
    </div>
  );
};
