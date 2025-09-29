"use client";

import React from "react";
import { useDisplay } from "@/contexts/DisplayContext";
import { Grid3X3, List } from "lucide-react";
import { Button } from "../layout/Button";

interface DisplayToggleProps {
  className?: string;
}

export function DisplayToggle({ className = "" }: DisplayToggleProps) {
  const { displayMode, toggleDisplayMode } = useDisplay();

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <Button
        variant={displayMode === "grid" ? "default" : "outline"}
        size="sm"
        onClick={() => displayMode !== "grid" && toggleDisplayMode()}
        className="p-2"
        title="Grid View"
      >
        <Grid3X3 className="w-4 h-4" />
      </Button>
      <Button
        variant={displayMode === "list" ? "default" : "outline"}
        size="sm"
        onClick={() => displayMode !== "list" && toggleDisplayMode()}
        className="p-2"
        title="List View"
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  );
}
