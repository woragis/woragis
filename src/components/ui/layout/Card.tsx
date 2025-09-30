import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: "default" | "modern" | "glass" | "gradient" | "geometric" | "gaming";
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hover = false,
  variant = "default",
}) => {
  const variantClasses = {
    default: "modern-card p-6",
    modern: "modern-card p-6",
    glass: "glass-morphism p-6 rounded-xl",
    gradient:
      "bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-indigo-200/50 dark:border-indigo-700/50",
    geometric: "geometric-border p-6",
    gaming: "gaming-card p-6 border border-green-400/30 bg-gray-900/50 backdrop-blur-sm",
  };

  const hoverClasses = hover
    ? "hover:shadow-xl hover:scale-105 transition-all duration-300"
    : "transition-all duration-200";

  return (
    <div
      className={`${variantClasses[variant]} ${hoverClasses} animate-fade-in-up ${className}`}
    >
      {children}
    </div>
  );
};

// Re-export Card sub-components
export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./CardComponents";
