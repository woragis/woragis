"use client";

import React from "react";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSectionProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: (e: React.FormEvent) => void;
  searchPlaceholder?: string;
  filterOptions?: FilterOption[];
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  additionalFilters?: React.ReactNode;
  className?: string;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = "Search...",
  filterOptions = [],
  selectedFilter,
  onFilterChange,
  additionalFilters,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 p-4 rounded-lg shadow animate-fade-in-up transition-all duration-300 hover:shadow-lg mb-6",
        className
      )}
    >
      <div className="animate-fade-in">
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          onSubmit={onSearchSubmit}
          placeholder={searchPlaceholder}
        />
      </div>

      {(filterOptions.length > 0 || additionalFilters) && (
        <div
          className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up"
          style={{ animationDelay: "100ms", animationFillMode: "both" }}
        >
          {filterOptions.length > 0 && (
            <div
              className="animate-fade-in"
              style={{ animationDelay: "150ms", animationFillMode: "both" }}
            >
              <FilterTabs
                options={filterOptions}
                selectedValue={selectedFilter}
                onValueChange={onFilterChange}
              />
            </div>
          )}
          {additionalFilters && (
            <div
              className="flex items-center gap-4 animate-fade-in"
              style={{ animationDelay: "200ms", animationFillMode: "both" }}
            >
              {additionalFilters}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
