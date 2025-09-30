"use client";

import { useState } from "react";
import { useIdeas, useCreateIdea, useUpdateIdea, useDeleteIdea } from "@/hooks/money";
import type { Idea } from "@/types/money";
import { IdeaForm } from "@/components/pages/admin/money";
import { FormModal } from "@/components/common/FormModal";
import { Button } from "@/components/ui";
import { Plus, Edit, Trash2, Eye, EyeOff, Star } from "lucide-react";

export default function IdeasAdminPage() {
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: ideas, isLoading } = useIdeas();
  const createMutation = useCreateIdea();
  const updateMutation = useUpdateIdea();
  const deleteMutation = useDeleteIdea();

  const handleCreate = () => {
    setSelectedIdea(null);
    setIsFormOpen(true);
  };

  const handleEdit = (idea: Idea) => {
    setSelectedIdea(idea);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this idea?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedIdea) {
        await updateMutation.mutateAsync({
          id: selectedIdea.id,
          idea: data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }
      setIsFormOpen(false);
      setSelectedIdea(null);
    } catch (error) {
      console.error("Error submitting idea:", error);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setSelectedIdea(null);
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ideas Management</h1>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Idea
        </Button>
      </div>

      {!ideas || ideas.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">No ideas yet</p>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Idea
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{idea.title}</h3>
                    {idea.featured && (
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    )}
                    {!idea.visible && (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    )}
                    {idea.public && (
                      <Eye className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    Slug: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{idea.slug}</code>
                  </p>
                  {idea.description && (
                    <p className="mt-2 text-gray-700 dark:text-gray-300">{idea.description}</p>
                  )}
                  <div className="mt-3 flex gap-2">
                    {idea.visible && (
                      <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded">
                        Visible
                      </span>
                    )}
                    {idea.featured && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                    {idea.public && (
                      <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded">
                        Public
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(idea)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(idea.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <FormModal
        isOpen={isFormOpen}
        onClose={handleCancel}
        title={selectedIdea ? "Edit Idea" : "Create New Idea"}
        size="xl"
        scrollable={true}
        maxHeight="90vh"
      >
        <IdeaForm
          idea={selectedIdea}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </FormModal>
    </div>
  );
}
