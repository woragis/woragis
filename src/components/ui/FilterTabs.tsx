"use client";

import React from "react";
import { cn } from "@/lib/utils/utils";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterTabsProps {
  options: FilterOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
  options,
  selectedValue,
  onValueChange,
  className,
}) => {
  return (
    <div className={cn("flex space-x-1", className)}>
      {options.map((option, index) => (
        <button
          key={option.value}
          onClick={() => onValueChange(option.value)}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 active:scale-95 animate-fade-in",
            selectedValue === option.value
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 shadow-sm"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
          style={{
            animationDelay: `${index * 50}ms`,
            animationFillMode: "both",
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
