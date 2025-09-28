"use client";

import React from "react";
import { cn } from "@/lib/utils/utils";

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  description?: string;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  children,
  description,
  className,
}) => {
  return (
    <div className={cn("", className)}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {description && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
};
