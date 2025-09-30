"use client";

import { useState } from "react";
import { useIdeas } from "@/hooks/money";
import { IdeaCanvas } from "@/components/pages/admin/money";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

export default function IdeaCanvasPage() {
  const { data: ideas, isLoading } = useIdeas();
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>("");

  if (isLoading) {
    return <div className="p-8">Loading ideas...</div>;
  }

  if (!ideas || ideas.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Idea Canvas</h1>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <p className="text-yellow-800 dark:text-yellow-200">
            No ideas found. Please create an idea first from the Ideas page.
          </p>
          <Button
            className="mt-4"
            onClick={() => (window.location.href = "/admin/money/ideas")}
          >
            Go to Ideas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Idea Canvas</h1>
        <div className="w-64">
          <Select value={selectedIdeaId} onValueChange={setSelectedIdeaId}>
            <SelectTrigger>
              <SelectValue placeholder="Select an idea" />
            </SelectTrigger>
            <SelectContent>
              {ideas.map((idea) => (
                <SelectItem key={idea.id} value={idea.id}>
                  {idea.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedIdeaId ? (
        <IdeaCanvas ideaId={selectedIdeaId} />
      ) : (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center bg-gray-50 dark:bg-gray-800/50">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Select an idea from the dropdown above to view and edit its canvas
          </p>
        </div>
      )}
    </div>
  );
}
