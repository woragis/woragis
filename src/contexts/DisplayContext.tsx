"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type DisplayMode = "grid" | "list";

interface DisplayContextType {
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  toggleDisplayMode: () => void;
}

const DisplayContext = createContext<DisplayContextType | undefined>(undefined);

export function DisplayProvider({ children }: { children: React.ReactNode }) {
  const [displayMode, setDisplayModeState] = useState<DisplayMode>("grid");
  const [isInitialized, setIsInitialized] = useState(false);

  // Load display mode from localStorage on mount
  useEffect(() => {
    const savedDisplayMode = localStorage.getItem("display-mode") as DisplayMode;
    if (savedDisplayMode && (savedDisplayMode === "grid" || savedDisplayMode === "list")) {
      setDisplayModeState(savedDisplayMode);
    }
    setIsInitialized(true);
  }, []);

  // Save display mode to localStorage when it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("display-mode", displayMode);
    }
  }, [displayMode, isInitialized]);

  const setDisplayMode = (mode: DisplayMode) => {
    setDisplayModeState(mode);
  };

  const toggleDisplayMode = () => {
    setDisplayModeState(prev => prev === "grid" ? "list" : "grid");
  };

  return (
    <DisplayContext.Provider
      value={{
        displayMode,
        setDisplayMode,
        toggleDisplayMode,
      }}
    >
      {children}
    </DisplayContext.Provider>
  );
}

export function useDisplay() {
  const context = useContext(DisplayContext);
  if (context === undefined) {
    throw new Error("useDisplay must be used within a DisplayProvider");
  }
  return context;
}
