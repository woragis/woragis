"use client";

import React from "react";
import { cn } from "@/lib/utils/utils";

interface FormInputProps {
  type?: "text" | "email" | "url" | "number" | "password";
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  min,
  max,
  step,
  className,
}) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      min={min}
      max={max}
      step={step}
      className={cn(
        "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 hover:shadow-md focus:shadow-lg animate-fade-in",
        className
      )}
    />
  );
};
