"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DataTableProps {
  children: React.ReactNode;
  className?: string;
}

interface DataTableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface DataTableCellProps {
  children: React.ReactNode;
  className?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md animate-fade-in-up transition-shadow duration-300 hover:shadow-lg",
        className
      )}
    >
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {children}
      </ul>
    </div>
  );
};

export const DataTableRow: React.FC<DataTableRowProps> = ({
  children,
  className,
  onClick,
}) => {
  return (
    <li
      className={cn(
        "px-6 py-4 transition-all duration-200",
        onClick &&
          "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm",
        className
      )}
      onClick={onClick}
    >
      {children}
    </li>
  );
};

export const DataTableCell: React.FC<DataTableCellProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("transition-colors duration-200", className)}>
      {children}
    </div>
  );
};
