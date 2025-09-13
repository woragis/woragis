import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: "default" | "gaming" | "neon" | "cyber";
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hover = false,
  variant = "default",
}) => {
  const variantClasses = {
    default:
      "bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6",
    gaming: "gaming-card p-6",
    neon: "bg-black border-2 border-cyan-400 rounded-lg p-6 text-cyan-400 shadow-lg shadow-cyan-400/20",
    cyber:
      "bg-black border-2 border-pink-400 rounded-lg p-6 text-pink-400 shadow-lg shadow-pink-400/20",
  };

  const hoverClasses = hover
    ? "hover:shadow-xl hover:scale-105 transition-all duration-300"
    : "";

  return (
    <div className={`${variantClasses[variant]} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};
