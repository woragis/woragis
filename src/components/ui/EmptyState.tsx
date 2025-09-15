import React from "react";
import { Card } from "./Card";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ComponentType<any> | React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className = "",
}) => {
  return (
    <Card className={`p-12 text-center animate-fade-in-up ${className}`}>
      {icon && (
        <div
          className="mb-4 flex justify-center animate-fade-in"
          style={{ animationDelay: "100ms", animationFillMode: "both" }}
        >
          {React.isValidElement(icon)
            ? icon
            : React.createElement(icon as React.ComponentType<any>, {
                className:
                  "w-12 h-12 text-gray-400 transition-colors duration-200",
              })}
        </div>
      )}
      <h3
        className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-200 animate-fade-in"
        style={{ animationDelay: "200ms", animationFillMode: "both" }}
      >
        {title}
      </h3>
      <p
        className="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-200 animate-fade-in"
        style={{ animationDelay: "300ms", animationFillMode: "both" }}
      >
        {description}
      </p>
      {actionLabel && onAction && (
        <div
          className="animate-fade-in"
          style={{ animationDelay: "400ms", animationFillMode: "both" }}
        >
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </Card>
  );
};
