"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex justify-between items-center animate-fade-in-up",
        className
      )}
    >
      <div
        className="animate-fade-in"
        style={{ animationDelay: "100ms", animationFillMode: "both" }}
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
          {title}
        </h1>
        {description && (
          <p
            className="text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-200 animate-fade-in"
            style={{ animationDelay: "200ms", animationFillMode: "both" }}
          >
            {description}
          </p>
        )}
      </div>
      {children && (
        <div
          className="flex gap-3 animate-fade-in"
          style={{ animationDelay: "300ms", animationFillMode: "both" }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
