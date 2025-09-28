"use client";

import React from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils/utils";

interface AdminFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  className?: string;
}

export const AdminForm: React.FC<AdminFormProps> = ({
  children,
  onSubmit,
  onCancel,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  isLoading = false,
  className,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className={cn("space-y-6 animate-fade-in-up", className)}
    >
      <div
        className="animate-fade-in"
        style={{ animationDelay: "100ms", animationFillMode: "both" }}
      >
        {children}
      </div>

      {/* Actions */}
      <div
        className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fade-in"
        style={{ animationDelay: "200ms", animationFillMode: "both" }}
      >
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="transition-all duration-200 hover:scale-105 active:scale-95"
        >
          {cancelLabel}
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-105 active:scale-95"
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </div>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
};
