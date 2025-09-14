"use client";

import React from "react";
import { Card, Button } from "@/components/ui";
import { Search, Filter, X } from "lucide-react";

interface BlogFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: "newest" | "oldest" | "popular";
  onSortChange: (sort: "newest" | "oldest" | "popular") => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const BlogFilters: React.FC<BlogFiltersProps> = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  onClearFilters,
  hasActiveFilters,
}) => {
  return (
    <Card className="p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) =>
            onSortChange(e.target.value as "newest" | "oldest" | "popular")
          }
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="popular">Most Popular</option>
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="whitespace-nowrap"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>
    </Card>
  );
};
