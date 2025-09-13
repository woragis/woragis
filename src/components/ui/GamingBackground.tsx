import React from "react";

interface GamingBackgroundProps {
  variant?: "matrix" | "cyber" | "pixel" | "neon" | "retro";
  className?: string;
  children?: React.ReactNode;
}

export const GamingBackground: React.FC<GamingBackgroundProps> = ({
  variant = "matrix",
  className = "",
  children,
}) => {
  const getBackgroundClasses = () => {
    switch (variant) {
      case "matrix":
        return "matrix-bg cyber-grid";
      case "cyber":
        return "cyber-grid bg-gradient-to-br from-black via-gray-900 to-black";
      case "pixel":
        return "pixel-grid bg-gradient-to-br from-gray-900 to-black";
      case "neon":
        return "bg-gradient-to-br from-black via-purple-900 to-black";
      case "retro":
        return "bg-gradient-to-br from-gray-800 via-gray-900 to-black";
      default:
        return "matrix-bg cyber-grid";
    }
  };

  return (
    <div className={`relative ${getBackgroundClasses()} ${className}`}>
      {children}

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-green-400 animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Floating gaming elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 ${
              i % 4 === 0
                ? "bg-cyan-400"
                : i % 4 === 1
                ? "bg-pink-400"
                : i % 4 === 2
                ? "bg-yellow-400"
                : "bg-green-400"
            } animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
            linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>
    </div>
  );
};

export const MatrixRain: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="absolute text-green-400 font-mono text-xs opacity-30 animate-matrix-rain"
          style={{
            left: `${i * 10}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          {Array.from({ length: 20 }).map((_, j) => (
            <div key={j} className="mb-1">
              {String.fromCharCode(0x30a0 + Math.random() * 96)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const CyberGrid: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `
          linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
        `,
          backgroundSize: "100px 100px",
          animation: "cyberGrid 10s linear infinite",
        }}
      />
    </div>
  );
};

export const PixelPattern: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `
          linear-gradient(rgba(0, 255, 65, 0.05) 2px, transparent 2px),
          linear-gradient(90deg, rgba(0, 255, 65, 0.05) 2px, transparent 2px)
        `,
          backgroundSize: "20px 20px",
        }}
      />
    </div>
  );
};

export const NeonGlow: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <div className="w-full h-full bg-gradient-to-r from-cyan-500/10 via-green-500/10 to-pink-500/10 animate-gradient" />
    </div>
  );
};
