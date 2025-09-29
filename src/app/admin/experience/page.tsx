"use client";

import React, { useState, useCallback } from "react";
import {
  Container,
  Card,
  Button,
  AdminList,
  EmptyState,
  DisplayToggle,
} from "@/components/ui";
import {
  useExperience,
  useDeleteExperience,
  useToggleExperienceVisible,
  useCreateExperience,
  useUpdateExperience,
} from "@/hooks/useExperience";
import { ExperienceFormData, Experience } from "@/types";
import { ExperienceForm } from "@/components/pages/admin/experience";
import { DeleteConfirmationModal } from "@/components/pages/admin/DeleteConfirmationModal";
import { CreateEditModal } from "@/components/common";
import { useAuth } from "@/stores/auth-store";
import type { AdminListItem } from "@/components/ui/AdminList";
import { Search, Plus } from "lucide-react";

export default function ExperienceAdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [createFormData, setCreateFormData] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);

  const { user } = useAuth();
  const { data: experiences, isLoading, error } = useExperience();
  const deleteExperience = useDeleteExperience();
  const toggleVisible = useToggleExperienceVisible();
  const createExperience = useCreateExperience();
  const updateExperience = useUpdateExperience();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality can be implemented here
  };

  const handleDelete = (experience: Experience) => {
    setSelectedExperience(experience);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedExperience) return;

    try {
      await deleteExperience.mutateAsync(selectedExperience.id);
      setIsDeleteModalOpen(false);
      setSelectedExperience(null);
    } catch (error) {
      console.error("Failed to delete experience:", error);
    }
  };

  const handleToggleVisible = async (id: string) => {
    await toggleVisible.mutateAsync(id);
  };

  // Create experience
  const handleCreateExperience = useCallback(async (experienceData: ExperienceFormData) => {
    try {
      await createExperience.mutateAsync(experienceData);
      setIsCreateModalOpen(false);
      setCreateFormData(null);
    } catch (error) {
      console.error("Failed to create experience:", error);
    }
  }, [createExperience]);

  const handleCreateSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (createFormData) {
      handleCreateExperience(createFormData);
    }
  }, [createFormData]);

  // Edit experience
  const handleEditExperience = (experience: Experience) => {
    setSelectedExperience(experience);
    setIsEditModalOpen(true);
  };

  const handleUpdateExperience = useCallback(async (experienceData: ExperienceFormData) => {
    if (!selectedExperience) return;

    try {
      await updateExperience.mutateAsync({
        id: selectedExperience.id || "",
        data: experienceData,
      });
      setIsEditModalOpen(false);
      setSelectedExperience(null);
      setEditFormData(null);
    } catch (error) {
      console.error("Failed to update experience:", error);
    }
  }, [selectedExperience, updateExperience]);

  const handleEditSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (editFormData && selectedExperience) {
      handleUpdateExperience(editFormData);
    }
  }, [editFormData, selectedExperience]);

  const filteredExperiences =
    experiences?.filter(
      (exp) =>
        exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.company.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Experience
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage your professional experience and career history
            </p>
          </div>

          {/* Search and Filter Skeleton */}
          <Card className="p-6 mb-8 animate-pulse">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
              <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </Card>

          {/* Experience Grid Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="p-6">
                  {/* Header with actions */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mr-4"></div>
                      <div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-28"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/5"></div>
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-2">
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <Container>
          <EmptyState
            title="Unable to Load Experience"
            description="There was an error loading the experience entries. Please try again later."
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <Container>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Experience
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
            Manage your professional experience and career history
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search experience entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>
            <Button type="submit" variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <DisplayToggle />
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </form>
        </Card>

        {/* Experience List */}
        <AdminList
          items={filteredExperiences.map((experience): AdminListItem => ({
            id: experience.id,
            title: experience.title,
            description: `${experience.company} • ${experience.period} • ${experience.location}`,
            badges: !experience.visible ? [{ label: "Hidden", variant: "error" }] : undefined,
            metadata: [
              { label: "Description", value: experience.description },
              ...(experience.technologies.length > 0 ? [
                { 
                  label: "Technologies", 
                  value: experience.technologies.slice(0, 3).join(", ") + 
                         (experience.technologies.length > 3 ? ` +${experience.technologies.length - 3} more` : "")
                }
              ] : [])
            ],
            toggleActions: [
              {
                label: experience.visible ? "Visible" : "Hidden",
                isActive: experience.visible,
                onClick: () => handleToggleVisible(experience.id),
                activeVariant: "success",
                inactiveVariant: "error"
              }
            ],
            actions: [
              {
                label: "Edit",
                onClick: () => handleEditExperience(experience),
                variant: "link"
              },
              {
                label: "Delete",
                onClick: () => handleDelete(experience),
                variant: "link"
              }
            ]
          }))}
          emptyMessage="No experience entries found"
          emptyAction={{
            label: "Add Experience",
            onClick: () => setIsCreateModalOpen(true)
          }}
        />

      {/* Create Experience Modal */}
      <CreateEditModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setCreateFormData(null);
        }}
        isEdit={false}
        itemName="Experience"
        size="lg"
        onSubmit={handleCreateSubmit}
        onCancel={() => {
          setIsCreateModalOpen(false);
          setCreateFormData(null);
        }}
        isLoading={createExperience.isPending}
        maxHeight="90vh"
      >
        <ExperienceForm
          userId={user?.id || ""}
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createExperience.isPending}
          onFormDataChange={setCreateFormData}
        />
      </CreateEditModal>

      {/* Edit Experience Modal */}
      <CreateEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedExperience(null);
          setEditFormData(null);
        }}
        isEdit={true}
        itemName="Experience"
        size="lg"
        onSubmit={handleEditSubmit}
        onCancel={() => {
          setIsEditModalOpen(false);
          setSelectedExperience(null);
          setEditFormData(null);
        }}
        isLoading={updateExperience.isPending}
        maxHeight="90vh"
      >
        {selectedExperience && (
          <ExperienceForm
            experience={selectedExperience}
            userId={user?.id || ""}
            onSubmit={handleEditSubmit}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedExperience(null);
            }}
            isLoading={updateExperience.isPending}
            onFormDataChange={setEditFormData}
          />
        )}
      </CreateEditModal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedExperience(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Experience Entry"
        message="Are you sure you want to delete this experience entry? This action cannot be undone."
        itemName={selectedExperience?.title}
        isLoading={deleteExperience.isPending}
      />
      </Container>
    </div>
  );
}
