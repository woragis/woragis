"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/utils";

interface ItemCardProps {
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  badges?: React.ReactNode[];
  actions?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  title,
  description,
  image,
  imageAlt,
  badges,
  actions,
  onClick,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 animate-fade-in-up",
        onClick &&
          "cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-out",
        !onClick && "hover:shadow-md transition-shadow duration-200",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start space-x-4 group">
        {image && (
          <div className="flex-shrink-0">
            <Image
              className="h-12 w-12 rounded-lg object-cover transition-transform duration-300 group-hover:scale-110"
              src={image}
              alt={imageAlt || title}
              width={48}
              height={48}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate transition-colors duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 transition-colors duration-200">
              {description}
            </p>
          )}
          {badges && badges.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {badges.map((badge, index) => (
                <div
                  key={index}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "both",
                  }}
                >
                  {badge}
                </div>
              ))}
            </div>
          )}
        </div>
        {actions && (
          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
