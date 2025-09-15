"use client";

import React from "react";
import { Eye, EyeOff, Edit, Trash2, UserCircle } from "lucide-react";
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
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <div className="px-6 py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading about information...
          </p>
        </div>
      </div>
    );
  }

  if (!aboutCore) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <div className="px-6 py-12 text-center">
          <UserCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No About Information
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You haven't set up your about information yet. Create your profile
            to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        <li className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCircle className="h-10 w-10 text-blue-500" />
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {aboutCore.name}
                  </h3>
                  {aboutCore.featuredBiography && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                      Featured
                    </span>
                  )}
                  {!aboutCore.visible && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {aboutCore.biography || "No biography set"}
                </p>
                {aboutCore.currentProfessionId && (
                  <div className="mt-1">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      Current Profession: {aboutCore.currentProfessionId}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onToggleVisibility}
                className={`px-3 py-1 text-xs rounded-full ${
                  aboutCore.visible
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                    : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                }`}
              >
                {aboutCore.visible ? (
                  <>
                    <Eye className="w-3 h-3 inline mr-1" />
                    Visible
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3 h-3 inline mr-1" />
                    Hidden
                  </>
                )}
              </button>
              <button
                onClick={onEdit}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm flex items-center"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button
                onClick={onDelete}
                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-sm flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};
