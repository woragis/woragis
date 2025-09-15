"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface FormCheckboxProps {
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  description?: string;
  className?: string;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  name,
  checked,
  onChange,
  label,
  description,
  className,
}) => {
  return (
    <div className={cn("flex items-start", className)}>
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
        />
      </div>
      <div className="ml-3 text-sm">
        <label className="font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {description && (
          <p className="text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
    </div>
  );
};
