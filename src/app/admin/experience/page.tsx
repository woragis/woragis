"use client";

import { useState, useCallback } from "react";
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading experience entries</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Experience
        </h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Experience
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            placeholder="Search experience entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            type="submit"
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Search
          </button>
        </form>
      </div>

      {/* Experience Table */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredExperiences.map((experience) => (
            <li key={experience.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xl">
                      {experience.icon}
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {experience.title}
                      </h3>
                      {!experience.visible && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                      {experience.company}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {experience.period} • {experience.location}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {experience.description}
                    </p>
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {experience.technologies
                          .slice(0, 3)
                          .map((tech, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        {experience.technologies.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                            +{experience.technologies.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleVisible(experience.id)}
                    className={`px-3 py-1 text-xs rounded-full ${
                      experience.visible
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                    }`}
                  >
                    {experience.visible ? "Visible" : "Hidden"}
                  </button>
                  <button
                    onClick={() => handleEditExperience(experience)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(experience)}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

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
    </div>
  );
}
