"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

// Helper function to get system preference
const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

// Helper function to get initial theme
const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "system";
  const savedTheme = localStorage.getItem("theme") as Theme;
  return savedTheme && ["light", "dark", "system"].includes(savedTheme)
    ? savedTheme
    : "system";
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("system");
  const [actualTheme, setActualTheme] = useState<"light" | "dark">("light");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const initialTheme = getInitialTheme();
    const systemTheme = getSystemTheme();

    setTheme(initialTheme);

    // Set actual theme based on initial theme
    if (initialTheme === "system") {
      setActualTheme(systemTheme);
    } else {
      setActualTheme(initialTheme);
    }

    setIsInitialized(true);
  }, []);

  // Update actual theme when theme changes
  useEffect(() => {
    if (!isInitialized) return;

    const root = window.document.documentElement;
    let resolvedTheme: "light" | "dark";

    if (theme === "system") {
      resolvedTheme = getSystemTheme();
    } else {
      resolvedTheme = theme;
    }

    setActualTheme(resolvedTheme);

    // Remove previous theme classes
    root.classList.remove("light", "dark");
    // Add current theme class
    root.classList.add(resolvedTheme);
  }, [theme, isInitialized]);

  // Listen for system theme changes when theme is set to "system"
  useEffect(() => {
    if (!isInitialized || theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const systemTheme = getSystemTheme();
      setActualTheme(systemTheme);

      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(systemTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, isInitialized]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
    }
  };

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme: handleSetTheme, actualTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
