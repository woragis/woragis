"use client";

import React, { useState, useCallback } from "react";
import {
  Section,
  Container,
  Card,
  Button,
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
import { useDisplay } from "@/contexts/DisplayContext";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Briefcase,
  Eye,
  EyeOff,
  Calendar,
  Hash,
  MapPin,
  Code,
} from "lucide-react";

export default function ExperienceAdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [createFormData, setCreateFormData] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);

  const { user } = useAuth();
  const { displayMode } = useDisplay();
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

        {/* Experience Display */}
        {filteredExperiences.length === 0 ? (
          <EmptyState
            title="No Experience Found"
            description="No experience entries match your current filters. Try adjusting your search criteria or add a new experience entry."
            actionLabel="Add Experience"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : displayMode === "grid" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExperiences.map((experience) => (
              <Card key={experience.id} hover className="flex flex-col h-full">
                <div className="p-6 flex flex-col h-full">
                  {/* Header with actions */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-4">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {experience.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {experience.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditExperience(experience)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(experience)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
                    {experience.description}
                  </p>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      {experience.period}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-1" />
                      {experience.location}
                    </div>
                    {experience.technologies && experience.technologies.length > 0 && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Code className="w-4 h-4 mr-1" />
                        {experience.technologies.slice(0, 3).join(", ")}
                        {experience.technologies.length > 3 && "..."}
                      </div>
                    )}
                  </div>

                  {/* Status badges */}
                  <div className="flex flex-wrap gap-2">
                    {experience.visible ? (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                        <Eye className="w-3 h-3 inline mr-1" />
                        Visible
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                        <EyeOff className="w-3 h-3 inline mr-1" />
                        Hidden
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredExperiences.map((experience) => (
              <Card key={experience.id} hover>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {experience.title}
                          </h3>
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            {experience.company}
                          </span>
                          {!experience.visible && (
                            <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                              <EyeOff className="w-3 h-3 inline mr-1" />
                              Hidden
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-1">
                          {experience.description}
                        </p>
                        <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {experience.period}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {experience.location}
                          </div>
                          {experience.technologies && experience.technologies.length > 0 && (
                            <div className="flex items-center">
                              <Code className="w-3 h-3 mr-1" />
                              {experience.technologies.slice(0, 2).join(", ")}
                              {experience.technologies.length > 2 && "..."}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditExperience(experience)}
                        className="p-1.5"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(experience)}
                        className="text-red-600 hover:text-red-700 p-1.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

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
