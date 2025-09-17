import React from "react";

interface ValorantBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: "geometric" | "abstract" | "minimal" | "gradient" | "cyber" | "pixel" | "neon";
}

export const ValorantBackground: React.FC<ValorantBackgroundProps> = ({
  children,
  className = "",
  variant = "geometric",
}) => {
  const getBackgroundClasses = () => {
    switch (variant) {
      case "geometric":
        return "geometric-pattern";
      case "abstract":
        return "abstract-gradient";
      case "minimal":
        return "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800";
      case "gradient":
        return "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-pink-900/20";
      case "cyber":
        return "cyber-grid bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900";
      case "pixel":
        return "pixel-pattern bg-gradient-to-br from-green-900 via-black to-green-800";
      case "neon":
        return "neon-glow bg-gradient-to-br from-purple-900 via-pink-900 to-cyan-900";
      default:
        return "geometric-pattern";
    }
  };

  return (
    <div
      className={`relative overflow-hidden ${getBackgroundClasses()} ${className}`}
    >
      {children}

      {/* Abstract geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="abstract-shape w-32 h-32 top-10 left-10 animate-float"></div>
        <div className="abstract-shape w-24 h-24 top-1/4 right-20 animate-float"></div>
        <div className="abstract-shape w-40 h-40 bottom-20 left-1/4 animate-float"></div>
        <div className="abstract-shape w-20 h-20 bottom-1/3 right-1/3 animate-float"></div>
        <div className="abstract-shape w-28 h-28 top-1/2 left-1/2 animate-float"></div>
      </div>
    </div>
  );
};

export const GeometricPattern: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <div className="geometric-grid w-full h-full opacity-30"></div>
    </div>
  );
};

export const AbstractShapes: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      <div className="abstract-shape w-32 h-32 top-10 left-10 animate-float"></div>
      <div className="abstract-shape w-24 h-24 top-1/4 right-20 animate-float"></div>
      <div className="abstract-shape w-40 h-40 bottom-20 left-1/4 animate-float"></div>
      <div className="abstract-shape w-20 h-20 bottom-1/3 right-1/3 animate-float"></div>
      <div className="abstract-shape w-28 h-28 top-1/2 left-1/2 animate-float"></div>
    </div>
  );
};
